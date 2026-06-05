"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { pollFormSchema, type PollFormValues } from "@/lib/validations/poll";
import connectToDb from "@/database/connection";
import { Poll } from "@/models/Poll";

export async function createPollAction(values: PollFormValues) {
    try {
        // 1. Authenticate the session
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: "Authentication required." };
        }

        // 2. Validate the data payload against the schema on the server
        const parsed = pollFormSchema.safeParse(values);
        if (!parsed.success) {
            return { success: false, error: "Invalid form parameters provided." };
        }

        const { question, options, isPrivate } = parsed.data;

        // 3. Connect to MongoDB
        await connectToDb();

        // 4. Transform options into an array of objects tracking counts
        const formattedOptions = options.map((opt) => ({
            text: opt.text,

        }));
        // 5. Create the database record
        await Poll.create({
            creatorId: userId,
            question,
            options: formattedOptions,
            isPrivate,
        });

        // 6. Purge the Next.js layout cache so the dashboard immediately shows the new poll
        revalidatePath("/dashboard");

        return { success: true };
    } catch (error) {
        console.error("POLL_CREATION_FAILURE:", error);
        return { success: false, error: "Internal server error occurred." };
    }
}