const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const upload = require("../middleware/upload");
const {
  adminLogin,
  getStats,
  getUsers,
  updateUserStatus,
  getCrops,
  createCrop,
  updateCrop,
  deleteCrop,
  getDiseases,
  createDisease,
  updateDisease,
  deleteDisease,
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
  getNotifications,
  markNotificationRead,
  markAllRead,
} = require("../controllers/adminController");

// Public
router.post("/login", adminLogin);
router.get("/crops", getCrops);
router.get("/diseases", getDiseases);

// Protected
router.use(adminAuth);

// Stats & Users
router.get("/stats", getStats);
router.get("/users", getUsers);
router.patch("/users/:id/status", updateUserStatus);

// Crops
router.post("/crops", upload.single("img"), createCrop);
router.put("/crops/:id", upload.single("img"), updateCrop);
router.delete("/crops/:id", deleteCrop);

// Diseases
router.post("/diseases", upload.single("img"), createDisease);
router.put("/diseases/:id", upload.single("img"), updateDisease);
router.delete("/diseases/:id", deleteDisease);

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

// Notifications
router.get("/notifications", getNotifications);
router.patch("/notifications/:id/read", markNotificationRead);
router.patch("/notifications/read-all", markAllRead);

module.exports = router;
