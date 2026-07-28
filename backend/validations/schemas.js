const { z } = require("zod");

// Auth Schemas
const registerSchema = {
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Password must contain a number")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain a special character"),
  }),
};

const loginSchema = {
  body: z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(1, "Password is required"),
  }),
};

// Theme Schemas
const themeSchema = {
  body: z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().min(1, "Description is required"),
    shortDescription: z.string().optional(),
    price: z.number().min(0, "Price cannot be negative"),
    originalPrice: z.number().min(0).optional(),
    pricingType: z.enum(["free", "premium"]).optional(),
    image: z.string().optional(),
    screenshots: z.array(z.string()).optional(),
    framework: z.string().optional(),
    version: z.string().optional(),
    demoUrl: z.string().optional(),
    downloadUrl: z.string().optional(),
    keyFeatures: z.array(z.string()).optional(),
    technologies: z.array(z.string()).optional(),
    browserSupport: z.array(z.string()).optional(),
    fileFormat: z.string().optional(),
    fileSize: z.string().optional(),
    authorName: z.string().optional(),
    authorEmail: z.string().optional(),
    supportUrl: z.string().optional(),
    documentationUrl: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    category: z.string().min(1, "Category is required"),
    tags: z.array(z.string()).optional(),
    status: z.enum(["draft", "published"]).optional(),
    visible: z.boolean().optional(),
    featured: z.boolean().optional(),
    priority: z.number().optional(),
  }),
};

// Category Schemas
const categorySchema = {
  body: z.object({
    name: z.string().min(1, "Category name is required"),
    description: z.string().optional(),
    image: z.string().optional(),
  }),
};

// Contact Schemas
const createContactSchema = {
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email"),
    subject: z.string().optional(),
    message: z.string().min(1, "Message is required"),
  }),
};

const updateContactSchema = {
  body: z.object({
    isRead: z.boolean(),
  }),
};

module.exports = {
  registerSchema,
  loginSchema,
  themeSchema,
  categorySchema,
  createContactSchema,
  updateContactSchema,
};
