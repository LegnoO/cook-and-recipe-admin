// ** Library Imports
import { z } from "zod";

export const pushNotifySchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .max(255, "Title must be at most 255 characters long"),

  message: z
    .string()
    .min(2, "Message must be at least 2 characters long")
    .max(255, "Message must be at most 255 characters long"),
});

export type PushNotifySchemaValues = z.infer<typeof pushNotifySchema>;
