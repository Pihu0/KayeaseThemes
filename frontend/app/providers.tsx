"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      {/* Global toast notifications for success/error messages */}
      <Toaster richColors position="top-right" />
    </AuthProvider>
  );
}
