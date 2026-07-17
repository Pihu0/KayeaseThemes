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

const base = [
  { title: "Aurora Portfolio", slug: "aurora-portfolio", category: "Portfolio", price: 39, originalPrice: 59, framework: "Next.js", tags: ["minimal", "creative", "dark"], featured: true, shortDescription: "A sleek, minimal portfolio with buttery-smooth animations." },
  { title: "Nimbus Business", slug: "nimbus-business", category: "Business", price: 59, framework: "React", tags: ["corporate", "clean"], featured: true, shortDescription: "A professional corporate theme for agencies and startups." },
  { title: "Vertex Store", slug: "vertex-store", category: "E-Commerce", price: 79, originalPrice: 99, framework: "Shopify", tags: ["shop", "modern"], featured: true, shortDescription: "A modern e-commerce theme with a lightning-fast checkout." },
  { title: "Quill Blog", slug: "quill-blog", category: "Blog", price: 29, framework: "Next.js", tags: ["blog", "typography"], shortDescription: "A typography-focused blog built for comfortable reading." },
  { title: "Launchpad", slug: "launchpad", category: "Landing Page", price: 0, framework: "HTML/CSS", tags: ["saas", "landing"], shortDescription: "A free, high-converting SaaS landing page." },
  { title: "Studio Folio", slug: "studio-folio", category: "Portfolio", price: 45, framework: "Vue", tags: ["agency", "bold"], shortDescription: "A bold portfolio for design studios and agencies." },
  { title: "Ledger Corporate", slug: "ledger-corporate", category: "Business", price: 65, originalPrice: 85, framework: "React", tags: ["finance", "corporate"], shortDescription: "A trustworthy finance and consulting theme." },
  { title: "Market Cart", slug: "market-cart", category: "E-Commerce", price: 89, framework: "Next.js", tags: ["marketplace", "shop"], shortDescription: "A feature-rich marketplace theme with filters and wishlists." },
  { title: "Inkwell", slug: "inkwell", category: "Blog", price: 32, framework: "WordPress", tags: ["magazine", "editorial"], shortDescription: "A magazine-style blog with featured stories." },
];

const img = (seed) => `https://picsum.photos/seed/${seed}/1200/750`;

const themes = base.map((t) => ({
  ...t,
  image: img(t.slug),
  screenshots: [img(`${t.slug}-a`), img(`${t.slug}-b`), img(`${t.slug}-c`)],
  pricingType: t.price === 0 ? "free" : "premium",
  version: "1.2.0",
  demoUrl: "https://example.com/demo",
  description:
    `${t.title} is a production-ready theme crafted for real projects. ` +
    `It combines a refined visual design with clean, maintainable code.\n\n` +
    `Built with performance and accessibility in mind, it delivers fast load times, ` +
    `responsive layouts across all devices, and an SEO-friendly structure out of the box.`,
  keyFeatures: [
    "Fully responsive design",
    "Dark mode support",
    "SEO optimized",
    "Fast performance",
    "Clean, documented code",
    "Regular updates",
  ],
  technologies:
    t.framework === "Shopify"
      ? ["Liquid", "Tailwind CSS"]
      : t.framework === "WordPress"
        ? ["PHP", "SCSS"]
        : ["React", "Tailwind CSS", "TypeScript"],
  browserSupport: ["Chrome", "Firefox", "Safari", "Edge"],
  fileFormat: "ZIP",
  fileSize: "12MB",
  authorName: "Kayease Global",
  authorEmail: "team@kayease.com",
  supportUrl: "https://kayease.com/support",
  metaTitle: `${t.title} — Premium ${t.category} Theme`,
  metaDescription: t.shortDescription,
  keywords: t.tags,
  status: "published",
  visible: true,
  rating: 4.7,
  downloads: Math.floor(1000 - t.price * 5),
}));

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected. Seeding...");

    await Theme.deleteMany({});
    await Category.deleteMany({});

    for (const c of categories) await Category.create(c);
    await Theme.insertMany(themes);

    console.log(
      `Seeded ${categories.length} categories and ${themes.length} themes.`
    );
  } catch (err) {
    console.error("Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
})();
