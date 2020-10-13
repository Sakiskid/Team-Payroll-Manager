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
        name: "employee",
        type: "list",
        message: style.question("Please select an employee"),
        choices: async() => {
            let employees = await Database.read("employees");
            let choices = [];
            for (let employee of employees) {
                let newChoice = employee.first_name + " " + employee.last_name;
                choices.push(newChoice);
            }
            return choices;
        }
    },  
    {
        name: "modify",
        type: "list",
        message: style.question("Please modify employee:"),
        choices: [
            {name: "Change Position", value: "position"},
            {name: "Change Manager", value: "manager"},
            {name: "DELETE", value: "delete"},
            {name: "<- Go Back", value: "cancel"},
        ]
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
    await inquirer.prompt(employeePrompt)
    .then(answers => {
        let employee, modify = answers;
        
    });
}

exports.startTitlePrompt = async() => {
    style.clear();
    await Database.logAll();
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