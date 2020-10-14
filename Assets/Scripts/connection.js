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
const asyncQuery = util.promisify(db.connection.query.bind(db.connection));

Database.prototype.createEmployee = async function (first_name, last_name, role_id, manager_id) {
    await asyncQuery("INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);", [first_name, last_name, role_id, manager_id])
    .then(res => {

    })
    .catch(err => {
        console.log(err);
    })
}

Database.prototype.createDepartment = async function (department_name){
    await asyncQuery("INSERT INTO departments (department_name) VALUES (?)", [department_name])
    .then(res => {

    }).catch(err => {
        console.log(err);
    });
}

Database.prototype.createRole = async function (title){
    await asyncQuery("INSERT INTO roles (title) VALUES (?)", [title])
    .then(res => {

    }).catch(err => {
        console.log(err);
    });
}

Database.prototype.read = async function (table) {
    let result;
    await asyncQuery("SELECT * FROM ??", [table])
        .then((res) => {
            result = res;
        })
        .catch((err) => {
            console.log("ERROR! ", err);
        });
    return result;
}

Database.prototype.readAndJoinRoleWithDepartment = async function () {
    let result;
    let query = `SELECT departments.department_name, roles.title, roles.id
                    FROM departments
                    INNER JOIN roles
                    ON roles.department_id = departments.id
                    ORDER BY departments.department_name`;
    await asyncQuery(query)
    .then(res => {
        result = res;
    }).catch(err => {
        if (err) throw err;
    });
    return result;
}

Database.prototype.getDepartmentIDUsingRoleID = async function () {
    let result;
    let query = `SELECT department.id
                    FROM departments
                    LEFT JOIN roles
                    ON roles.department_id = departments.id`;
    await asyncQuery(query)
    .then(res => {
        result = res;
    }).catch(err => {
        if (err) throw err;
    })
}

Database.prototype.getManagersInDepartment = async function (departmentId) {
    let result;
    let query = `SELECT employees.id
                    FROM employees
                    LEFT JOIN departments
                    ON employees.`;
    await asyncQuery(query)
    .then(res => {
        result = res;
    }).catch(err => {
        console.log(err);
    });
}

// Log everything into a table
Database.prototype.logAll = async function () {
    await asyncQuery(
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
    await asyncQuery("DELETE FROM ?? WHERE id = ?", [table, id], (err, res) => {
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