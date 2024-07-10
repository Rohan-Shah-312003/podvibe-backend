const UserModel = require("../models/Users");
const express = require("express");
const userRouter = express.Router();

// POST
userRouter.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });

  if (user) {
    return res.json({ message: "User already exists" });
  }

  const newUser = new UserModel({ username, password });

  await newUser.save();

  res.json({ message: "Regsitered Successfully" });
});

userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.json({ message: "User not found" });
  } else if (user.password !== password) {
    return res.json({ message: "Incorrect password" });
  } else {
    const flag = true;
    res.json({ message: "Logged in successfully", flag, userID: user._id });
  }
});

module.exports = userRouter;
