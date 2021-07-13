//DEPENDENCIES
const connection = require('./lib/db_connect')
const cTable = require('console.table');
const inquirer = require('inquirer');

var roles = [];
var roleTitles = [];
var departments = [];
var departmentNames = [];
var employees = [];
var employeeNames = [];



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


const getDepartmentId = (departmentName) => {
    for (const department of departments) {
        if(departmentName === department.name){
            return department.id;
        }
    }
}



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

const runPrompts = () => {
    handleData();
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


runPrompts();

