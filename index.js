//DEPENDENCIES
const mysql = require('mysql');
const inquirer = require('inquirer');


//--- My SQL Connection ---
const connection = mysql.createConnection({
    host: 'localhost',

    port:3306,

    user: 'root',

    password:'',
    database: 'employees_db'
});
