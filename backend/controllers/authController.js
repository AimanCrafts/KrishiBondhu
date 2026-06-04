const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ─────────────────────────────────────────
// FARMER SIGNUP
// POST /api/auth/farmer/signup
// ─────────────────────────────────────────
const farmerSignup = async (req, res) => {
  try {
    const { name, phone, password, district, division } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "An account with this phone number already exists." });
    }

    const user = await User.create({
      name,
      phone,
      password,
      role: "farmer",
      district: district || "",
      division: division || "",
    });

    res.status(201).json({
      success: true,
      message: "Farmer account has been created successfully.",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        profile: {
          district: user.district || "",
          division: user.division || "",
        },
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
      return res
        .status(400)
        .json({ message: "Please provide phone and password." });
    }

    const user = await User.findOne({ phone, role: "farmer" });
    if (!user) {
      return res.status(401).json({ message: "Invalid phone number." });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        profile: {
          district: user.district || "",
          division: user.division || "",
        },
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
    const {
      name,
      email,
      password,
      companyName,
      businessType,
      tradeLicense,
      tin,
      employeeCount,
      annualTurnover,
      contactPerson,
      division,
      district,
      address,
    } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({
          message: "This email is already associated with another account.",
        });
    }

    const documents = {
      licenseFile: { url: "", publicId: "" },
      tinFile: { url: "", publicId: "" },
      extraFile: { url: "", publicId: "" },
    };

    if (req.files?.licenseFile?.[0]) {
      const r = await cloudinary.uploader.upload(
        req.files.licenseFile[0].path,
        {
          folder: "kb_documents",
          resource_type: "auto",
        },
      );
      fs.unlinkSync(req.files.licenseFile[0].path);
      documents.licenseFile = { url: r.secure_url, publicId: r.public_id };
    }

    if (req.files?.tinFile?.[0]) {
      const r = await cloudinary.uploader.upload(req.files.tinFile[0].path, {
        folder: "kb_documents",
        resource_type: "auto",
      });
      fs.unlinkSync(req.files.tinFile[0].path);
      documents.tinFile = { url: r.secure_url, publicId: r.public_id };
    }

    if (req.files?.extraFile?.[0]) {
      const r = await cloudinary.uploader.upload(req.files.extraFile[0].path, {
        folder: "kb_documents",
        resource_type: "auto",
      });
      fs.unlinkSync(req.files.extraFile[0].path);
      documents.extraFile = { url: r.secure_url, publicId: r.public_id };
    }

    await User.create({
      name,
      email,
      password,
      role: "business",
      division: division || "",
      district: district || "",
      status: "pending",
      businessInfo: {
        companyName: companyName || "",
        businessType: businessType || "",
        tradeLicense: tradeLicense || "",
        tin: tin || "",
        employeeCount: employeeCount || "",
        annualTurnover: annualTurnover || "",
        contactPerson: contactPerson || "",
        address: address || "",
      },
      documents,
    });

    res.status(201).json({
      success: true,
      message: "Successfully registered. Please wait for admin approval.",
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
      return res
        .status(400)
        .json({ message: "Please provide email and password." });
    }

    const user = await User.findOne({ email, role: "business" });
    if (!user) {
      return res.status(401).json({ message: "Invalid email." });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    if (user.status === "pending") {
      return res.status(403).json({
        message: "Your account is on hold. Please wait for admin approval.",
      });
    }

    if (user.status === "rejected") {
      return res.status(403).json({
        message:
          "Your account has been rejected. Please contact admin for details.",
      });
    }

    if (user.status === "suspended") {
      return res.status(403).json({
        message: "Your account has been suspended.",
      });
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
