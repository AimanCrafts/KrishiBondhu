require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/user");

async function fix() {
  await connectDB();

  await User.deleteOne({ email: "admin@krishibondhu.com" });
  console.log("✅ Old admin deleted!");

  await User.create({
    name: "KrishiBondhu Admin",
    email: "admin@krishibondhu.com",
    password: "Admin@1234",
    role: "admin",
    status: "active",
  });
  console.log("✅ New admin created!");
  console.log("Email: admin@krishibondhu.com");
  console.log("Password: Admin@1234");

  await mongoose.disconnect();
}

fix();
