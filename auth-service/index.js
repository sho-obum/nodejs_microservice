const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 7070;
const mongoose = require("mongoose");
const User = require("./User");
const jwt = require("jsonwebtoken");

app.use(express.json()); // Place this before defining routes

mongoose
  .connect("mongodb://localhost/auth-service")
  .then(() => {
    console.log(`Auth-Service DB connected`);
  })
  .catch((err) => {
    console.error(`DB connection error: ${err.message}`);
  });

// Register
app.post("/auth/register", async (req, res) => {
  const { email, password, name } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.json({ message: "User already exists" });
  } else {
    const newUser = new User({
      name,
      email,
      password,
    });
    await newUser.save(); // Await to ensure the user is saved before responding
    return res.json(newUser);
  }
});

// Login
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: "User doesn't exist" });
  }

  // Check if the entered password is valid
  if (password !== user.password) {
    return res.json({ message: "Invalid password" }); // Fixed typo `res.join` to `res.json`
  }

  const payload = {
    email,
    name: user.name,
  };

  jwt.sign(payload, "secret", (err, token) => {
    if (err) {
      console.log(err);
      return res.json({ message: "Error signing token" });
    } else {
      return res.json({ token });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Auth-Service running on port ${PORT}`);
});
