// ** Library
import { z } from "zod";

// ** Utils
import { LoginFormSchema, ProfileFormSchema,EmployeeDetailFormSchema } from "@/utils/validations";

export type ILoginFormSchema = z.infer<typeof LoginFormSchema>;
export type IProfileFormSchema = z.infer<typeof ProfileFormSchema>;
export type IEmployeeDetailFormSchema = z.infer<typeof EmployeeDetailFormSchema>;