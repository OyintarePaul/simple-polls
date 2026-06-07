"use client";

import { useState } from "react";
import { togglePollStatus, deletePoll } from "@/actions/poll";

interface ControlsProps {
  pollId: string;
  isActive: boolean;
}

export function PollControlPanel({ pollId, isActive }: ControlsProps) {
  const [isPending, setIsPending] = useState(false);

  const handleToggle = async () => {
    setIsPending(true);
    const res = await togglePollStatus(pollId, isActive);
    if (!res.success) alert(res.error);
    setIsPending(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you absolutely sure you want to delete this poll and all its historical results?")) return;
    setIsPending(true);
    const res = await deletePoll(pollId);
    if (!res.success) alert(res.error);
    setIsPending(false);
  };

  return (
    <div className="flex gap-4 p-4 border border-slate-800 rounded-lg bg-slate-900/50">
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
          isActive 
            ? "bg-amber-600/20 text-amber-400 hover:bg-amber-600/30 border border-amber-500/20" 
            : "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/20"
        }`}
      >
        {isActive ? "Pause / Close Poll" : "Open / Reactivate Poll"}
      </button>

      <button
        onClick={handleDelete}
        disabled={isPending}
        className="px-4 py-2 rounded text-sm font-semibold bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 border border-rose-500/20 transition-colors ml-auto"
      >
        Delete Permanently
      </button>
    </div>
  );
}