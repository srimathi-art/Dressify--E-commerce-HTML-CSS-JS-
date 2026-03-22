// db.js
const mysql = require("mysql2");

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "G@yuSri32",
  database: "dress_shop_db"
});

conn.connect((err) => {
  if (err) throw err;
  console.log("✅ MySQL Connected");
});

module.exports = conn;


