# Kayease Themes — Frontend

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 frontend for the
Kayease Themes marketplace. It renders the public catalog (browse, search, filter,
theme detail pages with SEO metadata + JSON-LD) and the admin dashboard.

See the [root README](../README.md) for full setup, the API reference, and
environment variables.

## Quick start

```bash
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=            # optional GA4 measurement ID
```

```bash
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run lint       # eslint
```

The backend API (see `../backend`) must be running for data to load.

## Layout

- `app/` — routes. Public site (`/`, `/themes`, `/themes/[slug]`, `/customdesign`,
  legal pages) plus the `/admin` dashboard and `/login`.
- `components/` — UI. `admin/` (dashboard shell + forms), `archive/` (catalog),
  `home/` (landing sections), `contact/`, and `ui/` primitives.
- `context/AuthContext.tsx` — JWT auth state.
- `lib/` — `api.ts` (fetch wrapper), `types.ts`, `upload.ts`, helpers.

SEO is handled via the Metadata API (`generateMetadata` per theme), a dynamic
`sitemap.ts`, `robots.ts`, and Product JSON-LD on theme detail pages.
