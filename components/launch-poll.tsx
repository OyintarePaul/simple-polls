import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface LaunchPollButtonProps {
  pollId: string;
}

export function LaunchPoll({ pollId }: LaunchPollButtonProps) {
  return (
    <Link href={`/p/${pollId}`} passHref target="_blank">
      <Button
        variant="outline"
        size="sm"
        className="h-9 w-9 p-0 sm:w-auto sm:px-3 gap-1.5 font-medium border-slate-200 text-slate-700 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300"
        title="Open Public Poll Page"
      >
        <Eye className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Launch</span>
      </Button>
    </Link>
  );
}