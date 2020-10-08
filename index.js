const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const chalk = require("chalk");

const prompts = require("./Assets/scripts/prompts");
const Database = require("./Assets/Scripts/connection");

// ANCHOR MySQL
let database = new Database();
console.log("connection port: ", database.port);

database.connection.connect(err => {
    if (err) throw err;
    console.log("Connected as id " + database.connection.threadId);
});

// ANCHOR Inquiry

async function init () {
    // await inquirer.prompt(prompts.mainPrompt);
}

init();