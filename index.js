const conTab = require('console.table');
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

// db.query('SELECT * FROM employees', function (err, results) {
//   console.table(results);
// });

//TODO: stuff
const promptUser = () => {
  inquirer.prompt([
    {
      name: 'mainmenu',
      type: 'list',
      message: 'Please select an option:',
      choices: [
        'View All Employees',
        'View All Roles',
        'View All Departments',
        'View All Employees By Department',
        'View Department Budgets',
        'Update Employee Role',
        'Update Employee Manager',
        'Add Employee',
        'Add Role',
        'Add Department',
        'Remove Employee',
        'Remove Role',
        'Remove Department',
        'Exit'
      ]
    }
  ])
    .then((answer) => {
      switch (answer.action) {
        case "View All Employees":
          viewAllEmp();
          break;
        case "View All Employees By Department":
          viewAllEmpByDept();
          break;
        case "View All Employees By Role":
          viewAllEmpByRole();
          break;
        case "Add Employee":
          addEmp();
          break;
        case "Add Department":
          addDept();
          break;
        case "Add Role":
          addRole();
          break;
        case "Update Employee Role":
          updateEmpRole();
          break;
        case "Update Employee Manager":
          updateEmpMngr();
          break;
        case "View All Employees By Manager":
          viewAllEmpByMngr();
          break;
        case "Delete Employee":
          deleteEmp();
          break;
        case "View Department Budgets":
          viewDeptBudget();
          break;
        case "Delete Role":
          deleteRole();
          break;
        case "Delete Department":
          deleteDept();
          break;
        case "Exit":
          db.end();
          break;
      }
    });
};

promptUser();

