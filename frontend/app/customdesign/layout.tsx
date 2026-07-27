import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Design",
  description:
    "Tell us your vision and we'll design a custom theme tailored to your brand — unique, production-ready and built to convert.",
  alternates: { canonical: "/customdesign" },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
