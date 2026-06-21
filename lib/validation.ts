import { z } from "zod";

export const formSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters.")
    .max(40, "Name must be at most 40 characters.").regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  email: z.email({ error: "Invalid email address" }),
  phone: z
      .string()
      .min(10, "Phone number must be at least 10 characters.")
      .max(20, "Phone number must be at most 20 characters."),
});
