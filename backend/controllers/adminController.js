const User = require("../models/user");
const Crop = require("../models/crop");
const Listing = require("../models/listing");
const Expert = require("../models/expert");
const Content = require("../models/content");
const Disease = require("../models/disease");
const Notification = require("../models/notification");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const DEFAULT_CONTENT = [
  {
    key: "farmer_banner",
    type: "image",
    label: "Farmer Dashboard Banner",
    desc: "Hero image shown at the top of the farmer dashboard",
    value:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920",
  },
  {
    key: "buyer_banner",
    type: "image",
    label: "Buyer Dashboard Banner",
    desc: "Hero image shown at the top of the buyer/business dashboard",
    value:
      "https://images.unsplash.com/photo-1592982537447-6c7a16c55f8b?auto=format&fit=crop&w=1920",
  },
  {
    key: "market_banner",
    type: "image",
    label: "Marketplace Banner",
    desc: "Banner image shown on the marketplace page",
    value:
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1920",
  },
  {
    key: "farmer_alert",
    type: "text",
    label: "Farmer Alert Banner",
    desc: "Alert text shown to all farmers",
    value: "",
  },
  {
    key: "buyer_alert",
    type: "text",
    label: "Buyer Alert Banner",
    desc: "Alert text shown to all buyers",
    value: "",
  },
  {
    key: "market_notice",
    type: "text",
    label: "Marketplace Notice",
    desc: "Notice on marketplace page",
    value: "",
  },
];

const uploadToCloudinary = (buffer, folder = "krishibondhu/crops") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [
          { width: 800, height: 600, crop: "fill", quality: "auto" },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      },
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      success: true,
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getStats = async (req, res) => {
  try {
    const [farmers, buyers, pending, crops, listings, experts] =
      await Promise.all([
        User.countDocuments({ role: "farmer" }),
        User.countDocuments({ role: "business" }),
        User.countDocuments({ status: "pending" }),
        Crop.countDocuments(),
        Listing.countDocuments({ status: "active" }),
        Expert.countDocuments(),
      ]);
    res.json({ farmers, buyers, pending, crops, listings, experts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const { limit, sort, role, status } = req.query;
    const filter = { role: { $ne: "admin" } };
    if (role && role !== "all") filter.role = role;
    if (status && status !== "all") filter.status = status;

    let query = User.find(filter).select("-password");
    if (sort) {
      const [field, order] = sort.split(":");
      query = query.sort({ [field]: parseInt(order) || -1 });
    } else query = query.sort({ createdAt: -1 });
    if (limit) query = query.limit(parseInt(limit));

    const users = await query;
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["active", "pending", "suspended", "rejected"];
    if (!allowed.includes(status))
      return res.status(400).json({ message: "Invalid status value" });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (status === "active") {
      await Notification.create({
        audience: user.role === "farmer" ? "farmers" : "business",
        type: "status_change",
        title: "Account Approved",
        message:
          "Your account has been approved. You can now access all features.",
        link: "/farmer_dashboard",
        refId: user._id.toString(),
      });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCrops = async (req, res) => {
  try {
    const crops = await Crop.find().sort({ createdAt: -1 });
    res.json({ crops });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createCrop = async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.file)
      body.img = await uploadToCloudinary(
        req.file.buffer,
        "krishibondhu/crops",
      );
    if (typeof body.tags === "string") {
      body.tags = body.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const crop = await Crop.create(body);

    await Notification.create({
      audience: "farmers",
      type: "new_crop",
      title: `New Crop Added: ${crop.name}`,
      message: `${crop.name} (${crop.type}) is now available in the Crop Library. Click to view details.`,
      link: `/crop_detail/${crop._id}`,
      refId: crop._id.toString(),
    });

    res.status(201).json({ success: true, crop });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCrop = async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.file)
      body.img = await uploadToCloudinary(
        req.file.buffer,
        "krishibondhu/crops",
      );
    if (typeof body.tags === "string") {
      body.tags = body.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
    const crop = await Crop.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!crop) return res.status(404).json({ message: "Crop not found" });
    res.json({ success: true, crop });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findByIdAndDelete(req.params.id);
    if (!crop) return res.status(404).json({ message: "Crop not found" });
    res.json({ success: true, message: "Crop deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDiseases = async (req, res) => {
  try {
    const diseases = await Disease.find().sort({ createdAt: -1 });
    res.json({ diseases });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createDisease = async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.file && req.file.buffer) {
      body.img = await uploadToCloudinary(
        req.file.buffer,
        "krishibondhu/diseases",
      );
    } else if (req.file && req.file.path) {
      body.img = req.file.path;
    }
    if (typeof body.symptoms === "string") {
      body.symptoms = body.symptoms
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const disease = await Disease.create(body);

    const sevLabel =
      disease.severity === "high"
        ? "High"
        : disease.severity === "medium"
          ? "Medium"
          : "Low";

    await Notification.create({
      audience: "farmers",
      type: "new_disease",
      title: `New Disease Alert: ${disease.name}`,
      message: `A disease "${disease.name}" has been reported for ${disease.crop}. Severity: ${sevLabel}. Click to view details.`,
      link: `/disease_detail/${disease._id}`,
      refId: disease._id.toString(),
    });

    res.status(201).json({ success: true, disease });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateDisease = async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.file && req.file.buffer) {
      body.img = await uploadToCloudinary(
        req.file.buffer,
        "krishibondhu/diseases",
      );
    } else if (req.file && req.file.path) {
      body.img = req.file.path;
    }
    if (typeof body.symptoms === "string") {
      body.symptoms = body.symptoms
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    const disease = await Disease.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!disease) return res.status(404).json({ message: "Disease not found" });
    res.json({ success: true, disease });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteDisease = async (req, res) => {
  try {
    const disease = await Disease.findByIdAndDelete(req.params.id);
    if (!disease) return res.status(404).json({ message: "Disease not found" });
    res.json({ success: true, message: "Disease deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getListings = async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json({ listings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createListing = async (req, res) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const patchListing = async (req, res) => {
  try {
    const allowed = ["featured", "status"];
    const update = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) update[k] = req.body[k];
    });
    const listing = await Listing.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json({ success: true, message: "Listing deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getExperts = async (req, res) => {
  try {
    const experts = await Expert.find().sort({ createdAt: -1 });
    res.json({ experts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createExpert = async (req, res) => {
  try {
    const expert = await Expert.create(req.body);
    res.status(201).json({ success: true, expert });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateExpert = async (req, res) => {
  try {
    const expert = await Expert.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!expert) return res.status(404).json({ message: "Expert not found" });
    res.json({ success: true, expert });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteExpert = async (req, res) => {
  try {
    const expert = await Expert.findByIdAndDelete(req.params.id);
    if (!expert) return res.status(404).json({ message: "Expert not found" });
    res.json({ success: true, message: "Expert deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getContent = async (req, res) => {
  try {
    let blocks = await Content.find().sort({ key: 1 });
    if (blocks.length === 0) blocks = await Content.insertMany(DEFAULT_CONTENT);
    res.json({ content: blocks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateContent = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    const block = await Content.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true },
    );
    res.json({ success: true, block });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const audienceFilter =
      user.role === "farmer"
        ? { audience: { $in: ["all", "farmers"] } }
        : { audience: { $in: ["all", "business"] } };

    const notifications = await Notification.find(audienceFilter)
      .sort({ createdAt: -1 })
      .limit(20);

    const withRead = notifications.map((n) => ({
      ...n.toObject(),
      isRead: n.readBy.map(String).includes(String(userId)),
    }));

    const unreadCount = withRead.filter((n) => !n.isRead).length;

    res.json({ notifications: withRead, unreadCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await Notification.findByIdAndUpdate(id, {
      $addToSet: { readBy: userId },
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const markAllRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    const audienceFilter =
      user.role === "farmer"
        ? { audience: { $in: ["all", "farmers"] } }
        : { audience: { $in: ["all", "business"] } };

    await Notification.updateMany(audienceFilter, {
      $addToSet: { readBy: userId },
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
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
};
