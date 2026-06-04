const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const upload = require("../middleware/upload");
const {
  adminLogin,
  getPublicStats,
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
  getMarketPrices,
  createMarketPrice,
  updateMarketPrice,
  deleteMarketPrice,
} = require("../controllers/adminController");

router.post("/login", adminLogin);
router.get("/public-stats", getPublicStats);
router.get("/crops", getCrops);
router.get("/diseases", getDiseases);
router.get("/experts", getExperts);
router.get("/market-prices", getMarketPrices);

router.use(adminAuth);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.patch("/users/:id/status", updateUserStatus);

router.post("/crops", upload.single("img"), createCrop);
router.put("/crops/:id", upload.single("img"), updateCrop);
router.delete("/crops/:id", deleteCrop);

router.post("/diseases", upload.single("img"), createDisease);
router.put("/diseases/:id", upload.single("img"), updateDisease);
router.delete("/diseases/:id", deleteDisease);

router.get("/marketplace", getListings);
router.post("/marketplace", createListing);
router.put("/marketplace/:id", updateListing);
router.patch("/marketplace/:id", patchListing);
router.delete("/marketplace/:id", deleteListing);

router.post("/experts", createExpert);
router.put("/experts/:id", updateExpert);
router.delete("/experts/:id", deleteExpert);

router.get("/content", getContent);
router.put("/content/:key", updateContent);

router.post("/market-prices", createMarketPrice);
router.put("/market-prices/:id", updateMarketPrice);
router.delete("/market-prices/:id", deleteMarketPrice);

router.get("/notifications", getNotifications);
router.patch("/notifications/:id/read", markNotificationRead);
router.patch("/notifications/read-all", markAllRead);

module.exports = router;
