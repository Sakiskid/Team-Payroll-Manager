const mysql = require("mysql");

function Database () {
    this.host = "localhost";
    this.port = 3306;
    this.user = "root";
    this.password = "123";
    this.database = "team_payroll_DB";
    
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

Database.prototype.read = function () {

}

Database.prototype.update = function () {

}

Database.prototype.delete = function () {

}

module.exports = Database;