// ** Library
import { z } from "zod";

export const profileFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "FullName must be at least 2 characters long")
    .max(255, "FullName must be at most 255 characters long"),

  email: z
    .string()
    .email("Invalid email address")
    .min(5, "Email must be at least 5 characters long")
    .max(100, "Email must be at most 100 characters long")
    .trim()
    .toLowerCase(),

  phone: z
    .string()
    .nullable()
    .transform((value) => (value ? value.trim() : null))
    .refine(
      (value) =>
        /^(0[9|8|7|3|5|4][0-9]{8}|(0[1-9]{1}[0-9]{8}))$/.test(value ?? ""),
      {
        message: "Invalid phone number format (VietNamese country format)",
      },
    )
    .optional(),

  group: z.string().min(1, "Required"),
  username: z
    .string()
    .min(2, "userName must be at least 2 characters long")
    .max(255, "userName must be at most 255 characters long")
    .trim(),

  gender: z
    .enum(["Male", "Female", "Other"], {
      errorMap: () => ({ message: "Please select a valid gender" }),
    })
    .optional(), // draft option

  dateOfBirth: z.coerce
    .date({
      errorMap: () => ({ message: "Please enter a valid date of birth" }),
    })
    .max(new Date(), "Date of birth cannot be in the future")
    .optional(),

  createdDate: z.coerce.date({
    errorMap: () => ({ message: "Please enter a valid creation date" }),
  }),

  address: z
    .object({
      number: z.string().trim().optional(),
      street: z.string().trim().optional(),
      ward: z.string().trim().optional(),
      district: z.string().trim().optional(),
      city: z.string().trim().optional(),
    })
    .nullable(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
