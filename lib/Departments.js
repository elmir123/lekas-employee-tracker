const connection = require('./db_connect');
const cTable = require('console.table');
const inquirer = require('inquirer');
const runPrompts = require('./displayPrompts.js')

var departments = [];
var departmentNames = [];

const displayDepartments = () => {
    let query = 'SELECT department.id AS ID, department.name AS DepartmentName FROM department';
    connection.query(query, (err, res)=>{
        let response = JSON.stringify(res);
        let returnedArray = JSON.parse(response);
        console.log(`\n`)
        console.table(returnedArray);
        runPrompts();
    })
}

const departmentsUpdate = () => {
    connection.query(
        'SELECT * FROM department',
        (err, res) => {
            if(err){
                throw err;
            }else{
                let response = JSON.stringify(res);
                let returnedArray = JSON.parse(response);
                departments = [];
                departmentNames = [];
                departments = returnedArray;
                returnedArray.forEach(element => {
                    departmentNames.push(element.name)
                });  
            }
        }
    );
}

const addDepartment = () => {
    inquirer
    .prompt(
        {
            type: 'input',
            message: "What is the name of the department?",
            name: 'departmentName',
        }
    )
    .then((answer)=>{
        if(answer.departmentName && !(answer.departmentName==="")){
            connection.query(
                'INSERT INTO department SET ?',
                {
                  name: answer.departmentName
                },
                (err, res) => {
                  if (err) throw err;
                  console.log(`\nDepartment added!\n`);
                }
            );


        }else{
            console.error("Invalid Deparment Name. Please start the application again.");
        }
    })
    .then(() => {runPrompts()});
}

const getDepartmentId = (departmentName) => {
    for (const department of departments) {
        if(departmentName === department.name){
            return department.id;
        }
    }
}

module.exports = {
    displayDepartments:displayDepartments,
    departmentsUpdate:departmentsUpdate,
    addDepartment:addDepartment
}
