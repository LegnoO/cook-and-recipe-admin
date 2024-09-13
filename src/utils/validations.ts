// ** Library
import { z } from "zod";

export const LoginFormSchema = z.object({
  username: z.string().min(2).max(255),
  password: z.string().min(8),
  rememberMe: z.boolean(),
});

export type LoginFormData = z.infer<typeof LoginFormSchema>;



export const ProfileFormSchema = z.object({
  group: z.string(),
  email: z.string(),
  dateOfBirth: z.string().nullable(),
  fullName: z.string().min(2).max(255),
  username: z.string().min(2).max(255),
});

export type ProfileFormSchema = z.infer<typeof ProfileFormSchema>;
