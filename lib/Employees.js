const connection = require('./db_connect');
const cTable = require('console.table');
const inquirer = require('inquirer');
const runPrompts = require('./displayPrompts.js')

var employees = [];
var employeeNames = [];

const displayEmployees = () => {
    let query = '\
    SELECT employee.id, employee.first_name AS EName, employee.last_name AS ELastName, manager.first_name AS MName, manager.last_name AS MLastName, role.title AS RoleTitle , role.salary AS Salary FROM employee \
    LEFT OUTER JOIN employee manager ON (employee.manager_id = manager.id)\
    INNER JOIN role ON (employee.role_id = role.id) ';

    connection.query(query,(err, res)=>{
        if(err) throw err;
        let response = JSON.stringify(res);
        let returnedArray = JSON.parse(response);

        //reformat null entries
        returnedArray.forEach(element => {
            if(element.MFirstName === null){
                element.MFirstName = 'None';
                element.MLastName = 'None';
            }
        });
        console.log(`\n`)
        console.table(returnedArray);
        runPrompts();
    })
};
const employeesUpdate = () => {
    connection.query(
        'SELECT * FROM employee',
        (err, res) => {
            if(err){
                throw err;
            }else{
                let response = JSON.stringify(res);
                let returnedArray = JSON.parse(response);
                employees = [];
                employeeNames = [];
                returnedArray.forEach(element => {
                    let employee = {};
                    let name = element.first_name +" "+ element.last_name;
                    let id = element.id;
                    employee.name = name;
                    employee.id = id;
                    employeeNames.push(name);
                    employees.push(employee);
                });  
                employeeNames.push("None");
            }
        }
    );
}
const addEmployee = () => {
    console.log('You are adding an employee...');
    inquirer
    .prompt([
        {
            type: 'input',
            message: "What is the employee's first name?",
            name: 'firstName',
        },
        {
            type: 'input',
            message: "What is the employee's last name?",
            name: 'lastName',
        },
        {
            type: 'list', 
            message: "What is the employee's role?",
            choices: roleTitles,
            name: 'role'
        },
        {
            type: 'list', 
            message: "Who is the manager of this employee?",
            choices: employeeNames,
            name: 'manager'
        },

    ])
    .then((answer)=>{
        if((answer.firstName && !(answer.firstName===""))&&(answer.lastName && !(answer.lastName===""))){
            connection.query(
                'INSERT INTO employee SET ?',
                {
                  first_name: answer.firstName,
                  last_name: answer.lastName,
                  role_id: getRoleId(answer.role),
                  manager_id: getEmployeeId(answer.manager)
                },
                (err, res) => {
                  if (err) throw err;
                  console.log(`\nEmployee added!\n`);
                }
            );
        }else{
            console.error("Invalid Employee Name. Please start the application again.");
        }
    })
    .then(() => {runPrompts()});
}
const updateEmployeeRole = () => {

    inquirer
    .prompt([
        {
            type: 'list', 
            message: "What employee would you like to update?",
            choices: employeeNames,
            name: 'selectedEmployee'
        },
        {
            type: 'list', 
            message: "What is the employee's new role?",
            choices: roleTitles,
            name: 'role'
        },
    ])
    .then((answer)=>{
        
        connection.query(
            'UPDATE employee SET ? WHERE ?',
            [
                {
                    role_id: getRoleId(answer.role),
                },
                {
                    id: getEmployeeId(answer.selectedEmployee)
                }
            ],
            (err, res) => {
                if (err) throw err;
                console.log(`\nEmployee added!\n`);
            }
        );

    })
    .then(() => {runPrompts()});


}
const getEmployeeId = (employeeName) => {
    for (const employee of employees){
        if(employeeName === employee.name){
            return employee.id;
        }
    }

    return null;
}
module.exports = {
    displayEmployees:displayEmployees,
    employeesUpdate:employeesUpdate,
    addEmployee:addEmployee,
    updateEmployeeRole:updateEmployeeRole
}