import { createPoll } from "@/actions/poll";
import PollCard from "@/components/PollCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { getUserPolls } from "@/queries/poll";
import { auth } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) throw new Error("You are not authenticated");
  const polls = await getUserPolls(userId);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {polls.map((poll) => (
          <PollCard poll={poll} key={poll._id} />
        ))}

        <Card>
          <form
            action={createPoll}
            className="flex items-center justify-center w-full h-full"
          >
            <Button
              variant="ghost"
              className="flex flex-col gap-2 hover:bg-transparent"
            >
              <Plus className="size-6" />
              <span>Create a new poll</span>
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
