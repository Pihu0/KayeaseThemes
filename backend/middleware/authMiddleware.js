const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Gatekeeper 1: must be logged in (valid token)
const protect = async (req, res, next) => {
  try {
    let token;

    // Expect header:  Authorization: Bearer <token>
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify the signature and decode the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user (without password) to the request for later use
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    next(); // token is valid — proceed to the controller
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Gatekeeper 2: must be an admin (run AFTER protect)
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as admin" });
  }
};

module.exports = { protect, admin };
