const inquirer = require("inquirer");
const cTable = require("console.table");
const chalk = require("chalk");

const titlePrompt = [
    {
        name: "main",
        type: "list",
        message: function() {
            console.log(chalk.yellow("What would you like to do?"));
        },
        choices: [""]
    }
]

async function startPrompt(prompt) {
    await inquirer.prompt(prompt);
}

exports.startTitlePrompt = () => {
    startPrompt(titlePrompt);
}