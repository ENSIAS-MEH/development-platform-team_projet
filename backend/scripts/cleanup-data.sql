-- Remove all projects and formations (keeps user accounts).
-- Usage: mariadb -u projectmatch -pprojectmatch projectmatch_db < scripts/cleanup-data.sql

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE team_members;
TRUNCATE TABLE teams;
TRUNCATE TABLE projects;
TRUNCATE TABLE formations;
SET FOREIGN_KEY_CHECKS = 1;
