const mysql = require("mysql");
const cTable = require("console.table");
const chalk = require("chalk");
const util = require("util");

function Database () {
    this.connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "123",
        database: "team_payroll_DB"
    });
}

// Creating a new static database that will be this modules export
const db = new Database();
// Creating a custom Async Query
const query = util.promisify(db.connection.query.bind(db.connection));

Database.prototype.create = function () {

}

Database.prototype.read = async function (table) {
    let result;
    await query("SELECT * FROM " + table)
        .then((res) => {
            result = res;
        })
        .catch((err) => {
            console.log("ERROR! ", err);
        });
    return result;
}

// Log everything into a table
Database.prototype.logAll = async function () {
    await query(
        `SELECT employees.first_name, employees.last_name, roles.title, roles.salary, departments.department_name
            FROM employees INNER JOIN roles 
            ON employees.role_id = roles.id 
            INNER JOIN departments ON roles.department_id = departments.id;`
    ).then(res => {
            let formatted = convertSqlDataToFormattedObject(res);
            console.table(formatted);
    }).catch(err => {
        console.error("ERROR! ", err);
    });
}

Database.prototype.update = function () {
    
}

Database.prototype.delete = async function (id, table) {
    console.log("deleting employee ID: ", id);
    await query("DELETE FROM ?? WHERE id = ?", [table, id], (err, res) => {
        if(err) throw err;
    })
}

function convertSqlDataToFormattedObject(dataArray) {
    let formattedEmployees = [];

    for (let employee of dataArray) {
        // console.log("Employee: ", employee);
        let newEmployee = {
            "First Name": employee.first_name,
            "Last Name": employee.last_name,
            "Title": employee.title,
            "Salary": employee.salary,
            "Department": employee.department_name
        }
        formattedEmployees.push(newEmployee);
    }
    return formattedEmployees;
}

module.exports = db;