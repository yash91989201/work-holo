import { z } from "zod";

export const ContactFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  phone: z.string().min(6, "Please enter a valid phone number"),
  service: z.string().min(1, "Please select a service"),
  message: z.string().optional(),
});

export type ContactFormType = z.infer<typeof ContactFormSchema>;
