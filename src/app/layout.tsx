import type { Metadata } from "next";
import type { ReactNode } from "react";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Checklist",
  description: "Gestion des tâches internes",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col bg-gray-50 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
