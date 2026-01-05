const express = require("express");
const router = express.Router();

// Signup route
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  // Later you will save to DB
  //** Its required To All the database are store in our Mongo Db atlas */

  res.json({ message: "User registered successfully", user: { name, email } });
});

module.exports = router;

//  Login Route
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  // Later you will verify credentials and generate JWT
  res.json({ message: "Login successful", user: { email } });
});
