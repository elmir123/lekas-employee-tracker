const connection = require('./db_connect');
const cTable = require('console.table');
const inquirer = require('inquirer');
const runPrompts = require('./displayPrompts.js')

var roles = [];
var roleTitles = [];


const displayRoles = () => {
    let query = 'SELECT * FROM role';
    connection.query(query, (err, res)=>{
        let response = JSON.stringify(res);
        let returnedArray = JSON.parse(response);
        console.log(`\n`)
        console.table(returnedArray);
        runPrompts();
    })
}

const rolesUpdate = () => {
    connection.query(
        'SELECT * FROM role',
        (err, res) => {
            if(err){
                throw err;
            }else{
                let response = JSON.stringify(res);
                let returnedArray = JSON.parse(response);
                roles = [];
                roleTitles = [];
                roles = returnedArray;
                returnedArray.forEach(element => {
                    roleTitles.push(element.title)
                });
            }
        }
    );
}
const addRole = () => {
    inquirer
    .prompt([
        {
            type: 'input',
            message: "What is the name of the role?",
            name: 'roleTitle',
        },
        {
            type: 'input',
            message: "What is the salary of the role?",
            name: 'roleSalary',
        },
        {
            type: 'list',
            message: "What department is the role a part of?",
            choices: departmentNames,
            name: 'roleDepartment',
        },
    ])
    .then((answer)=>{
        if((answer.roleTitle && !(answer.roleTitle===""))&&(answer.roleSalary && !(answer.roleSalary===""))){
            connection.query(
                'INSERT INTO role SET ?',
                {
                    title: answer.roleTitle,
                    salary: answer.roleSalary,
                    department_id: getDepartmentId(answer.roleDepartment)
                },
                (err, res) => {
                  if (err) throw err;
                  console.log(`\nRole added!\n`);
                }
            );


        }else{
            console.error("Invalid Role Name. Please start the application again.");
        }
    })
    .then(() => {runPrompts()});

}
const getRoleId = (roleTitle) => {
    for (const role of roles) {
        if(roleTitle === role.title){
            return role.id;
        }
    }
}

module.exports = {
    displayRoles:displayRoles,
    rolesUpdate:rolesUpdate,
    addRole:addRole
}