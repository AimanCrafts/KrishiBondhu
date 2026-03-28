const User = require("../models/user");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ─────────────────────────────────────────
// FARMER SIGNUP
// POST /api/auth/farmer/signup
// ─────────────────────────────────────────
const farmerSignup = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ message: "সব field পূরণ করুন" });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "এই নম্বর দিয়ে আগেই account আছে" });
    }

    const user = await User.create({ name, phone, password, role: "farmer" });

    res.status(201).json({
      success: true,
      message: "Farmer account তৈরি হয়েছে",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────
// FARMER LOGIN
// POST /api/auth/farmer/login
// ─────────────────────────────────────────
const farmerLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Phone এবং password দিন" });
    }

    const user = await User.findOne({ phone, role: "farmer" });
    if (!user) {
      return res.status(401).json({ message: "Phone number সঠিক নয়" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password সঠিক নয়" });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────
// BUYER SIGNUP
// POST /api/auth/buyer/signup
// ─────────────────────────────────────────
const buyerSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "সব field পূরণ করুন" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "এই email দিয়ে আগেই account আছে" });
    }

    const user = await User.create({ name, email, password, role: "business" });

    res.status(201).json({
      success: true,
      message: "Buyer account তৈরি হয়েছে",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────
// BUYER LOGIN
// POST /api/auth/buyer/login
// ─────────────────────────────────────────
const buyerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email এবং password দিন" });
    }

    const user = await User.findOne({ email, role: "business" });
    if (!user) {
      return res.status(401).json({ message: "Email সঠিক নয়" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password সঠিক নয়" });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { farmerSignup, farmerLogin, buyerSignup, buyerLogin };
