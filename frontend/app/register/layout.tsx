import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a Kayease Themes account.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
