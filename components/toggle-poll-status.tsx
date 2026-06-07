"use client"
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Power, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { togglePollStatus } from "@/actions/poll";

interface ToggleButtonProps {
    pollId: string;
    isActive: boolean;
}

export function TogglePollStatus({ pollId, isActive }: ToggleButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        startTransition(async () => {
            const result = await togglePollStatus(pollId, isActive);

            if (result.success) {
                toast.success(isActive ? "Poll Paused" : "Poll Activated", {
                    description: isActive ? "Responses are now blocked." : "Public links are open again.",
                });
            } else {
                toast.error("Operation failed", { description: result.error });
            }
        });
    };

    return (
        <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={handleToggle}
            className={`h-9 w-9 p-0 border-slate-200 dark:border-slate-800 ${isActive
                    ? "text-amber-500 hover:bg-amber-500/10 hover:text-amber-600"
                    : "text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-600"
                }`}
            title={isActive ? "Pause Registration" : "Resume Registration"}
        >
            {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
            ) : (
                <Power className="w-3.5 h-3.5" />
            )}
        </Button>
    );
}