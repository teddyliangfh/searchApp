"use strict";

const fs = require("fs");
//get data ready
const ticketsData = fs.readFileSync("./data/tickets.json");
const usersData = fs.readFileSync("./data/users.json");

const tickets = JSON.parse(ticketsData);
const users = JSON.parse(usersData);

//search func
function searchByKeyword(keyword, term, profile) {
  const matchData = (profile || []).filter(
    (profile) => profile[term] === keyword
  );
  // console.log("matchData", matchData);
  return matchData;
}

function searchTickets(keyword, term) {
  //result including all informaton in ticket
  //_id
  //created_at
  //subject
  //assignee_id
  //tags
  //---------------------from usersData
  //assignee_name
  const selectedTickets = searchByKeyword(keyword, term, tickets);
  //add assignee_name
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
  //results:
  // "_id": 74,
  //"name":
  //"created_at"
  //"verified"
  //--------------------from tickets data
  //tickets
  const selectedUsers = searchByKeyword(keyword, term, users);
  const fullInfoUsers = selectedUsers.map((item) => {
    let newInfo = searchByKeyword(item?._id, "assignee_id", tickets)[0]
      ?.subject;
    item.tickets = newInfo;
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

//interact with user:
var inquirer = require("inquirer");
const promptList = [
  {
    type: "expand",
    message:
      "Welcome to Zendesk Search, 1) press 1 to search users 2)press 2 to search tickets",
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
inquirer.prompt(promptList).then((answers) => {
  console.log(
    `searching ${answers.searchType} for${answers.term} with a value of ${answers.searchValue}`,
    answers
  );
  dealAnswers(answers);
});

// show the search result in the way people can read
function showResult(result) {
  result.map((item) => {
    console.log(item);
  });
}
// searchByKeyword(75, "_id", users);
// searchTickets("problem", "type");
// searchUsers(false, "verified");
// console.log("my%scat%s", "猫", 3);
