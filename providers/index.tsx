"use client";
import ImageKit from "./image-kit";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ImageKit>
      <ThemeProvider>{children}</ThemeProvider>
    </ImageKit>
  );
}
