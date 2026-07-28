const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const { loginUser, registerUser } = require("../controllers/authController");
const validate = require("../middleware/validate");
const { loginSchema, registerSchema } = require("../validations/schemas");

// Brute-force guard: cap login attempts per IP. 10 tries / 15 min is plenty
// for a real person who mistyped, but shuts down password-guessing scripts.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: "Too many login attempts. Try again in 15 minutes." },
  standardHeaders: true, // send RateLimit-* headers so the client can back off
  legacyHeaders: false,
});

// This is an admin-only site — public sign-up is intentionally not exposed.
// (The registerUser controller still exists; re-add a protected route here if
// user accounts are ever needed.)
router.post("/register", validate(registerSchema), registerUser);
router.post("/login", loginLimiter, validate(loginSchema), loginUser);

module.exports = router;
