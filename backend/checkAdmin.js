require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./models/user");

async function check() {
  await connectDB();

  const admin = await User.findOne({ email: "admin@krishibondhu.com" });
  console.log("Admin found:", admin ? "YES" : "NO");

  if (admin) {
    const match = await admin.matchPassword("Admin@1234");
    console.log("Password match:", match ? "✅ YES" : "❌ NO");
    console.log("Status:", admin.status);
    console.log("Role:", admin.role);
  }

  process.exit();
}

check();
