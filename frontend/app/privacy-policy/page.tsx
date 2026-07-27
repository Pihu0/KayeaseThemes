import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Kayease Themes collects, uses, and protects your personal information.",
  alternates: { canonical: "/privacy-policy" },
};

const LAST_UPDATED = "18 July 2026";

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated={LAST_UPDATED}
      intro="Your privacy matters to us. This policy explains what information we collect when you use Kayease Themes, why we collect it, and how we keep it safe."
    >
      <LegalSection heading="1. Information we collect">
        <p>
          We collect information you provide directly to us — such as your name
          and email address when you create an account, purchase a theme, or
          submit a custom-design request through our contact form. We also
          collect limited technical data (like your browser type and pages
          visited) to help us improve the site.
        </p>
      </LegalSection>

      <LegalSection heading="2. How we use your information">
        <p>We use the information we collect to:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Provide, maintain, and improve our themes and services.</li>
          <li>Respond to your enquiries and custom-design requests.</li>
          <li>Send important account, purchase, and support communications.</li>
          <li>Detect, prevent, and address technical or security issues.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. Cookies and analytics">
        <p>
          We use essential cookies to keep you signed in and privacy-friendly
          analytics to understand how the site is used. You can control cookies
          through your browser settings; disabling them may affect some
          functionality.
        </p>
      </LegalSection>

      <LegalSection heading="4. Sharing your information">
        <p>
          We do not sell your personal information. We only share it with
          trusted service providers who help us operate the site (for example,
          payment and hosting providers), and only to the extent necessary to
          deliver our services or comply with the law.
        </p>
      </LegalSection>

      <LegalSection heading="5. Data security">
        <p>
          We take reasonable technical and organisational measures to protect
          your data. Passwords are stored using industry-standard hashing, and
          access to personal data is restricted. No method of transmission over
          the internet is ever completely secure, however, and we cannot
          guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection heading="6. Your rights">
        <p>
          You may request access to, correction of, or deletion of your personal
          data at any time. To exercise these rights, contact us and we&apos;ll
          respond within a reasonable timeframe.
        </p>
      </LegalSection>

      <LegalSection heading="7. Contact us">
        <p>
          Questions about this policy? Reach out via our{" "}
          <Link href="/customdesign">contact page</Link> or email{" "}
          <a href="mailto:team@kayease.com">team@kayease.com</a>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
