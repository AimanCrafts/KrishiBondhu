const express = require("express");
const router = express.Router();
const {
  farmerSignup,
  farmerLogin,
  buyerSignup,
  buyerLogin,
} = require("../controllers/authController");

// Farmer routes
router.post("/farmer/signup", farmerSignup);
router.post("/farmer/login", farmerLogin);

// Buyer routes
router.post("/buyer/signup", buyerSignup);
router.post("/buyer/login", buyerLogin);

module.exports = router;
