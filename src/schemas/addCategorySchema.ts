// ** Library
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const addCategorySchema = z.object({
  name: z
    .string()
    .min(4, "Name must be at least 4 characters long")
    .max(255, "Name must be at most 255 characters long"),

  description: z
    .string()
    .min(4, "Description  must be at least 4 characters long")
    .max(255, "Description  must be at most 255 characters long"),

  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported.",
    ),
});

export type AddCategoryValues = z.infer<typeof addCategorySchema>;
