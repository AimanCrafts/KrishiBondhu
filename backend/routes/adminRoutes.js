const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const {
  adminLogin,
  getStats,
  getUsers,
  updateUserStatus,
  getCrops,
  createCrop,
  updateCrop,
  deleteCrop,
  getListings,
  createListing,
  updateListing,
  patchListing,
  deleteListing,
  getExperts,
  createExpert,
  updateExpert,
  deleteExpert,
  getContent,
  updateContent,
} = require("../controllers/adminController");

// ── Public ───────────────────────────────────────────────────────────────────
// POST /api/admin/login
router.post("/login", adminLogin);

// ── Protected (all routes below require a valid admin JWT) ───────────────────
router.use(adminAuth);

// Overview
router.get("/stats", getStats);

// Users
router.get("/users", getUsers);
router.patch("/users/:id/status", updateUserStatus);

// Crops
router.get("/crops", getCrops);
router.post("/crops", createCrop);
router.put("/crops/:id", updateCrop);
router.delete("/crops/:id", deleteCrop);

// Marketplace
router.get("/marketplace", getListings);
router.post("/marketplace", createListing);
router.put("/marketplace/:id", updateListing);
router.patch("/marketplace/:id", patchListing);
router.delete("/marketplace/:id", deleteListing);

// Experts
router.get("/experts", getExperts);
router.post("/experts", createExpert);
router.put("/experts/:id", updateExpert);
router.delete("/experts/:id", deleteExpert);

// Content
router.get("/content", getContent);
router.put("/content/:key", updateContent);

module.exports = router;
