// ** Library
import { z } from "zod";

// ** Utils
import {
  LoginFormSchema,
  ProfileFormSchema,
  EmployeeDetailFormSchema,
} from "@/utils/validations";

type ILoginFormSchema = z.infer<typeof LoginFormSchema>;
type IProfileFormSchema = z.infer<typeof ProfileFormSchema>;
type IEmployeeDetailFormSchema = z.infer<typeof EmployeeDetailFormSchema>;
