// ** Library
import { z } from "zod";

export const LoginFormSchema = z.object({
  username: z.string().min(2).max(255),
  password: z.string().min(8),
  rememberMe: z.boolean(),
});

export const ProfileFormSchema = z.object({
  group: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  dateOfBirth: z.string().nullable(),
  fullName: z.string().min(2).max(255),
  username: z.string().min(2).max(255),
  number: z.string(),
  street: z.string(),
  ward: z.string(),
  district: z.string(),
  city: z.string(),
});
