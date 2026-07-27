# Kayease Themes

A full-stack marketplace for premium website themes. Visitors browse, search, and
filter a catalog of themes and view rich detail pages; an admin dashboard manages
the catalog, categories, and contact enquiries.

Built as a MERN application: **MongoDB + Express (REST API)** on the backend and
**Next.js (App Router) + React + Tailwind CSS** on the frontend.

## Tech stack

| Layer     | Tech |
|-----------|------|
| Frontend  | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Motion |
| Backend   | Node.js, Express 5, Mongoose 9 |
| Database  | MongoDB |
| Auth      | JWT (Bearer token), bcrypt password hashing, role-based access |
| Media     | Cloudinary (image uploads) |
| Analytics | Google Analytics 4 (optional) |

## Project structure

```
KayeaseThemes/
├── backend/          Express REST API
│   ├── config/       DB + Cloudinary setup
│   ├── controllers/  Route handlers (business logic)
│   ├── middleware/   Auth guards (protect, admin)
│   ├── models/       Mongoose schemas (Theme, Category, Contact, User)
│   ├── routes/       API route definitions
│   ├── utils/        JWT helper
│   ├── seed*.js      Catalog seed scripts
│   └── server.js     App entry point
└── frontend/         Next.js app
    ├── app/          Routes (public site + /admin dashboard)
    ├── components/   UI components
    ├── context/      Auth context
    └── lib/          API client, types, helpers
```

## Getting started

### Prerequisites
- Node.js 18+ and npm
- A MongoDB connection string (local or Atlas)
- A Cloudinary account (only needed for admin image uploads)

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster/kayease
PORT=5000
JWT_SECRET=<a long random string>
JWT_EXPIRE=7d

# Comma-separated list of allowed frontend origins (production).
# localhost:3000 is always allowed for local dev.
CLIENT_URL=https://kayease.com,https://www.kayease.com

# Used by `node createAdmin.js` to create/promote the admin account
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@kayease.com
ADMIN_PASSWORD=<meets the password rules below>

# Cloudinary (admin image uploads)
CLOUDINARY_CLOUD_NAME=<cloud name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
```

> Password rule: min 8 chars incl. a number, an uppercase, a lowercase, and a
> special character (enforced by the `User` model and the frontend meter).

Run it:

```bash
npm run dev        # nodemon (development)
npm start          # node (production)

# One-time setup helpers:
node createAdmin.js      # create/promote the admin from .env credentials
node seed.js             # seed sample themes + categories
node seedRealThemes.js   # seed the real theme catalog
```

The API runs at `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000     # used for canonical URLs, sitemap, robots
NEXT_PUBLIC_GA_ID=                              # optional GA4 measurement ID
```

Run it:

```bash
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run lint       # eslint
```

## API overview

Base URL: `${NEXT_PUBLIC_API_URL}` (e.g. `/api`). Admin routes require a
`Authorization: Bearer <token>` header for an admin user.

| Method | Route | Access | Purpose |
|--------|-------|--------|---------|
| POST   | `/auth/login` | public (rate-limited) | Admin login → JWT |
| GET    | `/themes` | public | List/search/filter/sort/paginate themes |
| GET    | `/themes/slug/:slug` | public | Theme by slug (`?track=1` counts a view) |
| POST   | `/themes` | admin | Create theme |
| PUT/DELETE | `/themes/:id` | admin | Update / delete theme |
| GET    | `/categories` | public | List categories |
| POST/PUT/DELETE | `/categories(/:id)` | admin | Manage categories |
| POST   | `/contacts` | public | Submit a contact enquiry |
| GET    | `/contacts` | admin | List enquiries |
| DELETE | `/contacts/:id` | admin | Delete an enquiry |
| POST   | `/upload` | admin | Upload an image to Cloudinary |

## Admin

Visit `/login`, sign in with the admin credentials created by `createAdmin.js`,
then manage the catalog at `/admin`. The entire `/admin` section is guarded both
client-side (redirect to login) and server-side (JWT + admin role on every write).
