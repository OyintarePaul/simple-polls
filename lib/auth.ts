import { cache } from "react";

import { redirect } from "next/navigation";

import connectToDb from "@/database/connection";
import { Poll } from "@/models/poll";
import { auth } from "@clerk/nextjs/server";

export const requireAuth = cache(async (): Promise<string> => {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    return userId;
});

export async function verifyPollOwnership(pollId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Authentication required.");

    await connectToDb();

    const poll = await Poll.findById(pollId);
    if (!poll) throw new Error("Poll not found.");
    if (poll.creatorId !== userId) throw new Error("Unauthorized access.");

    return { poll, userId };
}
