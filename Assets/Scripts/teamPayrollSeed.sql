DROP DATABASE IF EXISTS team_payroll_DB;

CREATE DATABASE team_payroll_DB;

USE team_payroll_DB;

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL(16,2),
    department_id INT,
    PRIMARY KEY (id)
);

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    PRIMARY KEY (id)
);

INSERT INTO departments (name)
VALUES ("Assets"), ("Coding"), ("Marketing");

INSERT INTO roles (title, salary, department_id)
VALUES 
    ("Artist", 65000, 1),
    ("3D Modeler", 65000, 1),
    ("Sound Designer", 70000, 1),
    ("Composer", 95000, 1),
    ("Senior Asset Lead", 95000, 1),
    ("Programmer", 70000, 2),
    ("AI Programmer", 75000, 2),
    ("Lead Programmer", 80000, 2),
    ("Senior Programmer", 100000, 2),
    ("Salesperson", 55000, 3),
    ("Lead Salesperson", 65000, 3),
    ("Data Analyst", 90000, 3),
    ("Senior Data Analyst", 120000, 3);

INSERT INTO employees (first_name, last_name, role_id)
VALUES
    ("Tyler", "Smith", 7),
    ("Bob", "Deckard", 9),
    ("Emily", "Trevizo", 1),
    ("Keagon", "King", 2);
