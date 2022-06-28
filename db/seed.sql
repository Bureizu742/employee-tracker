USE employees_DB;

INSERT INTO department (id, name)
VALUES (1, "Retail"),
       (2, "Brand Experience"),
       (3, "Human Resouces"),
       (4, "IT");

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Stylist", 42000, 1);
       (2, "Assistant Store Manager", 60000, 1);
       (3, "Store Manager", 75000, 1);
       (4, "Brand Manager", 65000, 2);
       (5, "Business Partner", 70000, 3);
       (6, "HR Director", 100000, 3);
       (7, "System Adminstrator", 80000, 4);
       (8, "IT Coordinator", 52000, 4);
       (9, "IT Manager", 105000, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (4, "Lillian", "Smith", 3, null);
       (5, "Steve", "Davis", 4, null);
       (7, "Julianna", "Kent", 6, null);
       (10, "David", "Johns", 9, null);
       (3, "Melissa", "Roberts", 2, 4);
       (1, "Robin", "Williams", 1, 3);
       (2, "Andy", "Lamden", 1, 3);
       (6, "Leah", "Smith", 5, 7);
       (8, "Zoey", "Rogers", 7, 10);
       (9, "Tony", "Stark", 8, 10);