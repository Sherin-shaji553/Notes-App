const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const generateToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};


 
exports.registerController = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    if (!userName || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({ message: "User already exists. Please login." });
    }

    const newUser = new User({ userName, email, password });
    await newUser.save();

    const token = generateToken(newUser._id);

    res.status(201).json({
      id: newUser._id,
      userName: newUser.userName,
      email: newUser.email,
      token
    });

  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Server error..." });
  }
};

exports.loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (!userExist || !(await userExist.isPasswordMatch(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(userExist._id);

    res.json({
      id: userExist._id,
      userName: userExist.userName,
      email: userExist.email,
      token
    });

  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


exports.loggedUserController = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, no user found" });
    }
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Logged user error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
