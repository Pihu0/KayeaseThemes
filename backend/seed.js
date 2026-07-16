require("dotenv").config();
const mongoose = require("mongoose");
const Theme = require("./models/Theme");
const Category = require("./models/Category");

const categories = [
  { name: "Portfolio", description: "Showcase your work in style." },
  { name: "Business", description: "Corporate and agency templates." },
  { name: "E-Commerce", description: "Online store and shop themes." },
  { name: "Blog", description: "Clean, readable blog layouts." },
  { name: "Landing Page", description: "High-converting single pages." },
];

const themes = [
  { title: "Aurora Portfolio", slug: "aurora-portfolio", category: "Portfolio", price: 39, description: "A sleek, minimal portfolio to showcase creative work with smooth animations.", tags: ["minimal", "creative", "dark"], featured: true },
  { title: "Nimbus Business", slug: "nimbus-business", category: "Business", price: 59, description: "A professional corporate theme with service sections and team pages.", tags: ["corporate", "clean"], featured: true },
  { title: "Vertex Store", slug: "vertex-store", category: "E-Commerce", price: 79, description: "A modern e-commerce theme with product grids and a fast checkout flow.", tags: ["shop", "modern"], featured: true },
  { title: "Quill Blog", slug: "quill-blog", category: "Blog", price: 29, description: "A typography-focused blog theme built for comfortable reading.", tags: ["blog", "typography"] },
  { title: "Launchpad", slug: "launchpad", category: "Landing Page", price: 25, description: "A high-converting SaaS landing page with pricing and feature sections.", tags: ["saas", "landing"] },
  { title: "Studio Folio", slug: "studio-folio", category: "Portfolio", price: 45, description: "A bold portfolio for design studios and agencies.", tags: ["agency", "bold"] },
  { title: "Ledger Corporate", slug: "ledger-corporate", category: "Business", price: 65, description: "A finance and consulting theme with a trustworthy, polished look.", tags: ["finance", "corporate"] },
  { title: "Market Cart", slug: "market-cart", category: "E-Commerce", price: 89, description: "A feature-rich marketplace theme with filters and wishlists.", tags: ["marketplace", "shop"] },
  { title: "Inkwell", slug: "inkwell", category: "Blog", price: 32, description: "A magazine-style blog with featured stories and categories.", tags: ["magazine", "editorial"] },
];

// Deterministic preview image per theme (Cloudinary will replace these in real use)
const imageFor = (slug) => `https://picsum.photos/seed/${slug}/800/500`;

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected. Seeding...");

    await Theme.deleteMany({});
    await Category.deleteMany({});

    // create() (not insertMany) so the slug pre-save hook runs on each category
    for (const c of categories) {
      await Category.create(c);
    }

    await Theme.insertMany(
      themes.map((t) => ({ ...t, image: imageFor(t.slug) }))
    );

    console.log(
      `Seeded ${categories.length} categories and ${themes.length} themes.`
    );
  } catch (err) {
    console.error("Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
})();
