const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  getOrders,
  getOrderById,
  placeOrder,
  cancelOrder,
  getMarketplaceListings,
  getFarmerDirectory,
  getContentBlock,
} = require("../controllers/buyerController");

// ── Auth middleware ──
// Reuse the same verifyToken middleware already used for admin routes
const { verifyToken } = require("../middleware/adminAuth");

// ── Public (no auth) ──
// Admin-managed content blocks readable by anyone (buyer_alert, market_notice, buyer_banner, etc.)
router.get("/content/:key", getContentBlock);

// ── Protected: any logged-in user (buyer, farmer, admin) ──
// Marketplace is accessible to any logged-in user
router.get("/marketplace", verifyToken, getMarketplaceListings);

// ── Protected: buyer / business only ──
const buyerOnly = (req, res, next) => {
  if (req.user.role !== "business" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied — buyers only" });
  }
  next();
};

// Profile
router.get("/profile", verifyToken, buyerOnly, getProfile);
router.put("/profile", verifyToken, buyerOnly, updateProfile);
router.post("/change-password", verifyToken, buyerOnly, changePassword);

// Orders
router.get("/orders", verifyToken, buyerOnly, getOrders);
router.get("/orders/:id", verifyToken, buyerOnly, getOrderById);
router.post("/orders", verifyToken, buyerOnly, placeOrder);
router.patch("/orders/:id/cancel", verifyToken, buyerOnly, cancelOrder);

// Farmer directory
router.get("/farmers", verifyToken, buyerOnly, getFarmerDirectory);

module.exports = router;
