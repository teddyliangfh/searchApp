"use strict";

const fs = require("fs");
//get data ready
const ticketsData = fs.readFileSync("./data/tickets.json");
const usersData = fs.readFileSync("./data/users.json");

const tickets = JSON.parse(ticketsData);
const users = JSON.parse(usersData);

//search func, input: keyword: the search value, term: the field eg:_id, profile: data source
function searchByKeyword(keyword, term, profile) {
  const matchData = (profile || []).filter(
    (profile) => profile[term] === keyword
  );
  // console.log("matchData", matchData);
  return matchData;
}

function searchTickets(keyword, term) {
  const selectedTickets = searchByKeyword(keyword, term, tickets);
  //add assignee_name --from usersData
  const fullInfoTickets = selectedTickets.map((item) => {
    let newProperty = searchByKeyword(item?.assignee_id, "_id", users)[0]?.name;
    console.log("newProperty", newProperty);
    item.assignee_name = newProperty;
    return item;
  });
  // console.log("fullInfoTickets", fullInfoTickets);
  showResult(fullInfoTickets);
}

function searchUsers(keyword, term) {
  //add tickets --from tickets data
  const selectedUsers = searchByKeyword(keyword, term, users);
  const fullInfoUsers = selectedUsers.map((item) => {
    // let newInfo = searchByKeyword(item?._id, "assignee_id", tickets)[0]?.subject;
    let newInfos = searchByKeyword(item?._id, "assignee_id", tickets);
    let ticketsArr = [];
    newInfos.forEach((item) => {
      ticketsArr.push(item.subject);
    });
    item.tickets = ticketsArr;
    return item;
  });
  // console.log("fullInfoUsers", fullInfoUsers);
  showResult(fullInfoUsers);
  // return fullInfoUsers;
}

function dealAnswers(answers) {
  const { searchType, term, searchValue } = answers;
  if (answers && searchType === "user") {
    let tempValue = searchValue;
    //when term is verified change datatype to boolean
    if (term === "verfied") {
      tempValue === "true" ? (tempValue = true) : (tempValue = false);
    }
    //when term is _id change data type to number
    if (term === "_id") {
      tempValue = parseInt(tempValue);
    }
    searchUsers(tempValue, term);
  } else if (answers && searchType === "tickets") {
    //when term is assignee_id, change dataType to int
    let passValue = searchValue;
    if (term === "assignee_id") {
      passValue = parseInt(passValue);
    }
    searchTickets(passValue, answers.term);
  }
}

// show the search result in the way people can read
function showResult(result) {
  if (result && result.length > 0) {
    result.map((item) => {
      console.log(item);
    });
  } else {
    console.log("sorry, no result found");
  }
}

//interact with user:
var inquirer = require("inquirer");
const promptList = [
  {
    type: "expand",
    message:
      "Welcome to Zendesk Search \n 1) press 1 to search users \n 2)press 2 to search tickets",
    name: "searchType",
    choices: [
      {
        key: "1",
        name: "user",
        value: "user",
      },
      {
        key: "2",
        name: "tickets",
        value: "tickets",
      },
    ],
  },
  {
    type: "input",
    name: "term",
    message: "Enter search term",
  },
  {
    type: "input",
    name: "searchValue",
    message: "Enter search value",
  },
];

inquirer
  .prompt(promptList)
  .then((answers) => {
    console.log(
      `searching ${answers.searchType} for ${answers.term} with a value of ${answers.searchValue}`
    );
    dealAnswers(answers);
  })
  .catch((error) => {
    if (error.isTtyError) {
    } else {
      throw error;
    }
  });
