const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config(); // load MONGODB_URI from .env

// Use environment variable for safety
const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://krishi_user:<db_password>@cluster0.lnwvsxb.mongodb.net/?appName=Cluster0";

// Create a MongoClient with stable API version and TLS settings
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  tls: true, // force TLS
  tlsAllowInvalidCertificates: false, // ensure certificate is verified
});

async function run() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await client.connect();
    console.log("✅ Connected successfully.");

    // Ping the database to confirm connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged deployment successfully!");
  } catch (err) {
    console.error("❌ Connection failed:", err);
  } finally {
    await client.close();
    console.log("Connection closed.");
  }
}

run();
