import { z } from "zod";

// 1. Client-safe Schema (Empty for now, but ready if you add NEXT_PUBLIC_ vars later)
const clientSchema = z.object({});

// 2. Server-Only Schema
const serverSchema = clientSchema.extend({
    MONGODB_URI: z.string().refine(
        (val) => val.startsWith("mongodb://") || val.startsWith("mongodb+srv://"),
        { message: "MONGODB_URI must be a valid connection string starting with mongodb:// or mongodb+srv://" }
    ),
    FINGERPRINT_SECRET: z.string().min(32, { error: "FINGERPRINT_SECRET must be at least 32 characters long" }),
});

// Map values accurately
const processEnv = {
    MONGODB_URI: process.env.MONGODB_URI,
    FINGERPRINT_SECRET: process.env.FINGERPRINT_SECRET,
};

// 3. Determine context: Are we executing in the browser or on the server?
const isServer = typeof window === "undefined";
const schemaToExecute = isServer ? serverSchema : clientSchema;

const parsed = schemaToExecute.safeParse(processEnv);

if (!parsed.success) {
    console.error(
        `❌ CRITICAL CONFIGURATION FAULT (${isServer ? "SERVER" : "CLIENT"}): Invalid parameters:\n`,
        JSON.stringify(z.treeifyError(parsed.error), null, 2)
    );
    throw new Error("Application initialization aborted due to invalid environment variables.");
}

/**
 * 4. Safe Conditional Exporting
 * We safely cast based on the runtime environment to prevent 
 * runtime crashes in the browser while maintaining clean types.
 */
const serverData = isServer
    ? (parsed.data as unknown as z.infer<typeof serverSchema>)
    : ({} as Partial<z.infer<typeof serverSchema>>);

export const MONGODB_URI = serverData.MONGODB_URI;
export const FINGERPRINT_SECRET = serverData.FINGERPRINT_SECRET;