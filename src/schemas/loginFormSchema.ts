import { z } from "zod";

export const loginFormSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters long")
    .max(255, "Username must be at most 255 characters long"),
  // .regex(
  //   /^[a-zA-Z0-9_-]+$/,
  //   "Username can only contain letters, numbers, underscores, and hyphens",
  // ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(255, "Password must be at most 255 characters long"),
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  // )
  rememberMe: z.boolean().default(false),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
