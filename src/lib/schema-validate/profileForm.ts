// ** Library
import { z } from "zod";

export const ProfileFormSchema = z.object({
  group: z.string(),
  email: z.string(),
  dateOfBirth: z.string().nullable(),
  fullName: z.string().min(2).max(255),
  username: z.string().min(2).max(255),
});

export type ProfileFormSchema = z.infer<typeof ProfileFormSchema>;
