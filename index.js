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
function menu() {
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
      menuActions(answers);
    });
}
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
    console.log("\n");
    console.table(rows);
    console.log("\n");

    menu();
  });

  return;
}

async function addEmployee() {
  // Get list of roles and managers for inquirer choices
  const roles = await roleChoices();
  const managers = await managerChoices();

  console.log("\n");
  await inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?",
      },
      {
        type: "list",
        name: "role_id",
        message: "What is the employee's role_id?",
        choices: roles,
      },
      {
        type: "list",
        name: "manager_id",
        message: "What is the employee's manager_id?",
        choices: managers,
      },
    ])
    .then((answers) => {
      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
      db.query(
        sql,
        [
          answers.first_name,
          answers.last_name,
          answers.role_id,
          answers.manager_id,
        ],
        (err, rows) => {
          if (err) {
            res.status(500).json({ error: err.message });

            return;
          }
          console.log("\n");
          console.table(rows);
          console.log("\n");
          menu();
        }
      );
    });
  menu();
}

// Update the employee's role based on their id
async function updateEmployeeRole() {
  const roles = await roleChoices();
  const employees = await managerChoices();
  console.log(employees);
  console.log("\n");
  await inquirer
    .prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee's role would you like to update?",
        choices: employees,
      },
      {
        type: "list",
        name: "roleId",
        message: "What is the employee's new role?",
        choices: roles,
      },
    ])
    .then((answers) => {
      const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
      db.query(sql, [answers.roleId, answers.employeeId], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        console.log("\n");
        console.table(rows);
        console.log("\n");
        menu();
      });
    });
}

function viewAllDepartments() {
  const sql = `SELECT * FROM department`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.log("\n");
    console.table(rows);
    console.log("\n");

    menu();
  });
}

function addDepartment() {
  inquirer
    .prompt([{ type: "input", name: "name", message: "Department name?" }])
    .then((answers) => {
      const sql = `INSERT INTO department (name) VALUES (?)`;
      db.query(sql, answers.name, (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        console.table(rows);
        console.log("\n");
        menu();
        console.log("\n");
      });
    });
}

// Provides list inquirer choices for managers
function managerChoices() {
  const sql = "SELECT id FROM employee ORDER BY id ASC";
  const managers = [];
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
      return;
    }
    for (let i = 0; i < rows.length; i++) {
      managers.push(rows[i].id);
    }
  });
  return managers;
}

// Provides list inquirer choices for roles
function roleChoices() {
  const sql = `SELECT id FROM role ORDER BY id ASC`;
  const roles = [];
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    for (let i = 0; i < rows.length; i++) {
      roles.push(rows[i].id);
    }
  });
  return roles;
}
function addRole() {
  inquirer
    .prompt([
      { type: "input", name: "title", message: "Role title?" },
      { type: "input", name: "salary", message: "Role salary?" },
      { type: "input", name: "department_id", message: "Department id?" },
    ])
    .then((answers) => {
      const sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
      db.query(
        sql,
        [answers.title, answers.salary, answers.department_id],
        (err, rows) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          console.table(rows);
          console.log("\n");
          menu();
        }
      );
    });
}
function viewAllRoles() {
  const sql = `SELECT * FROM role ORDER BY id`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.log("\n");
    console.table(rows);
    console.log("\n");

    menu();
  });
}

function init() {
  menu();
}
init();
