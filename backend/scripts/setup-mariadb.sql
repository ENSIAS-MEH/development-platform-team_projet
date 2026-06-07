-- ProjectMatch database setup (run as MariaDB/MySQL admin)
-- Usage: sudo mariadb < scripts/setup-mariadb.sql

CREATE DATABASE IF NOT EXISTS projectmatch_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'projectmatch'@'localhost' IDENTIFIED BY 'projectmatch';
GRANT ALL PRIVILEGES ON projectmatch_db.* TO 'projectmatch'@'localhost';
FLUSH PRIVILEGES;
