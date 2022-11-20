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
                choices:["view departments","view roles", "view employees","add a department","add a role","add an employee","update employee role"]
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
            case "add a department":
                addDepartment()
                break
            case "add a role":
                addRole()
                break
            case "add an employee":
            addEmployee()
                break
            case "update employee role":
                updateRoles()
                break
        }
    } catch (error) {
        console.log(error)
    }
}
async function addDepartment (){
    try {
        const userInput = await prompt([
            {
                type:"input",
                name:"name",
                message:"Type department name",

            }
        ])
        const [data] = await db.promise().query("insert into department set ?",userInput);
       console.log("department added")
        menu()
    } catch (error) {
        console.log(error)
    }
}
async function addRole(){
try {
    const [data] = await db.promise().query("select id as value, name as name from department");
    const userInput = await prompt([
        {
            type:"input",
            name:"title",
            message:"job title"
        },{
            type:"input",
            name:"salary",
            message:"position salary"
        },
        {
            type:"list",
            name:"department_id",
            message:"select department",
            choices: data
        }
    ])
    await db.promise().query("insert into role set ?",userInput);
    console.log("added new role")
    menu()
} catch (error) {
    console.log(error)
}
}
async function addEmployee(){
    try {
        const [roles] = await db.promise().query("select id as value, title as name from role");
        const [managers] = await db.promise().query("select id as value, first_name as name from employee");
      const userInput = await prompt([
        {
            type:"input",
            name:"first_name",
            message:"employee's first name"
        },{
            type:"input",
            name:"last_name",
            message:"employee's last name"
        },{
            type:"list",
            name:"role_id",
            message:"select employee's role",
            choices:roles
        },{
            type:"list",
            name:"manager_id",
            message:"select manager",
            choices:managers
        }
        
      ])  
      await db.promise().query("insert into employee set ?",userInput);
    console.log("added new employee")
    menu()
    } catch (error) {
        console.log(error)
    }
}
async function updateRoles(){
    try {
        const [employees] = await db.promise().query("select id as value, first_name as name from employee");
        const [roles] = await db.promise().query("select id as value, title as name from role");
        const userInput = await prompt([
            {
               type:"list",
               name:"id",
               message:"select employee",
               choices:employees
            },{
                type:"list",
                name:"role_id",
                message:"select new role",
                choices:roles
            }
        ])
        await db.promise().query("update employee set role_id = ? where id = ?",[userInput.role_id,userInput.id]);
    console.log("update employee role")
    menu()
    } catch (error) {
        console.log(error)
    }
}
menu()