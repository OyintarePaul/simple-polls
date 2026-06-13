import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { cache } from "react";

import connectToDb from '@/database/connection';
import { Poll } from "@/models/poll";

export const requireAuth = cache(async (): Promise<string> => {
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    return userId;
})

async function verifyOwnership(pollId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Authentication required.");

    await connectToDb();
    const poll = await Poll.findById(pollId);
    if (!poll) throw new Error("Poll not found.");
    if (poll.creatorId !== userId) throw new Error("Unauthorized access.");

    return { poll, userId };
}
