/* CUSTOM DESIGN FORM — field definitions and payload builder.
   The backend Contact model stores four fields:
     name · email · subject · message
   Everything the richer UI collects is folded back into a readable
   subject + message here — no new API surface needed. */

export const BUILD_TYPES = [
  "Website",
  "E-commerce",
  "Landing page",
  "Portfolio",
  "Blog",
  "Something else",
];

export const BUDGETS = [
  "Under $500",
  "$500 – $1,000",
  "$1,000 – $5,000",
  "$5,000+",
  "Not sure yet",
];

export const TIMELINES = [
  "As soon as possible",
  "This month",
  "1–3 months",
  "Just exploring",
];

export type CustomDesignFields = {
  fullName: string;
  email: string;
  company: string;
  buildType: string;
  budget: string;
  timeline: string;
  message: string;
};

export const EMPTY_FIELDS: CustomDesignFields = {
  fullName: "",
  email: "",
  company: "",
  buildType: "",
  budget: "",
  timeline: "",
  message: "",
};

/** Backend regex — kept in sync with Contact.js so client + server agree. */
export const EMAIL_RE = /^\S+@\S+\.\S+$/;

/**
 * Fold the rich form into the four fields the API actually stores.
 * The subject stays human-readable in the admin inbox; the structured
 * details are prepended to the message so nothing the visitor chose is lost.
 */
export function buildContactPayload(f: CustomDesignFields) {
  const name = f.fullName.trim();

  let subject = "Custom design request";
  if (f.buildType) subject += ` — ${f.buildType}`;

  const details: string[] = [];
  if (f.buildType) details.push(`Building: ${f.buildType}`);
  if (f.budget) details.push(`Budget: ${f.budget}`);
  if (f.timeline) details.push(`Timeline: ${f.timeline}`);
  if (f.company) details.push(`Brand: ${f.company}`);

  const message = details.length
    ? `${details.join("\n")}\n\n${f.message}`
    : f.message;

  return { name, email: f.email.trim(), subject, message };
}
