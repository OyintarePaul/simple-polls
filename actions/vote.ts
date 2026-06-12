"use server";
import connectToDb from "@/database/connection"
import { Poll } from "@/models/poll";
import { Vote } from "@/models/vote";
import { IVote } from "@/types/poll";
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

        if (!poll.isActive) {
            return { success: false, error: "This poll has been closed." };
        }

        const userVoteRecord =
            await Vote.findOne({
                pollId: poll._id,
                voterFingerprint: fingerprint
            }).lean() as IVote | null;

        // 🛑 THE FRAUD STOPPER: If a database record already exists, kick them out!
        if (userVoteRecord) {
            return { success: false, error: "You have already cast your vote on this poll." };
        }
    
        // 5. ATOMIC VOTE UPDATE 
        // We execute the updates simultaneously to keep numbers perfectly in sync
        const updateResult = await Poll.updateOne(
            { _id: pollId, "options._id": optionId },
            {
                $inc: {
                    "options.$.voteCount": 1,
                    totalVotes: 1
                }
            }
        );

        if (updateResult.modifiedCount === 0) {
            return { success: false, error: "Invalid option selection." };
        }

        // 6. WRITE LOGS: Save the receipt so Vote.findOne() catches them on a refresh
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