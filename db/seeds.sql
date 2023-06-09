INSERT INTO department
  (id, name)
VALUES
  (101, "Telepathy"),
  (200, "Telekinesis"),
  (300, "Clairvoyance"),
  (400, "Pyrokinesis"),
  (500, "Precognition");

INSERT INTO role
  (id, title, salary, department_id)
VALUES(100, "Telepath", 100000, 101),
  (200, "Telekinetic", 90000, 200),
  (300, "Clairvoyant", 80000, 300),
  (400, "Pyrokinetic", 70000, 400),
  (500, "Precog", 60000, 500);

INSERT INTO employee
  (id, first_name, last_name, role_id, manager_id)
VALUES(100, "Mickey", "Mouse", 100, 100)
       
