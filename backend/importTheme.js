require("dotenv").config();
const mongoose = require("mongoose");
const Theme = require("./models/Theme");
const Category = require("./models/Category");

/**
 * Import a real theme from the live Kayease catalog into this project's DB.
 *
 *   node importTheme.js <id | slug | admin-edit-URL>
 *
 * It fetches the theme from the public production API, maps the production
 * schema onto our local Theme model, ensures the category exists, and upserts
 * by slug (never deletes). Re-running updates the record in place.
 *
 * Examples:
 *   node importTheme.js 695b8830ecc59852290519b7
 *   node importTheme.js freshcart-grocery-supermarket-store-react-template
 *   node importTheme.js https://kayease.com/admin/themes/edit/695b8830ecc59852290519b7
 */

const SOURCE_API = "https://api.kayease.com/api/themes";

// Production stores lowercase / free-form values; normalize the ones our
// frontend filters and category pages expect to a canonical display form.
const FRAMEWORK_MAP = {
  react: "React",
  nextjs: "Next.js",
  next: "Next.js",
  vue: "Vue",
  angular: "Angular",
  svelte: "Svelte",
  shopify: "Shopify",
  wordpress: "WordPress",
  html: "HTML/CSS",
  "html/css": "HTML/CSS",
};
const CATEGORY_MAP = {
  ecommerce: "E-Commerce",
  "e-commerce": "E-Commerce",
  portfolio: "Portfolio",
  business: "Business",
  blog: "Blog",
  "landing-page": "Landing Page",
  "landing page": "Landing Page",
  "real-estate": "Real-estate",
  realestate: "Real-estate",
  saas: "SaaS",
};

const titleCase = (s) =>
  s.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const normFramework = (f = "") =>
  FRAMEWORK_MAP[f.trim().toLowerCase()] || titleCase(f);
const normCategory = (c = "") =>
  CATEGORY_MAP[c.trim().toLowerCase()] || titleCase(c);

// Accept a raw id, a slug, or any URL that ends in one of those.
function parseArg(arg) {
  if (!arg) return null;
  const cleaned = arg.trim().replace(/\/+$/, "");
  return cleaned.split("/").pop();
}

// Fetch the entire published catalog (paginating within the API's limit).
async function fetchAllSourceThemes() {
  const all = [];
  let page = 1;
  const limit = 50;
  for (;;) {
    const res = await fetch(`${SOURCE_API}?limit=${limit}&page=${page}`);
    if (!res.ok) throw new Error(`Source API returned HTTP ${res.status}`);
    const body = await res.json();
    const list = body.data || [];
    all.push(...list);

    const totalPages = body.pagination?.totalPages || body.pagination?.pages;
    if (!list.length || (totalPages && page >= totalPages)) break;
    page += 1;
  }
  return all;
}

// Find a single theme by id or slug within the catalog, returning it along
// with its position (so we can preserve the catalog sequence on import).
async function fetchSourceTheme(key) {
  const all = await fetchAllSourceThemes();
  const index = all.findIndex((t) => t._id === key || t.slug === key);
  return index === -1 ? null : { src: all[index], index };
}

async function upsertMapped(mapped) {
  await ensureCategory(mapped.category);
  // timestamps:false so Mongoose keeps our source updatedAt.
  await Theme.updateOne(
    { slug: mapped.slug },
    { $set: mapped },
    { upsert: true, timestamps: false }
  );
  // Mongoose forces createdAt on upsert regardless of our value, so write it
  // through the raw driver (which skips Mongoose's timestamp handling).
  if (mapped.createdAt) {
    await Theme.collection.updateOne(
      { slug: mapped.slug },
      { $set: { createdAt: mapped.createdAt } }
    );
  }
}

// Map the production theme document onto our local Theme schema.
function mapTheme(src) {
  // Treat a $0 theme as free even if the source only set isFree via price.
  const isFree = src.isFree || (src.price ?? 0) === 0;
  const pricingType = isFree ? "free" : "premium";
  return {
    title: src.name,
    slug: src.slug,
    shortDescription: src.shortDescription || "",
    description: src.description || "",

    price: isFree ? 0 : src.price ?? 0,
    originalPrice: src.originalPrice ?? 0,
    pricingType,

    image: src.coverImage?.url || "",
    screenshots: (src.previewImages || []).map((p) => p.url).filter(Boolean),

    framework: normFramework(src.framework),
    version: src.version || "1.0.0",
    demoUrl: src.demoUrl || "",
    downloadUrl: src.downloadUrl || "",
    keyFeatures: src.features || [],
    technologies: src.technologies || [],
    browserSupport: src.browserSupport || [],
    fileFormat: (src.fileFormat || "ZIP").toUpperCase(),
    fileSize: src.fileSize || "",

    authorName: src.author?.name || "",
    authorEmail: src.author?.email || "",
    supportUrl: src.supportUrl || "",
    documentationUrl: src.documentationUrl || "",

    metaTitle: src.metaTitle || "",
    metaDescription: src.metaDescription || "",
    keywords: src.keywords || [],

    category: normCategory(src.category),
    tags: src.tags || [],

    status: src.status === "draft" ? "draft" : "published",
    visible: src.isActive !== false,
    featured: !!src.isFeatured,

    downloads: src.downloads || 0,
    views: src.views || 0,

    ...(src.updatedAt ? { updatedAt: new Date(src.updatedAt) } : {}),
  };
}

// The site sorts "newest first" (createdAt desc). The source catalog's own
// createdAt field does NOT match its display order, so instead we synthesize a
// createdAt from each theme's POSITION in the catalog list, anchored to a fixed
// date. Position 0 (top of kayease.com) gets the newest stamp → shows first.
// Anchored (not Date.now) so the sequence is identical on every re-run and for
// single imports.
const ORDER_ANCHOR = new Date("2030-01-01T00:00:00.000Z").getTime();
const orderedCreatedAt = (index) =>
  new Date(ORDER_ANCHOR - index * 60000);

async function ensureCategory(name) {
  const existing = await Category.findOne({ name });
  if (existing) return;
  const cat = new Category({ name }); // .save() triggers the slug hook
  await cat.save();
  console.log(`  + created category "${name}"`);
}

async function runOne(key) {
  console.log(`Fetching "${key}" from ${SOURCE_API} ...`);
  const found = await fetchSourceTheme(key);
  if (!found) {
    console.error("  ✗ No theme with that id/slug in the source catalog.");
    process.exitCode = 1;
    return;
  }
  const mapped = mapTheme(found.src);
  mapped.createdAt = orderedCreatedAt(found.index);
  await upsertMapped(mapped);
  console.log(`  ✓ imported "${mapped.title}"`);
  console.log(
    `    category=${mapped.category}  price=${mapped.price} (${mapped.pricingType})` +
      `  featured=${mapped.featured}  images=${1 + mapped.screenshots.length}`
  );
}

async function runAll() {
  console.log(`Fetching the full catalog from ${SOURCE_API} ...`);
  const list = await fetchAllSourceThemes();
  console.log(`Found ${list.length} published themes. Importing...\n`);
  let ok = 0;
  for (let i = 0; i < list.length; i++) {
    const src = list[i];
    try {
      const mapped = mapTheme(src);
      mapped.createdAt = orderedCreatedAt(i);
      await upsertMapped(mapped);
      ok += 1;
      console.log(
        `  ✓ ${mapped.title}  [${mapped.category}]  $${mapped.price}` +
          `  ${mapped.featured ? "★" : " "}  ${1 + mapped.screenshots.length} imgs`
      );
    } catch (e) {
      console.error(`  ✗ ${src.name || src.slug}: ${e.message}`);
    }
  }
  console.log(`\nDone. ${ok}/${list.length} themes imported/updated.`);
}

(async () => {
  const arg = process.argv[2];
  const wantsAll = arg === "--all" || arg === "all";
  const key = wantsAll ? null : parseArg(arg);

  if (!wantsAll && !key) {
    console.error(
      "Usage:\n  node importTheme.js <id | slug | admin-edit-URL>\n  node importTheme.js --all"
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    if (wantsAll) await runAll();
    else await runOne(key);
  } catch (err) {
    console.error("Import failed:", err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
