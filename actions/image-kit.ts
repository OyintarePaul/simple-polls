"use server";
import { IMAGEKIT_PRIVATE_KEY, IMAGEKIT_PUBLIC_KEY } from "@/env";
import { auth } from "@clerk/nextjs/server";
import { getUploadAuthParams } from "@imagekit/next/server";

export async function getImageKitParams() {
  const { userId } = await auth();
  if (!userId) throw new Error("You are not authenticated");

  const { token, expire, signature } = getUploadAuthParams({
    privateKey: IMAGEKIT_PRIVATE_KEY,
    publicKey: IMAGEKIT_PUBLIC_KEY
  });

  return {
    token,
    expire,
    signature,
    publicKey: IMAGEKIT_PUBLIC_KEY,
  };
}
