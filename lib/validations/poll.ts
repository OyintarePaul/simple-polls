import { z } from "zod";

export const createPollSchema = z.object({
  question: z.string().min(3, "Question should be at least 3 characters").trim(),
  options: z.array(
    z.object({
      text: z.string().min(1, "Option cannot be empty").trim()
    })
  ).min(2, "You must provide at least 2 options"),
  expiresAt: z
    .string()
    .min(1, "Please set an expiration date")
    .refine((val) => {
      const selectedDate = new Date(val).getTime();
      const minDate = Date.now() + 60 * 60 * 1000; // Current time + 1 hour
      return selectedDate >= minDate;
    }, {
      message: "Expiration must be at least 1 hour from now",
    }),
});

export type CreatePollData = z.infer<typeof createPollSchema>;