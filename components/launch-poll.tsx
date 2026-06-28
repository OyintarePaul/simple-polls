import { Eye } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface LaunchPollButtonProps {
  pollId: string;
}

export function LaunchPoll({ pollId }: LaunchPollButtonProps) {
  return (
    <Link href={`/p/${pollId}`} passHref target="_blank">
      <Button
        variant="outline"
        size="sm"
        className="h-9 w-9 p-0 sm:w-auto sm:px-3 gap-1.5 font-medium select-none"
        title="Open Public Poll Page"
      >
        <Eye className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Launch</span>
      </Button>
    </Link>
  );
}