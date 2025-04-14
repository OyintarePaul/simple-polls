import PollVoteForm from "@/components/PollVoteForm"
import { getPollById } from "@/queries/poll"
import { notFound } from "next/navigation"

export default async function PollVotePage({ params }: { params: Promise<{ pollID: string }> }) {
    const { pollID } = await params
    const poll = await getPollById(pollID)
    if (!poll) return notFound()

    return (
        <div className="space-y-6">
            <div>
                <p className="text-2xl font-bold">{poll.questionText}</p>
                <p className="text-sm text-muted-foreground">(Choose an option below)</p>
            </div>

            <PollVoteForm poll={poll}/>
        </div>
    )
}