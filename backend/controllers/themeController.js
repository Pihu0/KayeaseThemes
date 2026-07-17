const Theme = require("../models/Theme");

// @desc   Create a new theme
// @route  POST /api/themes
const createTheme = async (req, res) => {
  try {
    const theme = await Theme.create(req.body);
    res.status(201).json(theme);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Get themes with search, category filter, sort, and pagination
// @route  GET /api/themes?search=&category=&sort=&page=&limit=
const getThemes = async (req, res) => {
  try {
    const {
      search,
      category,
      framework,
      pricing,
      sort,
      page = 1,
      limit = 9,
    } = req.query;

    // Build the MongoDB query object dynamically
    const query = {};
    if (search) {
      // Case-insensitive match on title, description, or tags
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }
    if (category) {
      query.category = category;
    }
    if (framework) {
      query.framework = framework;
    }
    if (pricing === "free" || pricing === "premium") {
      query.pricingType = pricing;
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // newest first (default)
    if (sort === "price-asc") sortOption = { price: 1 };
    else if (sort === "price-desc") sortOption = { price: -1 };

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 9);
    const skip = (pageNum - 1) * limitNum;

    // Run the query and the count in parallel for speed
    const [themes, total] = await Promise.all([
      Theme.find(query).sort(sortOption).skip(skip).limit(limitNum),
      Theme.countDocuments(query),
    ]);

    res.status(200).json({
      themes,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get a single theme by id
// @route  GET /api/themes/:id
const getThemeById = async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.id);
    if (!theme) {
      return res.status(404).json({ message: "Theme not found" });
    }
    res.status(200).json(theme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get a single theme by slug (for SEO-friendly URLs)
// @route  GET /api/themes/slug/:slug
const getThemeBySlug = async (req, res) => {
  try {
    const theme = await Theme.findOne({ slug: req.params.slug });
    if (!theme) {
      return res.status(404).json({ message: "Theme not found" });
    }
    res.status(200).json(theme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update a theme
// @route  PUT /api/themes/:id
const updateTheme = async (req, res) => {
  try {
    const theme = await Theme.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document, not the old one
      runValidators: true, // re-run schema validation on update
    });
    if (!theme) {
      return res.status(404).json({ message: "Theme not found" });
    }
    res.status(200).json(theme);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Delete a theme
// @route  DELETE /api/themes/:id
const deleteTheme = async (req, res) => {
  try {
    const theme = await Theme.findByIdAndDelete(req.params.id);
    if (!theme) {
      return res.status(404).json({ message: "Theme not found" });
    }
    res.status(200).json({ message: "Theme deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTheme,
  getThemes,
  getThemeById,
  getThemeBySlug,
  updateTheme,
  deleteTheme,
};
