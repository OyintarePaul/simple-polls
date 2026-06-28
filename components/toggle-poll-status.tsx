"use client"
import { togglePollStatus } from "@/actions/poll";
import { Button } from "@/components/ui/button";
import { Loader2, Power } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

interface ToggleButtonProps {
    pollId: string;
    isActive: boolean;
    disabled: boolean;
}

export function TogglePollStatus({ pollId, isActive, disabled }: ToggleButtonProps) {
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
            disabled={isPending || disabled}
            onClick={handleToggle}
            className={`h-9 w-9 p-0 border-border ${isActive
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