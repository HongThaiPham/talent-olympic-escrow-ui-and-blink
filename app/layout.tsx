import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import AppProvider from "@/components/AppProvider";
import { cn } from "@/lib/utils";
import Footer from "@/components/commons/Footer";

const inter = Outfit({ subsets: ["latin"] });

const baseURL =
  process.env.NODE_ENV === "production"
    ? (process.env.NEXT_PUBLIC_DOMAIN as string)
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseURL),
  title: "Solana Talent Olympics 2024 - Escrow & Blink",
  description: "A UI for the Solana Talent Olympics 2024 - Escrow & Blink",
  other: {
    "dscvr:canvas:version": "vNext",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          inter.className
        )}
      >
        <AppProvider>
          {children}

          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
