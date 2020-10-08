const mysql = require("mysql");
const inquirer = require("inquirer")

// ANCHOR MySQL
let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "123",
    database: "team_payroll_DB"
});

connection.connect(err => {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId);
});

// ANCHOR Inquiry

