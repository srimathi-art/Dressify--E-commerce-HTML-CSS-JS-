const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const conn = require("./db"); // Your existing MySQL connection

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ---------- REGISTER ----------
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  // Check if email already exists
  conn.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).send("Database error");

    if (results.length > 0) {
      return res.status(400).send("Email already registered");
    }

    // Insert new user
    conn.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password],
      (err2) => {
        if (err2) return res.status(500).send("Database error on insert");
        res.status(200).send("Registration successful");
      }
    );
  });
});

// ---------- LOGIN ----------
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  conn.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("❌ Error during login:", err);
      return res.status(500).send("Login failed");
    }
    if (results.length > 0) {
      const user = results[0];
      res.status(200).json({ status: "success", message: "Login successful", user });
    } else {
      res.status(401).json({ status: "error", message: "Invalid credentials" });
    }
  });
});

// ---------- ADD TO CART ----------
app.post("/add-to-cart", (req, res) => {
  let { user_id, name, price, quantity, image } = req.body;

  // Remove ₹ and commas, convert to number
  price = Number(price.toString().replace(/[₹,]/g, ""));
  quantity = Number(quantity);

  const sql = `
    INSERT INTO cart (user_id, product_name, price, quantity, image)
    VALUES (?, ?, ?, ?, ?)
  `;

  conn.query(sql, [user_id, name, price, quantity, image], (err) => {
    if (err) {
      console.error(err);
      return res.json({ status: "error", message: "DB error" });
    }
    res.json({ status: "success", message: "Item added to cart" });
  });
});

// ---------- GET CART ----------
app.get("/cart/:user_id", (req, res) => {
  const { user_id } = req.params;
  const sql = "SELECT * FROM cart WHERE user_id = ?";

  conn.query(sql, [user_id], (err, results) => {
    if (err) return res.json({ status: "error", message: err });
    res.json({ status: "success", cart: results });
  });
});

// ---------- UPDATE CART QUANTITY ----------
app.post("/update-cart", (req, res) => {
  const { id, change } = req.body;

  // Get current quantity first
  conn.query("SELECT quantity FROM cart WHERE id = ?", [id], (err, results) => {
    if (err) return res.json({ status: "error", message: err });
    if (!results.length) return res.json({ status: "error", message: "Item not found" });

    let newQty = results[0].quantity + change;
    if (newQty < 1) newQty = 1;

    conn.query("UPDATE cart SET quantity = ? WHERE id = ?", [newQty, id], (err2) => {
      if (err2) return res.json({ status: "error", message: err2 });
      res.json({ status: "success", newQuantity: newQty });
    });
  });
});

// ---------- REMOVE FROM CART ----------
app.delete("/remove-from-cart/:id", (req, res) => {
  const { id } = req.params;

  conn.query("DELETE FROM cart WHERE id = ?", [id], (err) => {
    if (err) return res.json({ status: "error", message: err });
    res.json({ status: "success", message: "Item removed from cart" });
  });
});

// ---------- ADD TO FAVOURITES ----------
app.post("/add-to-favourites", (req, res) => {
  let { user_id, name, price, image } = req.body;
  price = Number(price.toString().replace(/[₹,]/g, ""));

  const sql = `
    INSERT INTO favourites (user_id, product_name, price, image)
    VALUES (?, ?, ?, ?)
  `;
  conn.query(sql, [user_id, name, price, image], (err) => {
    if (err) return res.json({ status: "error", message: err });
    res.json({ status: "success", message: "Added to favourites" });
  });
});

// ---------- GET FAVOURITES ----------
app.get("/favourites/:user_id", (req, res) => {
  const { user_id } = req.params;
  const sql = "SELECT * FROM favourites WHERE user_id = ?";

  conn.query(sql, [user_id], (err, results) => {
    if (err) return res.json({ status: "error", message: err });
    res.json({ status: "success", favourites: results });
  });
});

// ---------- REMOVE FROM FAVOURITES ----------
app.delete("/remove-from-favourites/:id", (req, res) => {
  const { id } = req.params;
  conn.query("DELETE FROM favourites WHERE id = ?", [id], (err) => {
    if (err) return res.json({ status: "error", message: err });
    res.json({ status: "success", message: "Favourite removed" });
  });
});

// ---------- START SERVER ----------
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));