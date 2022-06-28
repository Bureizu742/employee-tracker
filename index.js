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
        'Update Employee Role',
        'Add Employee',
        'Add Role',
        'Add Department',
        'Exit'
      ]
    }
  ])
    .then((answer) => {
      switch (answer.mainmenu) {
        case "View All Employees":
          viewAllEmployees();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "View All Departments":
          viewAllDepartments();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "Exit":
          db.end();
          break;
      }
    });
};

const viewAllEmployees = () => {
  const queryText = `SELECT employee.id, 
    employee.first_name, 
    employee.last_name, 
    role.title, 
    department.name AS 'department', 
    role.salary
    FROM employee, role, department 
    WHERE department.id = role.department_id 
    AND role.id = employee.role_id
    ORDER BY employee.id ASC`;
  db.query(queryText, (error, results) => {
    if (error) throw error;
    console.table(results);
    promptUser();
  });
};

const viewAllRoles = () => {
  const queryText = `SELECT role.id, role.title, role.salary, department.name AS department
  FROM role
  INNER JOIN department ON role.department_id = department.id`;
  db.query(queryText, (error, results) => {
    if (error) throw error;
    console.table(results);
    promptUser();
  });
};

const viewAllDepartments = () => {
  const queryText = `SELECT department.id AS id, department.name AS department FROM department`;
  db.query(queryText, (error, results) => {
    if (error) throw error;
    console.table(results);
    promptUser();
  });
};

const addEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: "What is the employee's first name?",
      validate: addFirstName => {
        if (addFirstName) {
          return true;
        } else {
          console.log('Please enter a first name for this employee');
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'lastName',
      message: "What is the employee's last name?",
      validate: addLastName => {
        if (addLastName) {
          return true;
        } else {
          console.log('Please enter a last name for this employee');
          return false;
        }
      }
    }
  ])
    .then(answer => {
      const employee = [answer.firstName, answer.lastName]
      const queryRoleText = `SELECT role.id, role.title FROM role`;
      db.query(queryRoleText, (err, data) => {
        if (err) throw err;
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));
        inquirer.prompt([
          {
            type: 'list',
            name: 'role',
            message: "What is the employee's role?",
            choices: roles
          }
        ])
          .then((roleChoice) => {
            const role = roleChoice.role;
            employee.push(role);
            const queryManagerText = `SELECT * FROM employee`;
            db.query(queryManagerText, (err, data) => {
              if (err) throw err;
              const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'manager',
                  message: "Who is the employee's manager?",
                  choices: managers
                }
              ])
                .then(managerChoice => {
                  const manager = managerChoice.manager;
                  employee.push(manager);
                  const insertText = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                  VALUES (?, ?, ?, ?)`;
                  db.query(insertText, employee, (error) => {
                    if (error) throw error;
                    console.log("Employee was successfully added!")
                    viewAllEmployees();
                  });
                });
            });
          });
      });
    });
};

const addRole = () => {
  const deptText = 'SELECT * FROM department'
  db.query(deptText, (err, results) => {
    if (err) throw err;
    let deptNameArray = [];
    results.forEach((department) => { deptNameArray.push(department.name); });
    deptNameArray.push('Create Department');
    inquirer
      .prompt([
        {
          name: 'departmentName',
          type: 'list',
          message: 'Which department is this new role in?',
          choices: deptNameArray
        }
      ])
      .then((answer) => {
        if (answer.departmentName === 'Create Department') {
          this.addDepartment();
        } else {
          createRole(answer);
        }
      });

    const createRole = (departmentData) => {
      inquirer
        .prompt([
          {
            name: 'newRole',
            type: 'input',
            message: 'What is the name of your new role?',
            validate: addRoleName => {
              if (addRoleName) {
                return true;
              } else {
                console.log('Please name this role');
                return false;
              }
            }
          },
          {
            name: 'salary',
            type: 'input',
            message: 'What is the salary of this new role?',
            validate: addSalary => {
              if (addSalary) {
                return true;
              } else {
                console.log('Please enter a salary for this role');
                return false;
              }
            }
          }
        ])
        .then((answer) => {
          let createdRole = answer.newRole;
          let departmentId;

          results.forEach((department) => {
            if (departmentData.departmentName === department.name) { departmentId = department.id; }
          });

          let insertText = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
          let employee = [createdRole, answer.salary, departmentId];

          db.query(insertText, employee, (err) => {
            if (err) throw err;
            console.log('Role successfully created!');
            viewAllRoles();
          });
        });
    };
  });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: 'newDepartment',
        type: 'input',
        message: 'What is the name of your new department?',
        validate: addSalary => {
          if (addSalary) {
            return true;
          } else {
            console.log('Please name this department');
            return false;
          }
        }
      }
    ])
    .then((answer) => {
      let insertText = `INSERT INTO department (name) VALUES (?)`;
      db.query(insertText, answer.newDepartment, (err, results) => {
        if (err) throw err;
        console.log(answer.newDepartment + ' department successfully created!');
        viewAllDepartments();
      });
    });
};

promptUser();