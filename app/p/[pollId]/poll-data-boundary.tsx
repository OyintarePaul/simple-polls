import { notFound } from "next/navigation";

import { getVoterFingerprint } from "@/lib/fingerprint";
import VotingForm from "./voting-form";
import { getPollDetailsWithVoteCounts, getVoteByPollAndFingerprint } from "@/data/poll";

export default async function PollDataBoundary({ paramsPromise }: { paramsPromise: Promise<{ pollId: string }> }) {
    const { pollId } = await paramsPromise;
    const poll = await getPollDetailsWithVoteCounts(pollId);

    // 1. Fetch Poll
    if (!poll) return notFound();

    // 2. Anti-fraud footprint
    const fingerprint = await getVoterFingerprint(pollId);

    // 3. Determine if this user has already voted
    const userVoteRecord = await getVoteByPollAndFingerprint(poll._id.toString(), fingerprint);

    return (
        <VotingForm
            poll={poll}
            hasVoted={!!userVoteRecord}
            votedOptionId={userVoteRecord?.optionId?.toString() || null}
            totalVotes={poll.totalVotes}
        />
    )
}