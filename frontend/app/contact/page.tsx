import { apiFetch } from "@/lib/api";
import ContactExperience from "@/components/contact/ContactExperience";
import type { Theme } from "@/lib/types";

type ThemesResponse = {
  themes: Theme[];
  page: number;
  pages: number;
  total: number;
};

/* The contact page tailors itself to intent, and the theme-enquiry / support
   flows let visitors pick a real theme by name. So — like /categories — it
   fetches the live catalogue once on the server and hands it to the client
   experience. Failure is non-fatal: the picker simply shows no results. */
export default async function ContactPage() {
  let themes: Theme[] = [];
  try {
    const data: ThemesResponse = await apiFetch("/themes?limit=200");
    themes = data.themes ?? [];
  } catch {
    // leave empty — the designed empty state renders
  }

  return (
    <main>
      <ContactExperience themes={themes} />
    </main>
  );
}
