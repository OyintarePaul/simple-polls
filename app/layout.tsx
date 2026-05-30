import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Providers from "@/providers";
import MainLayout from "@/components/MainLayout";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "@/components/NavBar";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Simple Polls",
  description: "Create simple multichoice polls to settle disputes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={cn("font-sans", inter.variable)}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Providers>
            {children}
            <Toaster richColors />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
