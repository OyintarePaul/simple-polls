"use client";

import { placeVote } from "@/actions/poll";
import { PollPOJO } from "@/db/models/poll";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useActionState } from "react";

export default function PollVoteForm({ poll }: { poll: PollPOJO }) {
    const [state, action, pending] = useActionState(placeVote, {
        success: false,
        message: "",
    });
    return (
        <form className="space-y-6" action={action}>
            <Input name="pollID" defaultValue={poll._id.toString()} hidden />

            <div className="space-y-4">
                {poll.options.map((option) => (
                    <div key={option._id}>
                        <Input
                            type="radio"
                            name="optionID"
                            value={option._id}
                            id={option._id}
                            className="sr-only peer"
                        />
                        <Label
                            htmlFor={option._id}
                            className="cursor-pointer rounded-md ring-2 peer-checked:ring-primary px-4 py-6"
                        >
                            {option.optionText}
                        </Label>
                    </div>
                ))}
            </div>
            {state.success ? (
                <p className="text-green-500">
                    You vote has been recorded successfully
                </p>
            ) : (
                <Button loading={pending}>Vote Now</Button>
            )}
        </form>
    );
}
