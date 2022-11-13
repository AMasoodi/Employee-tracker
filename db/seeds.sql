insert into department (name)
values ("logistics"),
("IT"),
("Managment");
insert into role (title,salary,department_id)
values ("tech",65000,2),
("executive",90000,3),
("coordinator",50000,1);
insert into employee (first_name,last_name,role_id,manager_id)
values ("Sam", "Jackson",2,NULL),
("Michael","Murray",3,1),
("Steve","Jobs",1,1);