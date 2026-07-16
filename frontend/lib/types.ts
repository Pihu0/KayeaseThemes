export type Theme = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  image: string;
  tags: string[];
  demoUrl: string;
  featured: boolean;
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
