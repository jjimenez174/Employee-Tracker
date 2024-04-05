// Dependencies

const inquirer = require('inquirer');
const db = require ('./db/connection');

db.connect(error => { 
    if (error) throw error;
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
                'View All Employees',
                'Add A Department',
                'Add a Role',
                'Add An Employee',
                'Update An Employee Role',
                'Exit',
            ]
        }])
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
         // Adding a Department        
            } else if (answers.prompt === 'Add A Department') {
                inquirer.prompt([{
                    type: 'input',
                    name: 'department',
                    message: 'What is the name of the dpeartment?',
                    validate: departmentInput => {
                        if (departmentInput) {
                            return true;
                        } else {
                            console.log('Please Add A Department!');
                            return false;
                        }
                    }
                }]).then((answers) => {
                    db.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (error, result) => {
                        if (error) throw error;
                        console.log(`Added ${answers.department} to the database.`)
                        employee_tracker();
                    });
                })
        // Adding A Role        
            } else if (answers.prompt === 'Add A Role') {
                db.query(`SELECT * FROM department`, (error, result) => {
                    if (error) throw error;
                        inquirer.prompt([{
                            type: 'input',
                            name: 'role',
                            message: 'What is the name of the role?',
                            validate: roleInput => {
                                if (roleInput) {
                                    return true;
                                } else {
                                    console.log('Please Add a Role');
                                    return false;
                                }
                            }
                        },
                        {
        // Adding the Salary
                            type: 'input',
                            name: 'salary',
                            message: 'What is the salary of the role?',
                            validate: salaryInput => {
                                if (salaryInput) {
                                    return true;
                                } else {
                                    console.log('Please Add a Salary');
                                    return false;
                                }
                            }
                        },
                        {
        // Adding it to the Department
                            type: 'list',
                            name: 'department',
                            message: 'Which department does the role belong to?',
                            choices: () => {
                                var array = [];
                                for (var i = 0; i < result.length; i++) {
                                    array.push(result[i].name);
                                }
                                return array;
                            }
                        }
                    ]).then((answers) => {
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].name === answers.department) {
                                var department = result[i];
                            }
                        }
                        db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.role, answers.salary, department.id], (error, result) => {
                            if (error) throw error;
                            console.log(`Added ${answers.role} to the database.`)
                            employee_tracker();
                        });
                    })
                });
        // Adding Employee        
            } else if (answers.prompt === 'Add An Employee') {
                db.query(`SELECT * FROM employee, role`, (error, result) => {
                    if (error) throw error;
                    inquirer.prompt([{
                            type: 'input',
                            name: 'firstName',
                            message: 'What is the employee\'s first name?',
                            validate: firstNameInput => {
                                if (firstNameInput) {
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
                                if (lastNameInput) {
                                    return true;
                                } else {
                                    console.log('Please Add a Last Name');
                                    return false;
                                }
                            }
                        },
                        {
        // Adding Employee Role
                            type: 'list',
                            name: 'role',
                            message: 'What is the employee\'s role?',
                            choices: () => {
                                var array = [];
                                for (var i = 0; i < result.length; i++) {
                                    array.push(result[i].title);
                                }
                                var newArray = [...new Set(array)];
                                return newArray;
                            }
                        },
                        {
        // Adding Employee Manager
                            type: 'input',
                            name: 'manager',
                            message: 'Who is the employee\'s manager?',
                            validate: managerInput => {
                                if (managerInput) {
                                    return true;
                                } else {
                                    console.log('Please Add a Manager');
                                    return false;
                                }
                            }
                        }
                    ]).then((answers) => {
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].title === answers.role) {
                                var role = result[i];
                            }
                        }
                        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, role.id, answers.manager.id], (error, result) => {
                            if (error) throw error;
                            console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`)
                            employee_tracker();
                        });
                    })
                });
            } else if (answers.prompt === 'Update An Employee\'s Role') {
                db.query(`SELECT * FROM employee, role`, (error, result) => {
                    if (error) throw error;
        // Choose an Employee to Update            
                    inquirer.prompt([{
                            type: 'list',
                            name: 'employee',
                            message: 'Which employee\'s role do you want to update?',
                            choices: () => {
                                var array = [];
                                for (var i = 0; i < result.length; i++) {
                                    array.push(result[i].last_name);
                                }
                                var employeeArray = [...new Set(array)];
                                return employeeArray;
                            }
                        },
                        {
        // Updating the New Role
                            type: 'list',
                            name: 'role',
                            message: 'What is the employee\'s new role?',
                            choices: () => {
                                var array = [];
                                for (var i = 0; i < result.length; i++) {
                                    array.push(result[i].title);
                                }
                                var newArray = [...new Set(array)];
                                return newArray;
                            }
                        }
                    ]).then((answers) => {
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
                            if (error) throw error;
                            console.log(`Updated ${answers.employee} role to the database.`)
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