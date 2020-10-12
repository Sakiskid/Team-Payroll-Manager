const inquirer = require("inquirer");
const cTable = require("console.table");

const style = require("./style");

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

]

const departmentPrompt = [

]

const positionPrompt = [

]

exports.startTitlePrompt = async() => {
    style.clear();
    await inquirer.prompt(titlePrompt).then(answers => {
        if(answers.main === "View Employees") {

        }
        else if (answers.main === "View Departments") {

        }
        else if (answers.main === "View Positions") {

        }
    });
}