// Import mysql2
const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
         host: 'localhost',
        // MySQL username,
        user: 'root',
        // Add MySQL password here
        password: '',
        database: 'employee_db',
    },
    console.log('Connected to the database!')
);

module.exports = db;
