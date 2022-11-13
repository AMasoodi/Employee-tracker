const { prompt } = require("inquirer");
const mysql = require('mysql2');


const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // TODO: Add MySQL password here
        password: 'password',
        database: 'employee_tracker'
    },

);


async function overviewDepartments() {
    try {
        const [data] = await db.promise().query("select * from department");
        console.table(data)
        menu()
    }
    catch (error) {
        console.log(error)
    }
}
async function overviewRoles() {
    try {
        const [data] = await db.promise().query("select title, salary, department.name from role left join department on role.department_id = department.id");
        console.table(data)
        menu()
    }
    catch (error) {
        console.log(error)
    }
}
async function overviewEmployees() {
    try {
        const [data] = await db.promise().query("select employee.first_name, employee.last_name, role.title, role.salary, department.name, manager.last_name as manager from employee left join role on employee.role_id = role.id left join department on role.department_id = department.id left join employee as manager on employee.manager_id = manager.id");
        console.table(data)
        menu()
    }
    catch (error) {
        console.log(error)
    }
}
async function menu(){
    try {
        const {answer} = await prompt([
            {
                type:"list",
                name:"answer",
                message:"main menu",
                choices:["view departments","view roles", "view employees"]
            }
        ])
        switch(answer){
            case "view departments":
                overviewDepartments()
                break
            case "view roles":
                overviewRoles()
                break
            case "view employees":
                overviewEmployees()
                break
        }
    } catch (error) {
        console.log(error)
    }
}
menu()