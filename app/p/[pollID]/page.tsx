import PollVoteForm from "@/components/PollVoteForm";
import { getPollById } from "@/queries/poll";
import { Image } from "@imagekit/next";
import { notFound } from "next/navigation";

export default async function PollVotePage({
    params,
}: {
    params: Promise<{ pollID: string }>;
}) {
    const { pollID } = await params;
    const poll = await getPollById(pollID);
    if (!poll) return notFound();

    return (
        <div className="space-y-10">
            <div>
                <p className="text-2xl font-bold">{poll.questionText}</p>
                <p className="text-sm text-muted-foreground">
                    (Choose an option below)
                </p>
            </div>
            {poll.mediaUrl && (
                <Image
                    src={poll.mediaUrl}
                    alt="poll media"
                    width={300}
                    height={300}                    
                />
            )}
            <PollVoteForm poll={poll} />
        </div>
    );
}
