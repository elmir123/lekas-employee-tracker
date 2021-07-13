
USE employees_db;
INSERT INTO department (name)
VALUES ("Engineering"), ("Human Resources"), ("Business Development");
INSERT INTO role (title, salary, department_id)
VALUES ("HR Assistant", 60000 , 2), ("Front Desk Clark", 50000, 2), ("CEO", 200000, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Manager","Lekovic",3,null),("Elmir Assist", "Lekovic", 2 , 1), ("Eamo Front", "Lekovic", 2, 1), ("Lekas", "Lekovic", 1, 1);