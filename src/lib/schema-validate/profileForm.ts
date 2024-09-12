// ** Library
import { z } from "zod";

export const ProfileFormSchema = z.object({
  fullName: z.string().min(2).max(255),
  username: z.string().min(2).max(255),
  email: z.string().min(2).max(255),
});

export type ProfileFormSchema = z.infer<typeof ProfileFormSchema>;
