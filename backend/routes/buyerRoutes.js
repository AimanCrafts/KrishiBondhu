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

const userAuth = require("../middleware/userAuth");

router.get("/content/:key", getContentBlock);

router.get("/marketplace", userAuth, getMarketplaceListings);

const buyerOnly = (req, res, next) => {
  if (req.user.role !== "business" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied — buyers only" });
  }
  next();
};

router.get("/profile", userAuth, buyerOnly, getProfile);
router.put("/profile", userAuth, buyerOnly, updateProfile);
router.post("/change-password", userAuth, buyerOnly, changePassword);

router.get("/orders", userAuth, buyerOnly, getOrders);
router.get("/orders/:id", userAuth, buyerOnly, getOrderById);
router.post("/orders", userAuth, buyerOnly, placeOrder);
router.patch("/orders/:id/cancel", userAuth, buyerOnly, cancelOrder);

router.get("/farmers", userAuth, buyerOnly, getFarmerDirectory);

module.exports = router;
