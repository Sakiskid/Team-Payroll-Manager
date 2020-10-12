const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const chalk = require("chalk");

const prompts = require("./Assets/scripts/prompts");
const Database = require("./Assets/Scripts/connection");

// ANCHOR MySQL
Database.connection.connect(err => {
    if (err) throw err;
    // console.debug("[DEBUG] Connected as id " + database.connection.threadId, "on port ", database.connection.port);


});

// ANCHOR Inquiry

async function init () {
    await prompts.startTitlePrompt();
}

init();