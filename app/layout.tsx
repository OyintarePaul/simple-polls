import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Providers from "@/providers";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { dark } from '@clerk/themes';

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
    <ClerkProvider afterSignOutUrl="/" appearance={{
      theme: dark, 
      cssLayerName: "clerk",
      elements: {
        modalBackdrop: "!bg-slate-950/80 backdrop-blur-md transition-all duration-300"
      },
    }}>
      <html lang="en" className={cn("font-sans", inter.variable,)}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Providers>
            {children}
            <Toaster richColors theme="system"/>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
