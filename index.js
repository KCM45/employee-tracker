/** @format */

import inquirer from "inquirer";
import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

// Express middleware
const PORT = process.env.PORT || 3001;
const app = express();

// Connect to database
const db = mysql.createConnection(
  {
    host: "127.0.0.1",
    // MySQL username,
    user: process.env.DB_USER,
    // MySQL password
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  console.log(`Connected to the courses_db database.`)
);

// Present inital menu of actions for the user
inquirer
  .prompt([
    {
      type: "list",
      name: "menu",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
      ],
    },
  ])
  .then((answers) => {
    console.info(answers);
  });

// Handle menu selection
function menuActions(answers) {
  switch (answers.menu) {
    case "View All Employees":
      viewAllEmployees();
      break;
    case "Add Employee":
      addEmployee();
      break;
    case "Update Employee Role":
      updateEmployeeRole();
      break;
    case "View All Roles":
      viewAllRoles();
      break;
    case "Add Role":
      addRole();
      break;
    case "View All Departments":
      viewAllDepartments();
      break;
    case "Add Department":
      addDepartment();
      break;
  }
}

// Display all employees
function viewAllEmployees() {
  const sql = `SELECT * FROM employee`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.table(rows);
    return;
  });
}
