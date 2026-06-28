"use client";
import { useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Layers3 } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPollSchema, type CreatePollData } from "@/lib/validations/poll";
import { createPollAction } from "@/actions/poll";
import { Label } from "./ui/label";

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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 max-w-2xl mx-auto bg-muted/40 rounded-xl border border-border">
      {/* Question Input */}
      <div className="space-y-2">
        <Label>Poll Question</Label>
        <Input
          {...form.register("question")}
          placeholder="What do you want to ask your community?"
          className="bg-muted/50 border-input focus-visible:ring-ring"
        />
        {form.formState.errors.question && (
          <p className="text-xs text-destructive">{form.formState.errors.question.message}</p>
        )}
      </div>

      {/* Dynamic Options Fields */}
      <div className="space-y-2">
        <Label className="flex justify-between items-center">
          <span>Answer Options</span>
          <span className="text-xs text-muted-foreground font-mono">{fields.length}/10</span>
        </Label>

        {fields.map((field, index) => (
          <div key={field.id} className="space-y-1">
            <div className="flex items-center gap-2">
              <Input
                {...form.register(`options.${index}.text` as const)}
                placeholder={`Option ${index + 1}`}
                className="bg-muted/50 border-input focus-visible:ring-ring flex-1"
              />
              {fields.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            {form.formState.errors.options?.[index] && (
              <p className="text-xs text-destructive">{form.formState.errors.options[index]?.message}</p>
            )}
          </div>
        ))}

        {fields.length < 10 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ text: "" })}
            className="mt-2 border-dashed border-border hover:border-primary text-muted-foreground hover:text-foreground bg-transparent gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Option
          </Button>
        )}
      </div>

      {/* Expiry At Date Time Input block */}
      <div className="space-y-2">
        <Label>
          <span>Poll Expiration Date</span>
        </Label>
        <Input
          type="datetime-local"
          {...form.register("expiresAt")}
          className="bg-muted/50 border-input focus-visible:ring-ring"
        />
        {form.formState.errors.expiresAt && (
          <p className="text-xs text-destructive">{form.formState.errors.expiresAt.message}</p>
        )}
      </div>

      <hr className="border-border" />

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={form.formState.isSubmitting || pending}
        className="w-full"
      >
        <Layers3 className="w-4 h-4" />
        {pending ? "Deploying Pipeline..." : "Launch Live Poll"}
      </Button>
    </form>
  );
}