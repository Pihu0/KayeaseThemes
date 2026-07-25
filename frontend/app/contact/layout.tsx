import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start a Conversation",
  description:
    "Have a question about a theme, need support, or planning something custom? Tell us what you're thinking — we'll take it from here.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
