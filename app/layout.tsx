import React from "react";
import type { Metadata } from "next";
import "react-datepicker/dist/react-datepicker.css";
import "./globals.css";
import { Plus_Jakarta_Sans as FontSans } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import NetworkStatus from "@/components/network-status";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "PulseCare",
  description: "A Healthcare management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-dark-300 font-sans antialiased text-light-200",
          fontSans.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
          {children}
          <NetworkStatus />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
