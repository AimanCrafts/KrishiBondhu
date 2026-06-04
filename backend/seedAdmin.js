/**
 * Run once to create the admin account:
 *   node seedAdmin.js
 *
 * Change the email/password below before running.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/user");

const ADMIN_EMAIL = "admin@krishibondhu.com";
const ADMIN_PASSWORD = "Admin@1234";
const ADMIN_NAME = "KrishiBondhu Admin";

async function seed() {
  try {
    await connectDB();

    const existing = await User.findOne({ email: ADMIN_EMAIL });

    if (existing) {
      console.log("⚠️ Admin already exists:", existing.email);
      await mongoose.disconnect();
      return;
    }

    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD, // ✅ plain password (schema will hash it)
      role: "admin",
      status: "active",
    });

    console.log("✅ Admin created successfully!");
    console.log("Email:", ADMIN_EMAIL);
    console.log("Password:", ADMIN_PASSWORD);

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
}

seed();
