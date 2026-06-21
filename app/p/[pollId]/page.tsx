import { notFound } from "next/navigation";

import { getVoterFingerprint } from "@/lib/fingerprint";
import VotingForm from "./voting-form";
import { getPollDetailsWithVoteCounts, getVoteByPollAndFingerprint } from "@/data/poll";

interface PageProps {
  params: Promise<{ pollId: string }>;
}

export default async function PublicPollPage({ params }: PageProps) {
  const { pollId } = await params;
  const poll = await getPollDetailsWithVoteCounts(pollId);

  if (!poll) return notFound();

  // 1. Compute state flags
  const isExpired = poll.expiresAt && new Date() > new Date(poll.expiresAt);
  const isClosed = !poll.isActive || isExpired;

  // 2. Anti-fraud footprint
  const fingerprint = await getVoterFingerprint(pollId);

  // 3. Determine if this user has already voted
  const userVoteRecord = await getVoteByPollAndFingerprint(poll._id.toString(), fingerprint);

  return (
    <main className="container max-w-xl mx-auto px-4 py-12 min-h-screen flex flex-col justify-center gap-8">
      <div className="text-center space-y-3">
        {/* Dynamic Micro status badge */}
        {isClosed ? (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-500/20 bg-slate-50 dark:bg-slate-500/10 text-xs font-semibold text-slate-600 dark:text-slate-400 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400 dark:bg-slate-500"></span>
            </span>
            Concluded Poll
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-50/60 dark:bg-indigo-500/10 text-xs font-semibold text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-500/5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Community Poll
          </div>
        )}

        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {isClosed ? "Poll Results" : "Cast Your Response"}
        </h1>

        <p className="text-sm text-muted-foreground max-w-sm mx-auto font-medium">
          {isClosed 
            ? "Voting has ended for this question. Final verified numbers are displayed below." 
            : "Make your voice heard. Submissions are anonymous, encrypted, and immediately synced."}
        </p>
      </div>

      <VotingForm 
        poll={poll}
        hasVoted={!!userVoteRecord}
        votedOptionId={userVoteRecord?.optionId?.toString() || null}
        totalVotes={poll.totalVotes}
        isClosed={isClosed} // 🌟 Passed down here
      />
    </main>
  );
}