import { PollPOJO, } from "@/db/models/poll";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import CopyVoteLink from "./CopyVoteLink";

export default function PollCard({ poll }: { poll: PollPOJO }) {
    return (
        <Card key={poll._id}>
            <CardHeader className="flex justify-between items-center">
                <CardTitle>{poll.questionText}</CardTitle>
                <CopyVoteLink pollID={poll._id} />
            </CardHeader>
            <CardFooter className="flex justify-between">
                <Link href={`/dashboard/polls/${poll._id}/edit`} className={cn(buttonVariants({ variant: "outline" }))}>Edit</Link>
                <Link href={`/dashboard/polls/${poll._id}`} className={cn(buttonVariants())}>Details</Link>
            </CardFooter>
        </Card>
    )
}