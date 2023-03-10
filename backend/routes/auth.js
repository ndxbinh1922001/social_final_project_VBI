const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../middleware/auth");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //check user existed
    console.log("1");
    console.log("req:", req);
    // const email = await User.find({ username: req.body.email });
    // console.log("email:",email);
    console.log("2");
    // if (email.length > 0) {
    //   res.status(409).json("email existed");
    //   return;
    // }
    console.log("3");

    // console.log("username:", username);
    // console.log("email:", email);
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //create new user
    console.log("4");
    
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    console.log("5");

    //save user and respond
    const user = await newUser.save();
    const token = generateAccessToken(`${user._id}`);
    console.log("6");

    res
      .status(200)
      .json({ user: { username: user.username, email: user.email }, token });
  } catch (err) {
    console.log("err:", err);
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log("user:", user);
    if (!user) {
      res.status(404).json("user not found");
      return;
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      res.status(400).json("wrong password");
      return;
    }
    const token = generateAccessToken(`${user._id}`);
    const { password, ...other } = user._doc;
    res.status(200).json({ user: other, token });
  } catch (err) {
    console.log("err:", err);
    res.status(500).json(err);
  }
});

module.exports = router;
