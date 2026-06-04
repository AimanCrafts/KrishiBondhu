const express = require("express");
const router = express.Router();
const userAuth = require("../middleware/userAuth");

const {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  saveFarmData,
  updateFarmData,
  createFarmerListing,
  getFarmerListings,
  deleteFarmerListing,
} = require("../controllers/userController");

router.use(userAuth);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/change-password", changePassword);
router.delete("/account", deleteAccount);

router.post("/farm-data", saveFarmData);
router.put("/farm-data", updateFarmData);

router.post("/listings", createFarmerListing);
router.get("/listings", getFarmerListings);
router.delete("/listings/:id", deleteFarmerListing);

module.exports = router;
