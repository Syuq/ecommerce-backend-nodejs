# SQL

## CREATE TABLE

```sql
CREATE TABLE test_table (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age INT,
  address VARCHAR(255)
);
```

## CREATE PROCEDURE

```sql
CREATE DEFINER = `tipjs`@`%` PROCEDURE `insert_data`()
BEGIN
DECLARE max_id INT DEFAULT 1000000;
DECLARE i INT DEFAULT 1;
WHILE i <= max_id DO
INSERT INTO test_table (id, name, age, address) VALUES (i, CONCAT('Name', i), i%100, CONCAT
('Address', i));
SET i = i + 1;
END WHILE;
END
```

## Master Slave

```sh
CHANGE MASTER TO
MASTER_HOST='ip-address',
MASTER_PORT=3306,
MASTER_USER='root',
MASTER_PASSWORD='tipjs',
MASTER_LOG_FILE='mysql-bin.000001',
MASTER_LOG_POS=157,
MASTER_CONNECT_RETRY=60,
GET_MASTER_PUBLIC_KEY=1;
```

<!-- root@127.0.0.1:8822 -->
