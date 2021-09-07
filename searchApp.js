"use strict";

const fs = require("fs");
//get data ready
const ticketsData = fs.readFileSync("tickets.json");
const usersData = fs.readFileSync("users.json");

const tickets = JSON.parse(ticketsData);
const users = JSON.parse(usersData);
// console.log("tickets", tickets);
// console.log("users", users);

//1)search Users
//2)search tickets

//searchBY
//1) by _id,

//search func
//@inputs:
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
  console.log("fullInfoTickets", fullInfoTickets);
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
  console.log("selectedUsers", selectedUsers);
  const fullInfoUsers = selectedUsers.map((item) => {
    let newInfo = searchByKeyword(item?._id, "assignee_id", tickets)[0]
      ?.subject;
    item.tickets = newInfo;
    return item;
  });
  console.log("fullInfoUsers", fullInfoUsers);
  return fullInfoUsers;
}

// show the search result in the way people can read
function showResult() {}
// searchByKeyword(75, "_id", users);
// searchTickets("problem", "type");
searchUsers(false, "verified");
