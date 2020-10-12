const inquirer = require("inquirer");
const cTable = require("console.table");

const style = require("./style");
const Database = require("./connection");

const titlePrompt = [
    {
        name: "main",
        type: "list",
        message: style.question("What would you like to do?"),
        choices: [
            "View Employees",
            "View Departments",
            "View Positions",
            ]
    }
]

const employeePrompt = [
    {
        name: "main",
        type: "list",
        choices: async() => {
            let employees = await Database.read("employees");
            let choices = [];
            for (let employee of employees) {
                let newChoice = employee.first_name + " " + employee.last_name;
                choices.push(newChoice);
            }
            return choices;
        }
    }
]

const departmentPrompt = [

]

const positionPrompt = [

]
//

//
// Functions
//

async function startEmployeePrompt() {
    await inquirer.prompt(employeePrompt);
}

exports.startTitlePrompt = async() => {
    style.clear();
    await inquirer.prompt(titlePrompt).then(answers => {
        if(answers.main === "View Employees") {
            startEmployeePrompt();
        }
        else if (answers.main === "View Departments") {

        }
        else if (answers.main === "View Positions") {

        }
    });
}