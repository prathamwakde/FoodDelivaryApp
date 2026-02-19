const User = require("../models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");

// ===== SIGNUP =====
const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please enter all fields",
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const data = {
      user: { id: user.id },
    };

    const authToken = jwt.sign(data, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      success: true,
      authToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// ===== LOGIN =====
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({
        message: "Invalid Credentials",
      });

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match)
      return res.status(400).json({
        message: "Invalid Credentials",
      });

    const data = {
      user: { id: user.id },
    };

    const authToken = jwt.sign(data, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      success: true,
      authToken,
    });
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

// ===== GET USER =====
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

module.exports = {
  signupUser,
  loginUser,
  getUser,
};
