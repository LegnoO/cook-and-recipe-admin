// ** Library
import { z } from "zod";

export const LoginFormSchema = z.object({
  username: z.string().min(2).max(255),
  password: z.string().min(8),
  rememberMe: z.boolean(),
});

export type LoginFormData = z.infer<typeof LoginFormSchema>;
