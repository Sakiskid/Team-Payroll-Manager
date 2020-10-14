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
            ],
        pageSize: 16,
    }
]

const newEmployeePrompt = [
    {
        name: "first_name",
        type: "input",
        message: "Please input employee's first name: ",
    },
    {
        name: "last_name",
        type: "input",
        message: "Please input employee's last name: ",
    },
    {
        name: "role_id",
        type: "list",
        message: "Please select which position this employee has in the company: ",
        choices: async() => { return await listRolesWithDepartments(); },
    },
    {
        name: "manager_id",
        type: "list",
        message: "Does this employee have a manager?",
        choices: async() => {
            let choices = [];
            // Add Employees from this department
            // choices.push(await listManagers());
            // Add Separator
            choices.push(new inquirer.Separator());
            // Add "NO MANAGER" option
            choices.push({
                name: "NO MANAGER",
                value: null
            })
            return choices;
        }
    },
]

const employeePrompt = [
    {
        name: "employee",
        type: "list",
        message: () => {
            style.clear();
            return style.question("Please select an employee");
        },
        choices: async() => { 
            let choices = []
            choices = choices.concat(await listEmployees());
            choices.push(new inquirer.Separator());
            choices.push({name: "Add Employee", value: "add"});
            choices.push({name: "<- Go Back", value: "cancel"});
            return choices;
        },
        pageSize: 16,
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
        ],
        when: (answers) => {
            if(answers.employee !== "add" && answers.employee !== "cancel") return true;
        }
    },
    {
        name: "newPosition",
        message: style.question("Please select a position: "),
        type: "list",
        choices: async () => { return await listRoles(); },
        when: (answers) => { if (answers.modify === "position") return true; },
    }, 
    {
        name: "newManager",
        message: style.question("Please select a manager: "),
        type: "list",
        choices: async (answers) => { return await listManagers(answers.employee); },
        when: (answers) => { if (answers.modify === "manager") return true; }
    },
    {
        name: "deleteConfirm",
        type: "confirm",
        message: (answers) => {
            return style.confirm("Are you sure you want to delete this employee?")
        },
        when: (answers) => { if (answers.modify === "delete") return true; },
    },
]

const newDepartmentPrompt = [
    {
        name: "department_name",
        type: "input",
        message: "Please input department's name: ",
    }
]

const departmentPrompt = [
    {
        name: "department",
        type: "list",
        message: style.question("Please select a department"),
        pageSize: 16,
        choices: async() => {
            let choices = []
            choices = choices.concat(await listDepartments());
            choices.push(new inquirer.Separator());
            choices.push({name: "Add Department", value: "add"});
            choices.push({name: "<- Go Back", value: "cancel"});
            return choices;            
        }
    },
    {
        name: "modify",
        type: "list",
        message: style.question("What would you like to do with this department?"),
        choices: [
            {name: "Change Name", value: "name"},
            {name: "View Budget", value: "budget"},
            {name: "DELETE", value: "delete"},
            {name: "< Go Back", value: "cancel"},
        ],
        when: (answers) => {
            if(answers.department !== "add" && answers.department !== "cancel") return true;
        }
    },    
    {
        name: "deleteConfirm",
        type: "confirm",
        message: (answers) => {
            return style.confirm("Are you sure you want to delete ", style.confirm(answers.department))
        },
        when: (answers) => {
            if (answers.modify === "delete") return true;
        }
    }
]

const newPositionPrompt = [
    {
        name: "title",
        type: "input",
        message: "Please input positions's name: ",
    },
    {
        name: "salary",
        type: "number",
        message: "Please input position's salary: ",
    },
    {
        name: "department_id",
        type: "list",
        message: "Please select which department this position is in: ",
        choices: async () => {
            return await listDepartments();
        }
    }
]

const positionPrompt = [
    {
        name: "position",
        type: "list",
        message: style.question("Please select a position: "),
        pageSize: 16,
        choices: async() => {
            let choices = []
            choices = choices.concat(await listRoles());
            choices.push(new inquirer.Separator());
            choices.push({name: "Add Position", value: "add"});
            choices.push({name: "<- Go Back", value: "cancel"});
            return choices;
        }
    },
    {
        name: "modify",
        type: "list",
        message: style.question("What would you like to do with this position?"),
        choices: [
            {name: "Change Name", value: "name"},
            {name: "Change Salary", value: "salary"},
            {name: "Change Department", value: "department"},
            {name: "DELETE", value: "delete"},
            {name: "< Go Back", value: "cancel"},
        ],
        when: (answers) => {
            if(answers.position !== "add" && answers.position !== "cancel") return true;
        },
    },    
    {
        name: "deleteConfirm",
        type: "confirm",
        message: (answers) => {
            return style.confirm("Are you sure you want to delete ", style.confirm(answers.position))
        },
        when: (answers) => {
            if (answers.modify === "delete") return true;
        }
    }
]

//
// Functions
//

async function listEmployees() {
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

async function listRoles() {
    let roles = await Database.read("roles");
    let choices = [];
    for (let role of roles) {
        let newChoice = {
            name: role.title,
            value: role.id,
        }
        choices.push(newChoice);
    }
    return choices;
}

async function listRolesWithDepartments() {
    let roles = await Database.readAndJoinRoleWithDepartment();
    let choices = [];
    for(let role of roles) {
        let newChoice = {
            name: role.department_name + " || " + role.title,
            value: role.id,
        }
        choices.push(newChoice);
    }
    return choices;
}

async function listDepartments() {
    let departments = await Database.read("departments");
    let choices = [];
    for(let department of departments) {
        let newChoice = {
            name: department.department_name,
            value: department.id
        }
        choices.push(newChoice);
    }
    return choices;
}

async function listManagers(employeeId) {
    let managers = await Database.getManagersInDepartment();
    let choices = []


    return managers;
    // TODO list managers

}

async function startNewEmployeePrompt() {
    await inquirer.prompt(newEmployeePrompt)
    .then(answers => {
        console.log(answers);
        Database.createEmployee(answers.first_name, answers.last_name, answers.role_id, answers.manager_id);
    })
    .then(() => {
        startTitlePrompt();
    });
}

async function startEmployeePrompt() {
    await inquirer.prompt(employeePrompt)
    .then(answers => {
        if(answers.employee === "add") {
            startNewEmployeePrompt();
        }
        else if (answers.employee === "cancel") {
            startTitlePrompt();
        }
        else {
            let {employee: employeeId, modify} = answers;
            switch (modify) {
                case "position":
                    Database.update("employees", employeeId, "role_id", answers.newPosition);
                    // List positions and their department, then change employee
                case "manager":
                    Database.update("employees", employeeId, "manager_id", answers.newManager);
                    // List managers in the current department, with an option to change departments
                case "delete":
                    // Delete this employee from the database
                    if(answers.deleteConfirm === true) {
                        Database.delete(employeeId, "employees");
                    } else {
                        startEmployeePrompt();
                        break;
                    }
                case "cancel": 
                // Cancel, go back to selecting employees
                startEmployeePrompt();
            }
        }
    });
}

async function startDepartmentPrompt() {
    // TODO list all the departments using console.table
    // and list the number of employees plus the combined budget
    await inquirer.prompt(departmentPrompt)
    .then(answers => {
        switch(answers.department) {
            case "add":
                startNewDepartmentPrompt();
                break;
            case "cancel":
                startTitlePrompt();
                break;
            default:
                switch(answers.modify) {
                    case "name":
                        Database.update("departments", answers.department, "department_name", answers.newName);
                        break;
                    case "budget":
                        // TODO add read budget
                        break;
                    case "delete":
                        Database.deleteDepartment(answers.department);
                        break;
                    case "cancel":
                        break;
                }
                startDepartmentPrompt();
                break;
        }
    });
}

async function startNewDepartmentPrompt() {
    await inquirer.prompt(newDepartmentPrompt)
    .then(answers => {
        Database.createDepartment(answers.department_name)
    })
    .then( () => {
        startDepartmentPrompt();
    });
}

async function startPositionPrompt() {
    await inquirer.prompt(positionPrompt)
    .then(answers => {
        switch(answers.position) {
            case "add":
                startNewPositionPrompt();
                break;
            case "cancel":
                startTitlePrompt();
                break;
            default:
                switch(answers.modify) {
                    case "name":
                        Database.update("roles", answers.position, "title", answers.newName);
                        break;
                    case "salary":
                        Database.update("roles", answers.position, "salary", answers.newSalary);
                        break;
                    case "department":
                        Database.update("roles", answers.position, "department_id", answers.newDepartment);
                        break;
                    case "delete":
                        Database.delete(answers.position, "roles");
                        break;
                    case "cancel":
                        break;
                }
                startPositionPrompt();
                break;
        }
    });
}

async function startNewPositionPrompt() {
    await inquirer.prompt(newPositionPrompt)
    .then(answers => {
        Database.createRole(answers.title, answers.salary, answers.department_id);
    })
    .then( () => {
        startPositionPrompt();
    });
}

async function startTitlePrompt () {
    style.clear();
    await Database.logAll();
    await inquirer.prompt(titlePrompt).then(answers => {
        switch(answers.main) {
            case "View Employees":
                style.clear();
                startEmployeePrompt();
                break;
            case "View Departments":
                style.clear();
                startDepartmentPrompt();
                break;
            case "View Positions":
                style.clear();
                startPositionPrompt();
                break;
        }
    });
}

exports.startTitlePrompt = startTitlePrompt();