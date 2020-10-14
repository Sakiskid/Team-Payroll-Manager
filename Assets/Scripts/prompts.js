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
            new inquirer.Separator(),
            "Add Employee",
            "View Employees",
            new inquirer.Separator(),
            "Add Department",
            "View Departments",
            new inquirer.Separator(),
            "Add Position",
            "View Positions",
            ],
        pageSize: 16,
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
                let newChoice = {
                    name: employee.first_name + " " + employee.last_name,
                    value: employee.id,
                } 
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
            {name: "Change Name", value: "name"},
            {name: "Change Position", value: "position"},
            {name: "Change Manager", value: "manager"},
            {name: "DELETE", value: "delete"},
            {name: "<- Go Back", value: "cancel"},
        ]
    }
]

const departmentPrompt = [
    {
        name: "department",
        type: "list",
        message: style.question("Please select a department"),
        choices: async() => {
            let departments = await Database.read("departments");
            let choices = [];
            for (let department of departments) {
                let newChoice = department.department_name;
                choices.push(newChoice);
            }
            return choices;
        }
    },
    {
        name: "departmentChosen",
        type: "list",
        message: style.question("What would you like to do with this department?"),
        choices: [
            {name: "Change Name", value: "name"},
            {name: "View Budget", value: "budget"},
            {name: "DELETE", value: "delete"},
            {name: "< Go Back", value: "cancel"},
        ]
    }
]

const positionPrompt = [
    {
        name: "position",
        type: "list",
        message: style.question("Please select a position: "),
        choices: async() => {
            let positions = await Database.read("roles");
            let choices = [];
            for (let position of positions) {
                let newChoice = position.title;
                choices.push(newChoice);
            }
            return choices;
        }
    },
    {
        name: "positionChosen",
        type: "list",
        message: style.question("What would you like to do with this position?"),
        choices: [
            {name: "Change Name", value: "name"},
            {name: "Change Salary", value: "salary"},
            {name: "Change Department", value: "department"},
            {name: "DELETE", value: "delete"},
            {name: "< Go Back", value: "cancel"},
        ]
    }
]

//

//
// Functions
//

async function startEmployeePrompt() {
    await inquirer.prompt(employeePrompt)
    .then(answers => {
        let employeeId, modify = answers;
        switch (modify) {
            case "position": 
                // List positions and their department, then change employee
            case "manager": 
                // List managers in the current department, with an option to change departments
            case "delete": 
                // Delete this employee from the database
                connection.delete(employeeId);
            case "cancel": 
                // Cancel, go back to selecting employees
        }
    });
}

async function startDepartmentPrompt() {
    // TODO list all the departments using console.table
    // and list the number of employees plus the combined budget
    await inquirer.prompt(departmentPrompt)
    .then(answers => {

    });
}

async function startPositionPrompt() {
    await inquirer.prompt(positionPrompt)
    .then(answers => {

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
            startDepartmentPrompt();
        }
        else if (answers.main === "View Positions") {
            startPositionPrompt();
        }
    });
}