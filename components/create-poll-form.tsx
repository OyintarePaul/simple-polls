"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, CalendarDays, Layers3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPollSchema, type CreatePollData } from "@/lib/validations/poll";
import { toast } from "sonner";
import { createPollAction } from "@/actions/poll";
import { useTransition } from "react";

interface CreatePollFormProps {
  onSuccess?: () => void;
}

export function CreatePollForm({ onSuccess }: CreatePollFormProps) {
  const [pending, startTransition] = useTransition()
  const form = useForm<CreatePollData>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      question: "",
      options: [
        { text: "", },
        { text: "", }
      ],
      expiresAt: ""
    },
  });

  const { fields, append, remove } = useFieldArray<CreatePollData>({
    control: form.control,
    name: "options",
  });

  function onSubmit(data: CreatePollData) {
    console.log(data)
    startTransition(async () => {
      try {
        const result = await createPollAction(data);

        // Handles expected server errors safely
        if (!result.success) {
          toast.error(result.error || "Failed to deploy poll.");
          return;
        }

        // Handles a clean success pipeline execution
        toast.success("Poll deployed live successfully!");
        form.reset();

        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        // Intercepts unexpected runtime database crashes or connection drops
        console.error("CLIENT_SUBMIT_CRASH:", error);
        toast.error("A critical network or server error occurred. Please try again.");
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 max-w-2xl mx-auto bg-slate-900/50 rounded-xl border border-slate-800">
      {/* Question Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">Poll Question</label>
        <Input
          {...form.register("question")}
          placeholder="What do you want to ask your community?"
          className="bg-slate-950 border-slate-800 focus-visible:ring-indigo-500"
        />
        {form.formState.errors.question && (
          <p className="text-xs text-rose-500">{form.formState.errors.question.message}</p>
        )}
      </div>

      {/* Dynamic Options Fields */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-300 flex justify-between items-center">
          <span>Answer Options</span>
          <span className="text-xs text-slate-500 font-mono">{fields.length}/10</span>
        </label>

        {fields.map((field, index) => (
          <div key={field.id} className="space-y-1">
            <div className="flex items-center gap-2">
              <Input
                {...form.register(`options.${index}.text` as const)}
                placeholder={`Option ${index + 1}`}
                className="bg-slate-950 border-slate-800 focus-visible:ring-indigo-500 flex-1"
              />
              {fields.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            {form.formState.errors.options?.[index] && (
              <p className="text-xs text-rose-500">{form.formState.errors.options[index]?.message}</p>
            )}
          </div>
        ))}

        {fields.length < 10 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ text: "" })}
            className="mt-2 border-dashed border-slate-800 hover:border-indigo-500 text-slate-400 hover:text-slate-200 bg-transparent gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Option
          </Button>
        )}
      </div>

      {/* Expiry At Date Time Input block */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
          <CalendarDays className="w-4 h-4 text-slate-400" />
          <span>Poll Expiration Date</span>
        </label>
        <Input
          type="datetime-local"
          {...form.register("expiresAt")}
          className="bg-slate-950 border-slate-800 focus-visible:ring-indigo-500 text-slate-300 w-full [color-scheme:dark]"
        />
        {form.formState.errors.expiresAt && (
          <p className="text-xs text-rose-500">{form.formState.errors.expiresAt.message}</p>
        )}
      </div>

      <hr className="border-slate-800" />

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={form.formState.isSubmitting || pending}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md gap-2"
      >
        <Layers3 className="w-4 h-4" />
        {pending ? "Deploying Pipeline..." : "Launch Live Poll"}
      </Button>
    </form>
  );
}