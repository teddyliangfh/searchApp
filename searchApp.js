"use strict";

const fs = require("fs");
//get data ready
const ticketsData = fs.readFileSync("tickets.json");
const usersData = fs.readFileSync("users.json");

const tickets = JSON.parse(ticketsData);
const users = JSON.parse(usersData);
// console.log("tickets", tickets);
// console.log("users", users);

//search fun @input:
function searchByKeyword(keyword, property, profile) {
  const matchIndex = (profile || []).findIndex(
    (profile) => profile[property] === keyword
  );
  console.log("matchIndex", matchIndex);
  console.log(profile[matchIndex]);
  return profile[matchIndex];
}

// show the search result in the way people can read
function showResult() {}
searchByKeyword(75, "_id", users);
