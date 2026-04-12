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

const { verifyToken } = require("../middleware/adminAuth");

router.get("/content/:key", getContentBlock);

router.get("/marketplace", verifyToken, getMarketplaceListings);

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

// Farmer directory (buyers browse farmers)
router.get("/farmers", verifyToken, buyerOnly, getFarmerDirectory);

module.exports = router;
