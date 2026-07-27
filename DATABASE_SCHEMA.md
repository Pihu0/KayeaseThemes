# Database Schema

**Database:** MongoDB · **ODM:** Mongoose 9

The application uses four collections: `users`, `themes`, `categories`, and
`contacts`. All collections carry Mongoose `timestamps` (`createdAt`,
`updatedAt`). Field-level validation is enforced in the schema so invalid data
is rejected at the database layer, not just the UI.

---

## `users`

Stores admin accounts. Public sign-up is intentionally disabled — accounts are
provisioned via `node createAdmin.js`.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `name` | String | required, trimmed | |
| `email` | String | required, **unique**, lowercase, trimmed | Login identifier |
| `password` | String | required, `select: false` | Bcrypt hash; never returned by default |
| `role` | String | enum `["user","admin"]`, default `"user"` | Route authorization |
| `createdAt` / `updatedAt` | Date | auto | |

**Security behavior**
- Password is validated on the **plaintext** (min 8 chars, incl. number, upper,
  lower, and special character) before a `pre('save')` hook bcrypt-hashes it
  (salt rounds = 10).
- `matchPassword(plain)` instance method compares a candidate against the hash.
- `select: false` keeps the hash out of every query unless explicitly requested
  with `.select("+password")` (used only during login).

**Indexes:** unique index on `email`.

---

## `themes`

The core catalog document. Grouped by concern:

**General**
| Field | Type | Constraints |
|-------|------|-------------|
| `title` | String | required, trimmed |
| `slug` | String | required, **unique**, lowercase |
| `shortDescription` | String | default `""` |
| `description` | String | required |

**Pricing**
| Field | Type | Constraints |
|-------|------|-------------|
| `price` | Number | required, min 0 |
| `originalPrice` | Number | default 0, min 0 (for sale display) |
| `pricingType` | String | enum `["free","premium"]`, default `"premium"` |

**Media**
| Field | Type | Notes |
|-------|------|-------|
| `image` | String | Cover image URL (Cloudinary) |
| `screenshots` | [String] | Gallery image URLs |

**Technical specs**
| Field | Type |
|-------|------|
| `framework`, `version`, `demoUrl`, `downloadUrl`, `fileFormat`, `fileSize` | String |
| `keyFeatures`, `technologies`, `browserSupport` | [String] |

**Author & support:** `authorName`, `authorEmail`, `supportUrl`, `documentationUrl` (String)

**SEO:** `metaTitle`, `metaDescription` (String), `keywords` ([String])

**Organization**
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `category` | String | required | Denormalized category name (see below) |
| `tags` | [String] | | Used by search |

**Publishing**
| Field | Type | Constraints |
|-------|------|-------------|
| `status` | String | enum `["draft","published"]`, default `"published"` |
| `visible` | Boolean | default `true` |
| `featured` | Boolean | default `false` |

**Stats (showcase / popularity)**
| Field | Type | Notes |
|-------|------|-------|
| `views` | Number | Incremented on each theme-detail render (`?track=1`) |
| `downloads` | Number | Seeded popularity metric; drives the "popular" sort |
| `rating` | Number | 0–5 |

**Indexes:** unique index on `slug` (drives SEO-friendly URLs and the
`GET /themes/slug/:slug` lookup).

---

## `categories`

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `name` | String | required, **unique**, trimmed | |
| `slug` | String | **unique**, lowercase | Auto-generated from `name` in a `pre('save')` hook |
| `description` | String | default `""` | |
| `image` | String | default `""` | |
| `createdAt` / `updatedAt` | Date | auto | |

**Indexes:** unique indexes on `name` and `slug`.

---

## `contacts`

Contact-form submissions from the public site.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `name` | String | required, trimmed | |
| `email` | String | required, lowercase, trimmed, regex-validated | |
| `subject` | String | default `""`, trimmed | |
| `message` | String | required | |
| `isRead` | Boolean | default `false` | Admin read/unread state |
| `createdAt` / `updatedAt` | Date | auto | Sorted newest-first in admin |

---

## Relationships & design notes

- **Theme → Category** is a **denormalized string reference**: `Theme.category`
  stores the category *name* rather than a Mongoose `ObjectId` ref. This keeps
  reads single-collection (no `populate` needed for listing/filtering) and
  matches how the catalog is queried (filter by category name). The trade-off is
  that renaming a category is not automatically cascaded — an acceptable
  simplification for a read-heavy catalog of this size.
- **Uniqueness** is enforced at the DB layer on the fields users navigate by
  (`slug`, `email`, category `name`) to prevent duplicates and broken URLs.
- **Slugs** for themes and categories are lowercase and URL-safe; category slugs
  are generated automatically from the name.
- **Validation lives in the schema** (required fields, enums, min values, email
  regex, password strength) so the API rejects bad data even if a client
  bypasses the UI. Update routes run with `runValidators: true`.
