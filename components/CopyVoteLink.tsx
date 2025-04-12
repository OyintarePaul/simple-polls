"use client"
import { Check, Copy } from "lucide-react"
import { Button } from "./ui/button"
import useClipboard from "react-use-clipboard"
import { BASE_URL } from "@/env"

export default function CopyVoteLink({ pollID }: { pollID: string }) {
    const [isCopied, setCopied] = useClipboard(`${BASE_URL}/p/${pollID}`, {
        successDuration: 3000
    })
    
    return (
        <>
            {isCopied ? (
                <Button size="icon" variant="ghost">
                    <Check className="size-4 text-green-600 dark:text-green-400" />
                </Button>
            ) : (
                <Button size="icon" variant="ghost" onClick={setCopied}>
                    <Copy className="size-4" />
                </Button>
            )}

        </>
    )
}