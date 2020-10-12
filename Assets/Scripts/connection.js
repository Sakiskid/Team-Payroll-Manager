const mysql = require("mysql");
const cTable = require("console.table");
const chalk = require("chalk");

function Database () {
    this.connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "123",
        database: "team_payroll_DB"
    });
}

Database.prototype.create = function () {

}

Database.prototype.read = function (table) {
    this.connection.query("SELECT " + table, (err, res) => {
        if (err) throw err;
        console.log("Selected: ", res);
    });
}

// Log everything into a table
Database.prototype.logAll = function () {
    this.connection.query(
        `SELECT employees.first_name, employees.last_name, roles.title, roles.salary, departments.department_name
            FROM employees INNER JOIN roles 
            ON employees.role_id = roles.id 
            INNER JOIN departments ON roles.department_id = departments.id;`, 
        (err, res) => {
            if (err) throw err;
            let formatted = convertSqlDataToFormattedObject(res);
            console.table(formatted);
    });
}

Database.prototype.update = function () {
        
}

Database.prototype.delete = function () {

}

function convertSqlDataToFormattedObject(dataArray) {
    let formattedEmployees = [];

    for (let employee of dataArray) {
        console.log("Employee: ", employee);
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

module.exports = Database;