import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms and conditions that govern your use of Kayease Themes and our licensed templates.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "18 July 2026";

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      lastUpdated={LAST_UPDATED}
      intro="By accessing or using Kayease Themes, you agree to these terms. Please read them carefully — they cover how you may use our themes and what you can expect from us."
    >
      <LegalSection heading="1. Acceptance of terms">
        <p>
          By browsing, purchasing, or downloading from Kayease Themes, you agree
          to be bound by these Terms of Service and our{" "}
          <Link href="/privacy-policy">Privacy Policy</Link>. If you do not
          agree, please do not use the site.
        </p>
      </LegalSection>

      <LegalSection heading="2. License to use themes">
        <p>
          When you purchase or download a theme, we grant you a non-exclusive,
          non-transferable licence to use it for a single end product. You may
          customise the theme for that product. You may not resell,
          redistribute, or sublicense the theme itself as-is or as part of a
          competing template product.
        </p>
      </LegalSection>

      <LegalSection heading="3. Payments and pricing">
        <p>
          Prices are listed in US dollars and may change at any time. Paid
          themes must be purchased before download. Free themes remain subject
          to the licence terms above.
        </p>
      </LegalSection>

      <LegalSection heading="4. Refunds">
        <p>
          Because themes are digital products delivered instantly, sales are
          generally final. If a theme is materially broken or not as described,
          contact us within 14 days of purchase and we&apos;ll work with you to
          fix the issue or provide a refund at our discretion.
        </p>
      </LegalSection>

      <LegalSection heading="5. Custom design work">
        <p>
          Custom-theme requests are scoped and agreed individually. Timelines,
          deliverables, and pricing for custom work are confirmed in writing
          before the project begins.
        </p>
      </LegalSection>

      <LegalSection heading="6. Intellectual property">
        <p>
          All themes, branding, and site content remain the intellectual
          property of Kayease unless otherwise stated. Your licence grants usage
          rights but does not transfer ownership.
        </p>
      </LegalSection>

      <LegalSection heading="7. Limitation of liability">
        <p>
          Our themes are provided &quot;as is&quot; without warranties of any
          kind. Kayease is not liable for any indirect or consequential damages
          arising from the use of our themes or website, to the maximum extent
          permitted by law.
        </p>
      </LegalSection>

      <LegalSection heading="8. Changes to these terms">
        <p>
          We may update these terms from time to time. Continued use of the site
          after changes take effect constitutes acceptance of the revised terms.
        </p>
      </LegalSection>

      <LegalSection heading="9. Contact us">
        <p>
          Questions about these terms? Reach out via our{" "}
          <Link href="/contact">contact page</Link> or email{" "}
          <a href="mailto:team@kayease.com">team@kayease.com</a>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
