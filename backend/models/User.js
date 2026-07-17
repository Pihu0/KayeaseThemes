const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // never return the password in queries by default
      // Runs on the PLAINTEXT password (validation happens before the
      // pre-save hash hook). Keep these 5 rules in sync with the frontend
      // meter in frontend/components/ui/password-input.tsx.
      validate: {
        validator: (value) =>
          value.length >= 8 &&
          /[0-9]/.test(value) &&
          /[a-z]/.test(value) &&
          /[A-Z]/.test(value) &&
          /[!@#$%^&*(),.?":{}|<>]/.test(value),
        message:
          "Password must be at least 8 characters and include a number, an uppercase and a lowercase letter, and a special character",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"], // only these two values allowed
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// Runs automatically BEFORE a user is saved.
// Modern Mongoose resolves async hooks via the promise — no next() needed.
userSchema.pre("save", async function () {
  // Only hash if the password was changed (or is new)
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method: compare a plain password to the stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
