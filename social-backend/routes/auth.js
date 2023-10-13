const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // check user already exist or not
  // if already exist then redirect to login page
  // check username is already used or not

  try {
    // hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const newUser = await User({
      username,
      email,
      password: hashedPassword,
    });

    // save user
    const user = await newUser.save();
    // response to client
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
});

// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "user not found" });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(400).json({ message: "wrong password" });

    return res.status(200).json({ message: "success", user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
});

// logout
router.post("/logout" ,async (req, res)=>{})

module.exports = router;
