"use client";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deletePoll } from "@/actions/poll";

interface DeleteButtonProps {
    pollId: string;
}

export function DeletePoll({ pollId }: DeleteButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!confirm("Are you absolutely sure you want to permanently delete this poll and all its data history?")) return;

        startTransition(async () => {
            const result = await deletePoll(pollId);

            if (result.success) {
                toast.success("Poll Purged", {
                    description: "The poll record has been successfully deleted.",
                });
            } else {
                toast.error("Deletion failed", { description: result.error });
            }
        });
    };

    return (
        <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={handleDelete}
            className="h-9 w-9 p-0 border-border text-destructive hover:text-destructive hover:bg-destructive/10"
            title="Delete Poll Permanently"
        >
            {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
                <Trash2 className="w-3.5 h-3.5" />
            )}
        </Button>
    );
}