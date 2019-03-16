USE mysql;
CREATE USER 'raven'@'localhost' IDENTIFIED WITH mysql_native_password BY '4VXQgAyhnB$';
FLUSH PRIVILEGES;
GRANT ALL ON *.* TO 'raven'@'localhost';
FLUSH PRIVILEGES;