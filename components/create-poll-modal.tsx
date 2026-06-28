"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreatePollForm } from "./create-poll-form";

interface CreatePollModalProps {
  trigger?: React.ReactNode;
}

export function CreatePollModal({ trigger }: CreatePollModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="w-4 h-4" /> Create New Poll
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl shadow-2xl backdrop-blur-md max-h-[95vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Launch a New Poll
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill out the details below to deploy your poll live to your community pipeline.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
          <CreatePollForm onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}