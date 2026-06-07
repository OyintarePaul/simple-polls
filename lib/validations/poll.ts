// lib/validations/poll.ts
import { z } from "zod";

export const pollFormSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters long.").max(200),
  options: z
    .array(
      z.object({
        text: z.string().min(1, "Option text cannot be empty."), // 👈 Matches your database 'text' key
      })
    )
    .min(2, "You must provide at least 2 options.")
    .max(10, "Maximum of 10 options allowed."),
});

export type PollFormValues = z.infer<typeof pollFormSchema>;