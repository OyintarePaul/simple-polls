"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-md shadow-indigo-600/10">
            <Plus className="w-4 h-4" /> Create New Poll
          </Button>
        )}
      </DialogTrigger>
      
      {/* The overlay class below is injected via Shadcn to mirror your Clerk look:
        Deep dark canvas with a hardware-accelerated blur filter.
      */}
      <DialogContent className="sm:max-w-[600px] bg-slate-950 border-slate-800 text-slate-100 shadow-2xl backdrop-blur-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight text-slate-100">
            Launch a New Poll
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Fill out the details below to deploy your poll live to your community pipeline.
          </DialogDescription>
        </DialogHeader>

        {/* Form component goes here. Next, we will hook up its closing mechanism */}
        <div className="py-4">
          <CreatePollForm onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}