// create create
create table test_table (
  id int not null,
  name varchar(255) DEFAULT NULL,
  age int DEFAULT NULL,
  address varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
) engine=InnoDB DEFAULT CHARSET=utf8mb4;

// create procedure
create definer=`tipjs`@`%` procedure `insert_data`()
begin
declare max
