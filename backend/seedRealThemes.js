require("dotenv").config();
const mongoose = require("mongoose");
const Theme = require("./models/Theme");
const Category = require("./models/Category");

/**
 * Non-destructive seeder for the REAL catalog themes.
 *
 * Unlike seed.js (which wipes everything and inserts demo data), this script:
 *   - never deletes anything
 *   - ensures each theme's category exists (creating it via .save() so the
 *     slug hook runs)
 *   - upserts each theme by slug, so re-running it updates in place instead
 *     of creating duplicates
 *
 * Add new real themes to the `realThemes` array below and re-run:
 *   node seedRealThemes.js
 */

// Dummy placeholder art until real screenshots are uploaded.
const dummy = (seed) => `https://picsum.photos/seed/${seed}/1200/750`;

const realThemes = [
  {
    // --- General ---
    title: "Estatin",
    slug: "estatin-real-estate-property-listing-nextjs-template",
    shortDescription:
      "Estatin — Find Your Dream Property\nEstatin is a real estate platform that helps users search and explore premium properties.",
    description:
      "Estatin is a modern real estate discovery platform helping users explore residential and commercial properties with ease. It offers curated listings, clear details, and intuitive navigation so buyers and investors can compare options, connect with experts, and confidently find homes or profitable opportunities that match their goals today worldwide online.",

    // --- Pricing ---
    price: 75,
    originalPrice: 0,
    pricingType: "premium",

    // --- Media (dummy for now) ---
    image: dummy("estatin"),
    screenshots: [
      dummy("estatin-1"),
      dummy("estatin-2"),
      dummy("estatin-3"),
      dummy("estatin-4"),
    ],

    // --- Technical specs ---
    framework: "React",
    version: "1.0.0",
    demoUrl: "https://estate.kayease.com/",
    downloadUrl: "",
    keyFeatures: [
      "Responsive",
      "Modern",
      "Clean",
      "Fast",
      "Scalable",
      "Customizable",
      "Lightweight",
      "Flexible",
      "Optimized",
      "Maintainable",
    ],
    technologies: ["HTML", "CSS", "JavaScript", "React"],
    browserSupport: ["Chrome", "Edge", "Firefox", "Safari"],
    fileFormat: "ZIP",
    fileSize: "109 MB",

    // --- Author & support ---
    authorName: "Kayease Global",
    authorEmail: "bdm@kayease.com",
    supportUrl: "https://kayease.com/support",
    documentationUrl: "",

    // --- SEO ---
    metaTitle: "Estatin – Real Estate & Property Listing Template",
    metaDescription:
      "Estatin is a modern real estate and property listing template built with Next.js — showcase properties, agents and listings with advanced search and a clean responsive UI.",
    keywords: [
      "real estate theme",
      "property listing ui",
      "real estate frontend",
      "property website template",
      "realtor website",
      "property website",
      "real estate nextjs",
      "agent listing",
      "property search",
      "housing template",
    ],

    // --- Organization ---
    category: "Real-estate",
    tags: [
      "real-estate",
      "property",
      "housing",
      "listing",
      "marketplace",
      "ui-theme",
      "frontend",
      "html",
      "css",
      "javascript",
    ],

    // --- Publishing ---
    status: "published",
    visible: true,
    featured: true,
  },
];

// Categories referenced by the themes above, so the /categories page and
// category filter have matching entries. Descriptions are best-effort.
const categoryMeta = {
  "Real-estate": "Property, listing, and real estate marketplace themes.",
};

async function ensureCategory(name) {
  const existing = await Category.findOne({ name });
  if (existing) return existing;
  const cat = new Category({ name, description: categoryMeta[name] || "" });
  await cat.save(); // .save() triggers the slug-generation hook
  console.log(`  + created category "${name}"`);
  return cat;
}

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected. Seeding real themes (non-destructive)...");

    // Make sure every referenced category exists first.
    const names = [...new Set(realThemes.map((t) => t.category))];
    for (const name of names) await ensureCategory(name);

    // Upsert each theme by slug.
    for (const theme of realThemes) {
      await Theme.updateOne(
        { slug: theme.slug },
        { $set: theme },
        { upsert: true }
      );
      console.log(`  ✓ upserted theme "${theme.title}"`);
    }

    console.log(`Done. ${realThemes.length} theme(s) processed.`);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
