-- Insert names of departments into department table
INSERT INTO department (name)
VALUES ('Sales'),
       ('Engineering'),
       ('Finance'),
       ('Legal');

-- Insert roles of employee into role table
INSERT INTO role (title, salary, department_id)
VALUES ('Salesperson', 80000, 1),
       ('Software Engineer', 180000, 2),
       ('Accountant', 100000, 3),
       ('Lawyer', 200000, 4);

-- Insert employee information into employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('William', 'Gil', 4, NULL),
       ('Alena', 'Rios', 3, NULL),
       ('Zev', 'Silver', 2, 1),
       ('Ryan', 'Javadi', 1, 2);