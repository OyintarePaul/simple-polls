import { deletePollAndVotes } from "@/actions/poll";
import CopyVoteLink from "@/components/CopyVoteLink";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import VotesChart from "@/components/VotesChart";
import dbConnect from "@/db/connect";
import { VotePOJO } from "@/db/models/vote";
import { getPollById } from "@/queries/poll";
import { getPollVotes } from "@/queries/vote";
import { Image } from "@imagekit/next";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PollDetailsPage({
  params,
}: {
  params: Promise<{ pollID: string }>;
}) {
  const { pollID } = await params;
  await dbConnect();
  const [poll, votes] = await Promise.all([
    getPollById(pollID),
    getPollVotes(pollID),
  ]);

  if (!poll) return notFound();

  // count votes for each option
  // this function is here because it is only declared and run
  // once on the server, so it dosen't affect performance
  function countVotes(votes: VotePOJO[]) {
    const votesCount: Record<string, number> = {};
    votes.forEach((vote) => {
      let currentCount = votesCount[vote.option] || 0;
      currentCount++;
      votesCount[vote.option] = currentCount;
    });
    return votesCount;
  }
  const votesCount = countVotes(votes);

  const votesChartData = poll.options.map((option) => ({
    optionText: option.optionText,
    voteCount: votesCount[option._id],
  }));

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <p className="text-4xl font-bold">{poll.questionText}</p>
          <p className="text-sm text-muted-foreground">
            ({votes.length} votes)
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <Link href={`/dashboard/polls/${poll._id}/edit`}>
            <Button size="icon" variant="ghost">
              <Pencil />
            </Button>
          </Link>

          <CopyVoteLink pollID={poll._id} />

          <form className="inline" action={deletePollAndVotes}>
            <Button size="icon" variant="ghost">
              <input hidden name="pollID" defaultValue={poll._id} />
              <Trash2 className="text-destructive" />
            </Button>
          </form>
        </div>
      </div>

      <div>
          {poll.mediaUrl && (
            <Image
              src={poll.mediaUrl}
              alt="poll media"
              width={250}
              height={250}
            />
          )}
        </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-4 flex-1">
          {poll.options.map((option) => {
            const voteCount = votesCount[option._id] || 0;
            return (
              <div className="space-y-1" key={option._id}>
                <p>{option.optionText}</p>
                <Progress value={(voteCount / votes.length) * 100} />
                <p className="text-sm text-muted-foreground">
                  {voteCount} votes
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-center text-3xl">Visual Analytics</h3>
          <VotesChart data={votesChartData} />
        </div>
      </div>
    </div>
  );
}
