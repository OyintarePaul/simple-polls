import { z } from "zod";

// 1. Client-safe Schema (Accessible anywhere, including components with 'use client')
const clientSchema = z.object({
    NEXT_PUBLIC_BASE_URL: z.url({ error: "NEXT_PUBLIC_BASE_URL must be a valid absolute path" }),
    NEXT_PUBLIC_IMAGEKIT_ENDPOINT: z.url({ error: "NEXT_PUBLIC_IMAGEKIT_ENDPOINT must be a valid URL" }),
});

// 2. Server-Only Schema (Contains sensitive secrets, NEVER import this into client components)
const serverSchema = clientSchema.extend({
    MONGODB_URI: z.string().refine(
        (val) => val.startsWith("mongodb://") || val.startsWith("mongodb+srv://"),
        { message: "MONGODB_URI must be a valid connection string starting with mongodb:// or mongodb+srv://" }
    ),
    IMAGEKIT_PUBLIC_KEY: z.string().min(1, { error: "IMAGEKIT_PUBLIC_KEY cannot be empty" }),
    IMAGEKIT_PRIVATE_KEY: z.string().min(1, { error: "IMAGEKIT_PRIVATE_KEY cannot be empty" }),
    FINGERPRINT_SECRET: z.string().min(32, { error: "FINGERPRINT_SECRET must be at least 32 characters long" }),
});

// Map values accurately
const processEnv = {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_IMAGEKIT_ENDPOINT: process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT,
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    FINGERPRINT_SECRET: process.env.FINGERPRINT_SECRET,
};

// 3. Determine context: Are we executing in the browser or on the server?
const isServer = typeof window === "undefined";
const schemaToExecute = isServer ? serverSchema : clientSchema;

const parsed = schemaToExecute.safeParse(processEnv);

if (!parsed.success) {
    const formattedErrors = z.treeifyError(parsed.error);
    console.error(
        `❌ CRITICAL CONFIGURATION FAULT (${isServer ? "SERVER" : "CLIENT"}): Invalid parameters:\n`,
        JSON.stringify(formattedErrors, null, 2)
    );
    throw new Error("Application initialization aborted due to invalid environment variables.");
}

// 4. Export safely. If on client, secrets will be typed as undefined or string | undefined
export const {
    NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_IMAGEKIT_ENDPOINT,
} = parsed.data;

export const MONGODB_URI = (parsed.data as any).MONGODB_URI as string;
export const IMAGEKIT_PUBLIC_KEY = (parsed.data as any).IMAGEKIT_PUBLIC_KEY as string;
export const IMAGEKIT_PRIVATE_KEY = (parsed.data as any).IMAGEKIT_PRIVATE_KEY as string;
export const FINGERPRINT_SECRET = (parsed.data as any).FINGERPRINT_SECRET as string;