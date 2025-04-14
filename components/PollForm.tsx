"use client";
import React, { useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { OptionPOJO, PollPOJO } from "@/db/models/poll";
import { Button } from "./ui/button";
import { updatePollQuestionAndOptions } from "@/actions/poll";
import PollOptions from "./PollOptions";
import UploadPollMedia from "./UploadPollMedia";

export default function PollForm({ poll }: { poll: PollPOJO }) {
    const [questionText, setQuestionText] = useState(poll.questionText);
    const [options, setOptions] = useState(poll.options);
    const [mediaUrl, setMediaUrl] = useState(poll.mediaUrl)
    const [isPending, startTransition] = useTransition();

    const addOption = () => {
        setOptions([...options, { optionText: "", _id: "" }]);
    };

    const updateOptions = (options: OptionPOJO[]) => {
        setOptions(options)
    }

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
                mediaUrl
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
                <UploadPollMedia mediaUrl={poll.mediaUrl} setMediaUrl={(url) => setMediaUrl(url)}/>
            </div>

            <div className="space-y-4">
                <PollOptions
                    options={options}
                    handleOptionTextChange={handleOptionTextChange}
                    addOption={addOption}
                    updateOptions={updateOptions}
                />
            </div>

            <div>
                <Button disabled={isPending}>Save</Button>
            </div>
        </form>
    );
}
