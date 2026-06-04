const User = require("../models/user");
const Listing = require("../models/listing");
const bcrypt = require("bcrypt");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, district, division, farmSize, soilType, bio } =
      req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required." });
    }

    const updateData = {
      name: name.trim(),
      ...(phone && { phone: phone.trim() }),
      district: district || "",
      division: division || "",
      "profile.district": district || "",
      "profile.division": division || "",
      "profile.farmSize": farmSize || "",
      "profile.soilType": soilType || "",
      "profile.bio": bio || "",
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: false },
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters." });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: "Password changed successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, message: "Account has been deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const saveFarmData = async (req, res) => {
  try {
    const {
      currentCropName,
      currentCropVariety,
      plantedOn,
      areaAcres,
      fieldName,
      plannedCropName,
      plannedSowOn,
      soilType,
      irrigation,
      totalAcres,
    } = req.body;

    if (!currentCropName || !currentCropName.trim()) {
      return res
        .status(400)
        .json({ message: "Current crop name is required." });
    }

    const updateData = {
      "farmData.onboardingDone": true,
      "farmData.currentCrop.name": currentCropName.trim(),
      "farmData.currentCrop.variety": currentCropVariety || "",
      "farmData.currentCrop.plantedOn": plantedOn ? new Date(plantedOn) : null,
      "farmData.currentCrop.areaAcres": areaAcres ? Number(areaAcres) : 0,
      "farmData.currentCrop.fieldName": fieldName || "",
      "farmData.plannedCrop.name": plannedCropName || "",
      "farmData.plannedCrop.plannedSowOn": plannedSowOn
        ? new Date(plannedSowOn)
        : null,
      "farmData.field.soilType": soilType || "",
      "farmData.field.irrigation": irrigation || "",
      "farmData.field.totalAcres": totalAcres ? Number(totalAcres) : 0,
      "profile.soilType": soilType || "",
      "profile.farmSize": totalAcres ? String(totalAcres) : "",
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: false },
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateFarmData = async (req, res) => {
  return saveFarmData(req, res);
};

const createFarmerListing = async (req, res) => {
  try {
    // Check farmer is active
    const farmer = await User.findById(req.user.id).select(
      "status name district division role",
    );
    if (!farmer) return res.status(404).json({ message: "User not found" });
    if (farmer.role !== "farmer") {
      return res
        .status(403)
        .json({ message: "Only farmers can create listings." });
    }
    if (farmer.status !== "active") {
      return res.status(403).json({
        message:
          farmer.status === "pending"
            ? "Your account is not approved yet. You can list crops in the marketplace after admin approval."
            : farmer.status === "suspended"
              ? "Your account has been suspended. Marketplace access is restricted."
              : "Your account has been rejected. Marketplace access is restricted.",
        status: farmer.status,
      });
    }

    const { crop, qty, price, img } = req.body;
    if (!crop || !crop.trim()) {
      return res.status(400).json({ message: "Crop name is required." });
    }
    if (!price || isNaN(price) || Number(price) <= 0) {
      return res.status(400).json({ message: "Valid price is required." });
    }

    const location = `${farmer.district || ""}, ${farmer.division || ""}`
      .trim()
      .replace(/^,\s*|,\s*$/g, "");

    const listing = await Listing.create({
      crop: crop.trim(),
      farmer: farmer.name,
      farmerId: farmer._id,
      location,
      qty: qty || "",
      price: Number(price),
      img: img || "",
      featured: false,
      status: "active",
    });

    res.status(201).json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFarmerListings = async (req, res) => {
  try {
    const listings = await Listing.find({ farmerId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json({ listings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteFarmerListing = async (req, res) => {
  try {
    const listing = await Listing.findOne({
      _id: req.params.id,
      farmerId: req.user.id,
    });
    if (!listing)
      return res
        .status(404)
        .json({ message: "Listing not found or not owned by you." });
    await listing.deleteOne();
    res.json({ success: true, message: "Listing removed successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  saveFarmData,
  updateFarmData,
  createFarmerListing,
  getFarmerListings,
  deleteFarmerListing,
};
