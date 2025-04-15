import { IMAGEKIT_ENDPOINT } from "@/env";
import { ImageKitProvider } from "@imagekit/next";
export default function ImageKit({ children }: { children: React.ReactNode }) {
  return (
    <ImageKitProvider urlEndpoint={IMAGEKIT_ENDPOINT}>
      {children}
    </ImageKitProvider>
  );
}
