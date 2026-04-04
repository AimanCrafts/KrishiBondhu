const User = require("../models/user");
const Order = require("../models/order");
const Listing = require("../models/listing");
const Content = require("../models/content");

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/buyer/profile
// Returns the logged-in buyer's profile (minus password)
// ─────────────────────────────────────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/buyer/profile
// Update buyer's editable profile fields
// ─────────────────────────────────────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const allowed = [
      "name",
      "phone",
      "email",
      "division",
      "district",
      "companyName",
      "contactPerson",
      "businessType",
      "address",
      "bio",
      "cropInterests",
    ];

    const update = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) update[k] = req.body[k];
    });

    const user = await User.findByIdAndUpdate(req.user.id, update, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/buyer/change-password
// ─────────────────────────────────────────────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both currentPassword and newPassword required" });
    }
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch)
      return res.status(401).json({ message: "Current password is incorrect" });

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/buyer/orders
// Get all orders for the logged-in buyer (with optional status filter)
// ─────────────────────────────────────────────────────────────────────────────
const getOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { buyer: req.user.id };
    if (status && status !== "all") filter.status = status;

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/buyer/orders/:id
// ─────────────────────────────────────────────────────────────────────────────
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      buyer: req.user.id,
    });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/buyer/orders
// Place a new order
// ─────────────────────────────────────────────────────────────────────────────
const placeOrder = async (req, res) => {
  try {
    const {
      listingId,
      crop,
      qtyKg,
      pricePerKg,
      farmerName,
      farmerLocation,
      note,
    } = req.body;

    if (!crop || !qtyKg || !pricePerKg) {
      return res
        .status(400)
        .json({ message: "crop, qtyKg, and pricePerKg are required" });
    }

    let listing = null;
    if (listingId) {
      listing = await Listing.findById(listingId);
      if (!listing)
        return res.status(404).json({ message: "Listing not found" });
      if (listing.status !== "active")
        return res.status(400).json({ message: "Listing is no longer active" });
    }

    const order = await Order.create({
      buyer: req.user.id,
      listing: listingId || null,
      crop,
      qtyKg: Number(qtyKg),
      pricePerKg: Number(pricePerKg),
      totalAmount: Number(qtyKg) * Number(pricePerKg),
      farmerName: farmerName || (listing ? listing.farmer : ""),
      farmerLocation: farmerLocation || (listing ? listing.location : ""),
      note: note || "",
      status: "pending",
      paymentStatus: "pending",
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/buyer/orders/:id/cancel
// Buyer can cancel a pending order
// ─────────────────────────────────────────────────────────────────────────────
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      buyer: req.user.id,
    });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status !== "pending")
      return res
        .status(400)
        .json({ message: "Only pending orders can be cancelled" });

    order.status = "cancelled";
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/buyer/marketplace
// Public-ish — returns active listings for buyers to browse
// (No admin token needed — buyer JWT is enough)
// ─────────────────────────────────────────────────────────────────────────────
const getMarketplaceListings = async (req, res) => {
  try {
    const { type, featured, sort, limit } = req.query;

    const filter = { status: "active" };
    if (featured === "true") filter.featured = true;

    let query = Listing.find(filter);

    if (sort === "price_asc") query = query.sort({ price: 1 });
    else if (sort === "price_desc") query = query.sort({ price: -1 });
    else query = query.sort({ featured: -1, createdAt: -1 });

    if (limit) query = query.limit(parseInt(limit));

    const listings = await query;
    res.json({ listings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/buyer/farmers
// Returns approved farmer list for the directory
// ─────────────────────────────────────────────────────────────────────────────
const getFarmerDirectory = async (req, res) => {
  try {
    const { division, search } = req.query;

    const filter = { role: "farmer", status: "active" };
    if (division && division !== "all") filter.division = division;

    let farmers = await User.find(filter)
      .select("-password -email")
      .sort({ createdAt: -1 });

    if (search) {
      const s = search.toLowerCase();
      farmers = farmers.filter(
        (f) =>
          f.name.toLowerCase().includes(s) ||
          (f.district || "").toLowerCase().includes(s),
      );
    }

    res.json({ farmers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/buyer/content/:key
// Returns a single admin-managed content block (buyer_alert, market_notice, etc.)
// No auth required — public read of content blocks
// ─────────────────────────────────────────────────────────────────────────────
const getContentBlock = async (req, res) => {
  try {
    const block = await Content.findOne({ key: req.params.key });
    if (!block)
      return res.json({ key: req.params.key, value: "", type: "text" });
    res.json({ key: block.key, value: block.value, type: block.type });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
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
};
