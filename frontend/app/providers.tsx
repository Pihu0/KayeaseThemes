"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class" // toggles the .dark class on <html>
      defaultTheme="system" // respect the user's OS preference by default
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        {children}
        {/* Global toast notifications for success/error messages */}
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}
