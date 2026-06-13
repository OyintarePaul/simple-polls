import { headers } from "next/headers";
import { createHash } from "crypto";

/**
 * Generates an irreversible SHA-256 fingerprint that is completely isolated 
 * to a specific poll container to guarantee user voting privacy.
 */
export async function getVoterFingerprint(pollId: string): Promise<string> {
  const headersList = await headers();

  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0] ||
    headersList.get("x-real-ip") ||
    "127.0.0.1";

  const userAgent = headersList.get("user-agent") || "unknown-agent";
  const acceptLanguage = headersList.get("accept-language") || "unknown-lang";
  const appSalt = process.env.FINGERPRINT_SECRET;

  const rawPayload = `${pollId}-${ip}-${userAgent}-${acceptLanguage}-${appSalt}`;

  return createHash("sha256")
    .update(rawPayload)
    .digest("hex");
}