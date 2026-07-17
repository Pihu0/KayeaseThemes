const mongoose = require("mongoose");

const themeSchema = new mongoose.Schema(
  {
    // --- General ---
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    shortDescription: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },

    // --- Pricing ---
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      default: 0,
      min: [0, "Price cannot be negative"],
    },
    pricingType: {
      type: String,
      enum: ["free", "premium"],
      default: "premium",
    },

    // --- Media ---
    image: {
      type: String, // cover image
      default: "",
    },
    screenshots: {
      type: [String],
      default: [],
    },

    // --- Technical specs ---
    framework: {
      type: String,
      default: "",
    },
    version: {
      type: String,
      default: "1.0.0",
    },
    demoUrl: {
      type: String,
      default: "",
    },
    downloadUrl: {
      type: String,
      default: "",
    },
    keyFeatures: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
    browserSupport: {
      type: [String],
      default: [],
    },
    fileFormat: {
      type: String,
      default: "ZIP",
    },
    fileSize: {
      type: String,
      default: "",
    },

    // --- Author & support ---
    authorName: {
      type: String,
      default: "",
    },
    authorEmail: {
      type: String,
      default: "",
    },
    supportUrl: {
      type: String,
      default: "",
    },
    documentationUrl: {
      type: String,
      default: "",
    },

    // --- SEO ---
    metaTitle: {
      type: String,
      default: "",
    },
    metaDescription: {
      type: String,
      default: "",
    },
    keywords: {
      type: [String],
      default: [],
    },

    // --- Organization ---
    category: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },

    // --- Publishing ---
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    visible: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },

    // --- Stats (for showcase) ---
    downloads: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Theme", themeSchema);
