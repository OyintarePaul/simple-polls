"use client";
import React, { useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { PollPOJO } from "@/db/models/poll";
import { Button } from "./ui/button";
import { Grip, GripVertical, Plus } from "lucide-react";
import { updatePollQuestionAndOptions } from "@/actions/poll";

export default function PollForm({ poll }: { poll: PollPOJO }) {
    const [questionText, setQuestionText] = useState(poll.questionText);
    const [options, setOptions] = useState(poll.options);
    const [isPending, startTransition] = useTransition();

    const addOption = () => {
        setOptions([...options, { optionText: "", _id: "" }]);
    };

    const handleOptionTextChange = (text: string, currentIndex: number) => {
        const newOptions = options.map((option, index) => {
            if (index == currentIndex) {
                return {
                    _id: option._id,
                    optionText: text,
                };
            }
            return option;
        });

        setOptions(newOptions);
    };

    const submitAction = async () => {
        startTransition(async () => {
            await updatePollQuestionAndOptions({
                questionText,
                userID: poll.userID,
                _id: poll._id,
                options,
            });
        });
    };

    return (
        <form className="space-y-8" action={submitAction}>
            <div className="space-y-4">
                <Label htmlFor="questionText">Question</Label>
                <Input
                    id="questionText"
                    name="questionText"
                    placeholder="Enter Question Text"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    className="text-4xl placeholder:text-5xl placeholder:font-light py-12 border-0 border-bottom bg-background"
                />
            </div>

            <div className="space-y-4">
                



                
                <div>
                    <Button disabled={isPending}>Save</Button>
                </div>
            </div>
        </form>
    );
}
