USE employee_db;

INSERT INTO department (id, name)
VALUES (1, "Sales Floor"),
       (2, "Inventory"),
       (3, "Human Resouces"),
       (4, "Offices");

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Stylist", 4200, 1),
       (2, "Assistant Store Manager", 6000, 1),
       (3, "Store Manager", 7500, 1),
       (4, "Cashier", 6500, 2),
       (5, "HR Staff", 7000, 3),
       (6, "HR Director", 1000, 3),
       (7, "IT", 9900, 4),
       (8, "Loss Prevention", 5500, 4),
       (9, "Electronics", 5000, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (4, "Lillian", "Smith", 1, null),
       (5, "Steve", "Davis", 2, null),
       (7, "Julianna", "Kent", 2, null),
       (10, "David", "Johns", 2, null),
       (3, "Melissa", "Roberts", 4, 4),
       (1, "Robin", "Williams", 4, 3),
       (2, "Andy", "Lamden", 4, 3),
       (6, "Leah", "Smith", 3, 7),
       (8, "Zoey", "Rogers", 3, 10),
       (9, "Tony", "Stark", 3, 10);