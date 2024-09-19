// ** Library
import { z } from "zod";

export const LoginFormSchema = z.object({
  username: z.string().min(2).max(255),
  password: z.string().min(8),
  rememberMe: z.boolean(),
});

export const ProfileFormSchema = z.object({
  group: z.string(),
  email: z.string().email(),
  phone: z
    .string()
    .nullable()
    .refine((value) => value === null || /^[0-9]+$/.test(value), {
      message: "Invalid phone number format",
    }),
  dateOfBirth: z.string().nullable(),
  gender: z.string().optional(),
  createdDate: z.string(),
  fullName: z.string().min(2).max(255),
  username: z.string().min(2).max(255),
  address: z
    .object({
      number: z.string(),
      street: z.string(),
      ward: z.string(),
      district: z.string(),
      city: z.string(),
    })
    .nullable(),
});

export const EmployeeDetailFormSchema = z.object({
  group: z.string(),
  email: z.string().email(),
  phone: z
    .string()
    .nullable()
    .refine((value) => value === null || /^[0-9]+$/.test(value), {
      message: "Invalid phone number format",
    }),
  dateOfBirth: z.string().nullable(),
  fullName: z.string().min(2).max(255),
  address: z.object({
    number: z.string(),
    street: z.string(),
    ward: z.string(),
    district: z.string(),
    city: z.string(),
  }),
  // status: z.boolean(),
});
