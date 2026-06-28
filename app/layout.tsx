import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { shadcn } from '@clerk/ui/themes';
import { ClerkProvider } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SimplePoll | Real-time Community Polling",
    template: "%s | SimplePoll", // Allows sub-pages to dynamically become "Analytics | SimplePoll"
  },
  description: "Create anonymous, encrypted, real-time community polls with instant analytics syncing.",
  keywords: ["polling", "voting app", "real-time analytics", "nextjs", "anonymous feedback"],
  authors: [{ name: "Egrenbido Oyintare Paul" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "SimplePoll | Real-time Community Polling",
    description: "Create anonymous, encrypted, real-time community polls with instant analytics syncing.",
    url: "https://yourdomain.com",
    siteName: "SimplePoll",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SimplePoll | Real-time Community Polling",
    description: "Create anonymous, encrypted, real-time community polls with instant analytics syncing.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/" appearance={{ theme: shadcn, }}>
      <html lang="en" className={cn("font-sans", geistSans.variable, geistMono.variable)}>
        <body className="antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors/>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
