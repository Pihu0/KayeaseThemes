/* CONTACT INTENTS — the shape of "why are you here?"
   The redesigned /contact page asks for intent FIRST, then adapts the form.
   But the backend Contact model only persists four fields:
     name · email · subject · message
   (see backend/models/Contact.js). So everything the richer UI collects is
   folded back into a readable subject + message here — nothing is invented on
   the server and no new API surface is needed. This mirrors the strategy the
   original form already used; we just formalise it in one place. */

export type IntentId = "theme" | "support" | "custom" | "business" | "other";

export type Intent = {
  id: IntentId;
  /** Row headline in the intent selector. */
  title: string;
  /** One-line description under the headline. */
  summary: string;
  /** Contextual textarea placeholder once this intent is chosen. */
  messagePrompt: string;
  /** Show the searchable theme picker (and its label) for this intent. */
  themeLabel?: string;
  /** Custom-project intents surface build type + budget + timeline. */
  projectFields?: boolean;
};

export const INTENTS: Intent[] = [
  {
    id: "theme",
    title: "Theme enquiry",
    summary: "A question about a Kayease theme.",
    themeLabel: "Which theme?",
    messagePrompt: "Tell us what you'd like to know…",
  },
  {
    id: "support",
    title: "Technical support",
    summary: "Help with something you've purchased.",
    themeLabel: "Which theme or product?",
    messagePrompt: "Tell us what's happening and we'll take a look…",
  },
  {
    id: "custom",
    title: "Custom project",
    summary: "Something built around your brand.",
    projectFields: true,
    messagePrompt: "Tell us a little about what you'd like to build…",
  },
  {
    id: "business",
    title: "Business / partnership",
    summary: "An enquiry or collaboration.",
    messagePrompt: "Tell us what you have in mind…",
  },
  {
    id: "other",
    title: "Something else",
    summary: "Anything not covered above.",
    messagePrompt: "Tell us what's on your mind…",
  },
];

/* Selectors for the custom-project flow. These ranges already lived in the
   working form, so they reflect the real enquiry workflow rather than
   invented pricing tiers. Timelines are relative and non-committal. */
export const BUILD_TYPES = [
  "Website",
  "E-commerce",
  "Custom theme",
  "Landing page",
  "Redesign",
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

export type ContactFields = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  theme: string; // theme title chosen in the picker
  buildType: string;
  budget: string;
  timeline: string;
  message: string;
};

export const EMPTY_FIELDS: ContactFields = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  theme: "",
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
export function buildContactPayload(intent: Intent, f: ContactFields) {
  const name = [f.firstName, f.lastName].filter(Boolean).join(" ").trim();

  const subjectBase: Record<IntentId, string> = {
    theme: "Theme enquiry",
    support: "Support request",
    custom: "Custom project",
    business: "Business / partnership",
    other: "General enquiry",
  };
  let subject = subjectBase[intent.id];
  if (intent.themeLabel && f.theme) subject += ` — ${f.theme}`;
  else if (intent.projectFields && f.buildType) subject += ` — ${f.buildType}`;

  // Structured context lines, only for values the visitor actually provided.
  const details: string[] = [];
  if (intent.themeLabel && f.theme) details.push(`Theme: ${f.theme}`);
  if (intent.projectFields) {
    if (f.buildType) details.push(`Building: ${f.buildType}`);
    if (f.budget) details.push(`Budget: ${f.budget}`);
    if (f.timeline) details.push(`Timeline: ${f.timeline}`);
  }
  if (f.company) details.push(`Company: ${f.company}`);

  const message = details.length
    ? `${details.join("\n")}\n\n${f.message}`
    : f.message;

  return { name, email: f.email.trim(), subject, message };
}
