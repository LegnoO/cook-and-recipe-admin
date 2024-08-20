// ** Library
import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.string().min(2).max(255),
  password: z.string().min(8),
});

export type LoginFormData = z.infer<typeof LoginFormSchema>;
