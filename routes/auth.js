const express = require("express");
const User = require("../models/User");
const { generateToken } = require("./jwtoken");
const router = express.Router();
const bcrypt = require("bcrypt");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password and hash it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // Check is there is user already with the same email
    const userEmail = await User.findOne({ email: req.body.email });

    if (userEmail) {
      return res.status(500).json("User already exists");
    } else {
      const user = await newUser.save();
      return res.status(201).json(user);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json("User doesnot exist");
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("Passwords didnt match");

    // Token payload
    const tokenPayload = {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const { password, ...otherUserDetails } = user._doc;

    return res.status(200).json({
      message: "Login Suceessful",
      ...otherUserDetails,
      token: generateToken(tokenPayload),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

module.exports = router;
