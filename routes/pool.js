var mysql = require('mysql');

var pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3310,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '1234',
  database: process.env.MYSQL_DATABASE || 'dashboard_assignment',
  multipleStatements: true,
  connectionLimit: 100,
});

module.exports = pool;