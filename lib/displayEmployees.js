const connection = require('./db_connect');

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
        displayPrompts();
    })
};
module.exports = displayEmployees;