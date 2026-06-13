"use server";
import connectToDb from "@/database/connection";
import { verifyPollOwnership } from "@/lib/auth";
import { createPollSchema, type CreatePollData } from "@/lib/validations/poll";
import { Poll } from "@/models/poll";
import { Vote } from "@/models/vote";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createPollAction(values: CreatePollData) {
    try {
        // 1. Authenticate the session
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: "Authentication required." };
        }

        // 2. Validate the data payload against the schema on the server
        const parsed = createPollSchema.safeParse(values);
        if (!parsed.success) {
            return { success: false, error: "Invalid form parameters provided." };
        }

        const { question, options, expiresAt } = parsed.data;

        // 3. Connect to MongoDB
        await connectToDb();

        await Poll.create({
            creatorId: userId,
            question,
            options,
            expiresAt
        });

        // 6. Purge the Next.js layout cache so the dashboard immediately shows the new poll
        revalidatePath("/dashboard");

        return { success: true };
    } catch (error) {
        console.error("POLL_CREATION_FAILURE:", error);
        return { success: false, error: "Internal server error occurred." };
    }
}


export async function togglePollStatus(pollId: string, currentState: boolean) {
    try {
        await verifyPollOwnership(pollId);

        await Poll.findByIdAndUpdate(pollId, {
            $set: { isActive: !currentState },
        });

        revalidatePath(`/p/${pollId}`);
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to alter status.";
        return { success: false, error: errorMessage };
    }
}

export async function deletePoll(pollId: string) {
    try {
        await verifyPollOwnership(pollId);

        await Promise.all([
            // Remove the main poll structure entry
            Poll.findByIdAndDelete(pollId),
            // Cascade delete: Purge all the voting receipts linked to this poll container
            Vote.deleteMany({ pollId })
        ])

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to delete poll records.";
        return { success: false, error: errorMessage };
    }
}