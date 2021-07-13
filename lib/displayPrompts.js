const inquirer = require('inquirer');

const {displayRoles,addRole,rolesUpdate} = require("./Roles.js");
const {displayDepartments,addDepartment,departmentsUpdate} = require("./Departments.js");
const {displayEmployees,addEmployee,employeesUpdate,updateEmployeeRole} = require("./Employees.js");

function runPrompts(){
    // handleData();
    inquirer
    .prompt({
        name:'action',
        type:'list',
        message:'What would you like to do?',
        choices: [
            'View Employees',
            'View Departments',
            'View Roles',
            'Add Employee',
            'Add Department',
            'Add Role',
            'Update Employee Role',
        ]
    })
    .then((answer)=>{
        switch (answer.action) {
            case 'View Employees':
                displayEmployees();
                break;     
            case 'View Departments':
                displayDepartments();
                break;
            case 'View Roles':
                displayRoles();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            default:
                break;
        }
    })   
}

const handleData = () => {
    departmentsUpdate();
    rolesUpdate();
    employeesUpdate();
}

module.exports = runPrompts;