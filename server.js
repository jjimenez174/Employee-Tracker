// Dependencies

const inquirer = require('inquirer');
const db = require ('./db/connection');

db.connect(err =>{
    if (err) throw err;
    afterConnection();
});

afterConnection = () => {
    console.log('***********************************************')
    console.log('*                                             *')
    console.log('*             EMPLOYEE MANAGER                *')
    console.log('*                                             *')
    console.log('***********************************************')
    employee_tracker();
};

const employee_tracker = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'prompt',
            message: 'What would you like to do?',
            choices: [
                'View All Department',
                'View All Roles',
                'View All Employee',
                'Add A Department',
                'Add a Role',
                'Add An Employee',
                'Update An Employee Role',
                'Exit',
            ]
        }
    ])
    .then((answers) => {
    // Viewing the Department, Role & Employee Table in Database
        if (answers.prompt === 'View All Department') {
            db.query(`SELECT * FROM department`, (error, result) => {
                if (error) return console.log(err);
                console.log('Viewing All Department')
                console.table(result);
                employee_tracker();
            });
        } else if (answers.prompt === 'View All Roles') {
            db.query(`SELECT * FROM role`, (error, result) => {
                if (error) return console.log(err);
                console.table(result);
                employee_tracker();
            });
        } else if (answers.prompt === 'View All Employees') {
            db.query(`SELECT * FROM employee`, (error, result) => {
                if (error) return console.log(err);
                console.table(result);
                employee_tracker();
            });
    // Adding to the Database
        } else if (answers.prompt === 'Add A Department') {
            inquirer.prompt([{
                type: 'input',
                name: 'department',
                message: 'What is the name of the department?',
                validate: departmentInput => {
                    if (departmentInput) {
                        return true;
                    } else {
                        console.log('Please Add a Department');
                        return false;
                    }
                }
            }])
            .then((answers) => {
                db. query (`INSERT INTO department (name) VALUES (?)`, [answers.department], (error, result) => {
                    if (error) return console.log(err);
                    console.log(`Added ${answers.department} to the database`)
                    employee_tracker();
                });
            })
        } else if (answers.prompt === 'Add An Employee') {
            db.query(`SELECT * FROM employee, role`, (error, result) => {
                if (error) console.log (err);
                inquirer.prompt([{
                    type: 'input',
                    name: 'firstName',
                    message: 'What is employee\'s first name?',
                    validate: firstNameInput => {
                        if (firstNameInput){
                            return true;
                        } else {
                        console.log('Please Add a First Name');
                        return false;
                    } 
                }
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'What is the employee\'s last name?',
                validate: lastNameInput => {
                    if (lastNameInput){
                        return true;
                    } else {
                        console.log('Please Add a Salary');
                        return false;
                    }
                }
            },
            {
                type: 'list',
                name: 'role',
                message: 'What is the employee\'s role?',
                choice:() => {
                    var array = [];
                    for (var i = 0; i < result.length; i++) {
                        array.push(result[i].title);
                    }
                    var newArray = [...new Set(array)];
                    return newArray;
                }
            },
            {
                type: 'input',
                name: 'manager',
                message: 'Who is the employee\'s manager?',
                validate: managerInput => {
                    if (managerInput) {
                        return true;
                    } else {
                        console.log ('Plase Add a Manager');
                        return false;
                    }
                }
            }
            ])
            .then((answers) => {
                for (var i = 0; i < result.length; i++) {
                    if(result[i].title === answers.role) {
                        var role = result[i];
                    }
                }
                db.query(`INSERT INTO employee (first_name, last_name, role_id, maanger_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, role.id, answers.manager.id], (error, result) =>{
                    console.log(`Added ${answers.firstName} ${answers.lastName} to the database`)
                    employee_tracker();
                });
            })
            });
        } else if (answers.prompt === 'Update An Employee Role') {
            db.query(`SELECT * FROM employee, role`, (error, result) => {
                if (error) return console.log(err);
                inquirer.prompt([{
                    type: 'list',
                    name: 'employee',
                    message: 'Which employee\'s role do you want to update?',
                    choice: () => {
                        var array = [];
                        for (var i = 0; i < result.length; i++) {
                            array.push(result[i].last_name);
                        }
                        var employeeArray = [...new Set(array)];
                        return employeeArray;
                    }
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is their new role?',
                    choice: () => {
                        var array = [];
                        for (var i = 0; i < result.length; i++) {
                            array.push(result[i].title);
                        }
                        var newArray = [...new Set(array)];
                        return newArray;
                    }
                }
            ])
            .then((answers) => {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].last_name === answers.employee) {
                        var name = result[i];
                    }
            }
            for (var i = 0; i < result.length; i++) {
                if (result[i].title === answers.role) {
                    var role = result[i];
                }
            }
            db.query(`UPDATE employee SET ? WHERE ?`, [{role_id: role}, {last_name: name}], (error, result) => {
                if (error) console.log(err);
                console.log(`Updated ${answers.employee} role to the database`)
                employee_tracker();

            });
        })
    });
 } else if (answers.prompt === 'Exit') {
    db.end();
    console.log("Good-Bye!");
    }
})
};

