const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const conn = require("./db"); // Make sure db.js is set up correctly

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Register Route
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  conn.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.error("❌ Error inserting data:", err);
      return res.status(500).send("Registration failed");
    }
    console.log("✅ User registered:", result);
    res.status(200).send("User registered successfully");
  });
});

// Login Route
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  conn.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("❌ Error during login:", err);
      return res.status(500).send("Login failed");
    }
    if (results.length > 0) {
      console.log("✅ Login successful:", results[0]);
      res.status(200).send("Login successful");
    } else {
      console.log("❌ Invalid credentials");
      res.status(401).send("Invalid credentials");
    }
  });
});

app.post("/add-to-cart", (req, res) => {
  const { name, price, quantity, image } = req.body;

  const sql = "INSERT INTO cart (name, price, quantity, image) VALUES (?, ?, ?, ?)";
  conn.query(sql, [name, price, quantity, image], (err, result) => {
    if (err) return res.json({ status: "error", message: err });
    res.json({ status: "success", message: "Item added to cart" });
  });
});


// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
