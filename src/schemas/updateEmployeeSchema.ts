// ** Library
import { z } from "zod";

// ** Utils
import { removeSpace } from "@/utils/helpers";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const updateEmployeeSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters long")
    .max(255, "Full name must be at most 255 characters long")
    .regex(/^[a-zA-Z\s]+$/, "Full name should only contain letters and spaces"),

  email: z
    .string()
    .email("Invalid email address")
    .min(5, "Email must be at least 5 characters long")
    .max(100, "Email must be at most 100 characters long")
    .trim()
    .toLowerCase(),

  dateOfBirth: z.coerce
    .date({
      errorMap: () => ({ message: "Please enter a valid date of birth" }),
    })
    .max(new Date(), "Date of birth cannot be in the future")
    .optional(),

  address: z.object({
    number: z.string().trim().optional(),
    street: z.string().trim().optional(),
    ward: z.string().trim().optional(),
    district: z.string().trim().optional(),
    city: z.string().trim().optional(),
  }),

  gender: z.enum(["Male", "Female", "Other"], {
    errorMap: () => ({ message: "Please select a valid gender" }),
  }),

  phone: z
    .string()
    .refine(
      (value) => /^(0[2-9]{1}\d{8})$/.test(value ? removeSpace(value) : ""),
      {
        message: "Invalid phone number format (Vietnamese country format)",
      },
    ),

  groupId: z.string().min(1, "Group ID is required"),

  avatar: z.object({
    file: z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported.",
      )
      .optional(),
    url: z.string(),
  }),
});

export type UpdateEmployeeValues = z.infer<typeof updateEmployeeSchema>;
