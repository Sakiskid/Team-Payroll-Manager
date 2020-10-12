const chalk = require("chalk");
const readline = require('readline')

exports.question = (text) => {
    return chalk.bold.italic.yellow(text);
}

exports.clear = () => {
    const blank = '\n'.repeat(process.stdout.rows)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
}