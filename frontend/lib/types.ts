export type Theme = {
  _id: string;
  // General
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  // Pricing
  price: number;
  originalPrice: number;
  pricingType: "free" | "premium";
  // Media
  image: string; // cover
  screenshots: string[];
  // Technical
  framework: string;
  version: string;
  demoUrl: string;
  downloadUrl: string;
  keyFeatures: string[];
  technologies: string[];
  browserSupport: string[];
  fileFormat: string;
  fileSize: string;
  // Author & support
  authorName: string;
  authorEmail: string;
  supportUrl: string;
  documentationUrl: string;
  // SEO
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  // Organization
  category: string;
  tags: string[];
  // Publishing
  status: "draft" | "published";
  visible: boolean;
  featured: boolean;
  priority?: number;
  // Stats
  downloads: number;
  views: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
};
