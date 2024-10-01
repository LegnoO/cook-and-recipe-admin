// ** Library
import { z } from "zod";

// ** Utils
import { removeWhiteSpace } from "./helpers";

// ** Common schemas
const fullNameSchema = z
  .string()
  .min(2, "FullName must be at least 2 characters long")
  .max(255, "FullName must be at most 255 characters long");

const usernameSchema = z
  .string()
  .min(2, "userName must be at least 2 characters long")
  .max(255, "userName must be at most 255 characters long");

const passwordSchema = z
  .string()
  .min(3, "Password must be at least 3 characters long")
  .max(255, "Password must be at most 255 characters long");

const emailSchema = z
  .string()
  .email("Invalid email address")
  .min(5, "Email must be at least 5 characters long")
  .max(100, "Email must be at most 100 characters long");

const groupSchema = z.string().min(1, "Required");

const phoneSchema = z
  .string()
  .nullable()
  .transform((value) => (value ? removeWhiteSpace(value) : null))
  .refine(
    (value) =>
      /^(0[9|8|7|3|5|4][0-9]{8}|(0[1-9]{1}[0-9]{8}))$/.test(value ?? ""),
    {
      message: "Invalid phone number format (VietNamese country format)",
    },
  );

const nullableDateSchema = z.coerce.date().optional();
const addressSchema = z
  .object({
    number: z.string(),
    street: z.string(),
    ward: z.string(),
    district: z.string(),
    city: z.string(),
  })
  .nullable();

const genderSchemaOptional = z.enum(["Male", "Female", "Other"]).optional();
const genderSchema = z.enum(["Male", "Female", "Other"]);

// ** Form schemas
export const LoginFormSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  rememberMe: z.boolean(),
});

export const ProfileFormSchema = z.object({
  fullName: fullNameSchema,
  email: emailSchema,
  phone: phoneSchema,
  group: z.string(),
  username: usernameSchema,
  gender: genderSchemaOptional,
  dateOfBirth: nullableDateSchema,
  createdDate: nullableDateSchema,
  address: addressSchema,
});

export const EmployeeUpdateFormSchema = z.object({
  fullName: fullNameSchema,
  address: addressSchema,
  email: emailSchema,
  dateOfBirth: nullableDateSchema,
  avatar: z.string(),
  gender: genderSchema,
  phone: phoneSchema,
  groupId: z.string(),
});

export const AddEmployeeSchema = z.object({
  fullName: fullNameSchema,
  password: passwordSchema,
  email: emailSchema,
  dateOfBirth: nullableDateSchema,
  address: addressSchema,
  gender: genderSchema,
  phone: phoneSchema,
  groupId: groupSchema,
});

// ** Types of form schemas
export type ILoginFormSchema = z.infer<typeof LoginFormSchema>;
export type IProfileFormSchema = z.infer<typeof ProfileFormSchema>;
export type IEmployeeUpdateFormSchema = z.infer<
  typeof EmployeeUpdateFormSchema
>;
