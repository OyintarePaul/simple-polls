"use server";
import connectToDb from "@/database/connection"
import { Poll } from "@/models/poll";
import { Vote, VoteDocument } from "@/models/vote";
import { getVoterFingerprint } from "@/lib/fingerprint";
import { revalidatePath } from "next/cache";

interface CastVotePayload {
    pollId: string;
    optionId: string;
}

export async function castVote({ pollId, optionId }: CastVotePayload) {
    try {
        await connectToDb();

        // 1. Resolve Identity Containers
        const fingerprint = await getVoterFingerprint(pollId);

        // 2. Fetch the Target Poll
        const poll = await Poll.findById(pollId);
        if (!poll) {
            return { success: false, error: "The targeted poll does not exist." };
        }

        if (!poll.isActive || poll.expiresAt < new Date()) {
            return { success: false, error: "This poll has been closed or is expired." };
        }

        const userVoteRecord =
            await Vote.findOne({
                pollId: poll._id,
                voterFingerprint: fingerprint
            }).lean() as VoteDocument | null;

        // 🛑 THE FRAUD STOPPER: If a database record already exists, kick them out!
        if (userVoteRecord) {
            return { success: false, error: "You have already cast your vote on this poll." };
        }

        await Vote.create({
            pollId: poll._id,
            voterFingerprint: fingerprint,
            optionId: optionId,
        });

        // 7. PURGE THE VISUAL CACHE PIPELINE
        revalidatePath(`/p/${pollId}`);
        revalidatePath("/dashboard");

        return { success: true };

    } catch (error) {
        console.error("SERVER_VOTE_ACTION_CRASH:", error);
        return { success: false, error: "An error occurred while deploying your vote." };
    }
}