// seed-allowed-users.js (CommonJS)
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" }); // Explicitly load .env.local

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not set. Please check your .env file.");
  process.exit(1);
}

// Replace with emails you want to allow
const allowedEmails = ["lwj17071977@gmail.com", "jhilwj67@gmail.com.com"];

async function seedAllowedUsers() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db();

    const collection = db.collection("allowedUsers");

    const existing = await collection
      .find({ email: { $in: allowedEmails } })
      .toArray();
    const existingEmails = existing.map((user) => user.email);

    const newEmails = allowedEmails
      .filter((email) => !existingEmails.includes(email))
      .map((email) => ({ email }));

    if (newEmails.length === 0) {
      console.log("✅ All emails already seeded.");
    } else {
      await collection.insertMany(newEmails);
      console.log(`✅ Inserted ${newEmails.length} new allowed user(s).`);
    }
  } catch (err) {
    console.error("❌ Error seeding allowed users:", err);
  } finally {
    await client.close();
  }
}

seedAllowedUsers();
