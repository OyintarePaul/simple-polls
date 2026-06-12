// scripts/clear-db.js
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function clearDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("❌ Error: MONGODB_URI is not defined in your environment variables.");
    process.exit(1);
  }

  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connected successfully.");

    // Extract the active database name being targeted
    const dbName = mongoose.connection.name;
    console.log(`⚠️ WARNING: You are about to completely destroy the database: "${dbName}"`);
    console.log("💥 Executing dropDatabase routine...");

    // Drops the entire database matching your MONGODB_URI context instantly
    await mongoose.connection.db.dropDatabase();

    console.log(`✨ Success! The "${dbName}" database has been completely wiped clean.`);
  } catch (error) {
    console.error("❌ An error occurred during database cleanup:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
    process.exit(0);
  }
}

clearDatabase();