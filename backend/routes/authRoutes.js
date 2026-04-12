const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  farmerSignup,
  farmerLogin,
  buyerSignup,
  buyerLogin,
} = require("../controllers/authController");

const upload = multer({ dest: "uploads/" });

router.post("/farmer/signup", farmerSignup);
router.post("/farmer/login", farmerLogin);

router.post(
  "/buyer/signup",
  upload.fields([
    { name: "licenseFile", maxCount: 1 },
    { name: "tinFile", maxCount: 1 },
    { name: "extraFile", maxCount: 1 },
  ]),
  buyerSignup,
);
router.post("/buyer/login", buyerLogin);

module.exports = router;
