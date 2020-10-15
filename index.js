const prompts = require("./Assets/scripts/prompts");
const Database = require("./Assets/Scripts/connection");

// ANCHOR MySQL
Database.connection.connect(err => {
    if (err) throw err;
});

// ANCHOR Inquiry

async function init () {
    await prompts.startTitlePrompt;
}

init();