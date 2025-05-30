"use client";
import React, { useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { OptionPOJO, PollPOJO } from "@/db/models/poll";
import { Button } from "./ui/button";
import { updatePollDetails } from "@/actions/poll";
import PollOptions from "./PollOptions";
import UploadPollMedia from "./UploadPollMedia";
import RemovePollMedia from "./RemovePollMedia";
import { Image } from "@imagekit/next";

export default function PollForm({ poll }: { poll: PollPOJO }) {
    const [questionText, setQuestionText] = useState(poll.questionText);
    const [options, setOptions] = useState(poll.options);
    const [mediaUrl, setMediaUrl] = useState(poll.mediaUrl);
    const [isPending, startTransition] = useTransition();

    const addOption = () => {
        setOptions([...options, { optionText: "", _id: "" }]);
    };

    const handleRemove = (optionIndex: number) => {
        const newOptions = options.filter((_, index) => index != optionIndex);
        setOptions(newOptions);
    };

    const updateOptions = (options: OptionPOJO[]) => {
        setOptions(options);
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

    const submitAction = () => {
        startTransition(async () => {
            await updatePollDetails({
                questionText,
                userID: poll.userID,
                _id: poll._id,
                options,
                mediaUrl,
            });
        });
    };

    return (
        <form className="space-y-8 mb-16" action={submitAction}>
            <div className="space-y-4">
                <Label htmlFor="questionText">Question</Label>
                <Input
                    id="questionText"
                    name="questionText"
                    placeholder="Enter Question Text"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    className="text-2xl md:text-5xl placeholder:text-5xl placeholder:font-light py-10 border-0 border-b border-primary bg-background"
                />

                {mediaUrl && (
                    <Image
                        src={mediaUrl}
                        alt="poll media"
                        width={500}
                        height={500}
                    />
                )}
                <div className="space-x-2">
                    <UploadPollMedia
                        mediaUrl={mediaUrl}
                        setMediaUrl={(url) => setMediaUrl(url)}
                    />
                    <RemovePollMedia
                        mediaUrl={mediaUrl}
                        setMediaUrl={(url) => setMediaUrl(url)}
                    />

                   
                </div>
            </div>

            <div className="space-y-4">
                <PollOptions
                    options={options}
                    handleOptionTextChange={handleOptionTextChange}
                    addOption={addOption}
                    updateOptions={updateOptions}
                    handleRemove={handleRemove}
                />
            </div>

            <div>
                <Button loading={isPending}>Save</Button>
            </div>
        </form>
    );
}
