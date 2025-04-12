import PollForm from "@/components/PollForm";
import { getPollById } from "@/queries/poll";
import { notFound } from "next/navigation";

export default async function PollEditPage({ params }: { params: Promise<{ pollID: string }> }) {
    const { pollID } = await params
    const poll = await getPollById(pollID)
    if (!poll) return notFound()
    return <PollForm poll={poll} />
}