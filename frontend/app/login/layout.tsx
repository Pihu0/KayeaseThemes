import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Access",
  description: "Private administration workspace for the Kayease team.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
