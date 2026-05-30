import type { PageProps } from "next";
import PollForm from "@/components/PollForm";
import { getPollById } from "@/queries/poll";
import { notFound } from "next/navigation";

export default async function PollEditPage({ params }: PageProps<{ pollID: string }>) {
    const { pollID } = params
    const poll = await getPollById(pollID)
    if (!poll) return notFound()
    return <PollForm poll={poll} />
}