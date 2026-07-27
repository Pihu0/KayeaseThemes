require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

// Creates (or promotes) the single admin account from .env credentials.
// Safe to run repeatedly — it never creates duplicates.
//
//   node createAdmin.js
//
// Requires in .env:
//   ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD
// (password must satisfy the same rules as the User model validator)

(async () => {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error(
      "Missing ADMIN_NAME, ADMIN_EMAIL or ADMIN_PASSWORD in .env — nothing to do."
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({ email: ADMIN_EMAIL });

    if (existing) {
      // Already there — just make sure it has admin rights.
      existing.role = "admin";
      await existing.save();
      console.log(`Existing user "${ADMIN_EMAIL}" promoted to admin.`);
    } else {
      // password auto-hashes via the pre-save hook on the User model
      await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: "admin",
      });
      console.log(`Admin "${ADMIN_EMAIL}" created.`);
    }
  } catch (err) {
    console.error("Failed to create admin:", err.message);
  } finally {
    await mongoose.disconnect();
  }
})();
