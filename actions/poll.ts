"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { pollFormSchema, type PollFormValues } from "@/lib/validations/poll";
import connectToDb from "@/database/connection";
import { Poll } from "@/models/Poll";
import { Vote } from "@/models/Vote";

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

        const { question, options } = parsed.data;

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
        });

        // 6. Purge the Next.js layout cache so the dashboard immediately shows the new poll
        revalidatePath("/dashboard");

        return { success: true };
    } catch (error) {
        console.error("POLL_CREATION_FAILURE:", error);
        return { success: false, error: "Internal server error occurred." };
    }
}

async function verifyOwnership(pollId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Authentication required.");

    await connectToDb();
    const poll = await Poll.findById(pollId);
    if (!poll) throw new Error("Poll not found.");
    if (poll.creatorId !== userId) throw new Error("Unauthorized access.");

    return { poll, userId };
}

export async function togglePollStatus(pollId: string, currentState: boolean) {
    try {
        await verifyOwnership(pollId);

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
        await verifyOwnership(pollId);

        // Remove the main poll structure entry
        await Poll.findByIdAndDelete(pollId);

        // Cascade delete: Purge all the voting receipts linked to this poll container
        await Vote.deleteMany({ pollId });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to delete poll records.";
        return { success: false, error: errorMessage };
    }
}