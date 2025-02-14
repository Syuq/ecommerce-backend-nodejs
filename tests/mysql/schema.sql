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


create table orders (
   order_id int,
   order_date date not null,
   total_amount decimal(10,2),
   primary key (order_id, order_date)
)
PARTITION BY RANGE COLUMNS (order_date) (
  PARTITION p0 VALUES LESS THAN ('2025-01-01'),
  PARTITION p2024 VALUES LESS THAN ('2025-01-01'),
  PARTITION p2025 VALUES LESS THAN ('2025-01-01'),
  PARTITION pmax VALUES LESS THAN (MAXVALUE),
)
