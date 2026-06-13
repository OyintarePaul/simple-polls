import { notFound } from 'next/navigation';

import { getVoterFingerprint } from '@/lib/fingerprint';
import VotingForm from './voting-form';
import { getPollDetailsWithVoteCounts, getVoteByPollAndFingerprint } from '@/data/poll';

export default async function PublicPollPage(props: PageProps<'/p/[pollId]'>) {
  const { pollId } = await props.params;
  const poll = await getPollDetailsWithVoteCounts(pollId);

  // 1. Fetch Poll
  if (!poll) return notFound();

  // 2. Anti-fraud footprint
  const fingerprint = await getVoterFingerprint(pollId);

  // 3. Determine if this user has already voted
  const userVoteRecord = await getVoteByPollAndFingerprint(poll._id.toString(), fingerprint);

  return (
    <main className="container max-w-xl mx-auto px-4 py-12 min-h-screen flex flex-col justify-center gap-8">
      <div className="text-center space-y-3">
        {/* Micro status badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-50/60 dark:bg-indigo-500/10 text-xs font-semibold text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-500/5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live Community Poll
        </div>

        {/* Main contextual title */}
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Cast Your Response
        </h1>

        {/* UX security reassurance text */}
        <p className="text-sm text-muted-foreground max-w-sm mx-auto font-medium">
          Make your voice heard. Submissions are anonymous, encrypted, and immediately synced.
        </p>
      </div>

      <VotingForm
        poll={poll}
        hasVoted={!!userVoteRecord}
        votedOptionId={userVoteRecord?.optionId?.toString() || null}
        totalVotes={poll.totalVotes}
      />
    </main>
  );
}