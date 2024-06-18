const mysql = require("mysql2");

require("dotenv").config();

// Dotenv variables
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const connection = mysql.createConnection({
  host: "localhost",
  // Your username
  user: dbUser,
  // Your password
  password: dbPassword,
  database: dbName,
});

connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;
