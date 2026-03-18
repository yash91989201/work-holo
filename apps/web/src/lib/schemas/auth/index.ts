import { z } from "zod";
import { authClient } from "@/lib/auth-client";

export const LogInFormSchema = z.object({
  identifier: z.string().nonempty("Email or username is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .nonempty("Password is required"),
  formState: z.object({
    showPassword: z.boolean(),
  }),
});

export const SignUpFormSchema = z
  .object({
    name: z.string().min(6, "Enter your full name."),
    username: z
      .string()
      .min(1, "Username is required")
      .min(4, "Minimum 4 characters")
      .max(40, "Maximum 40 characters")
      .regex(
        /^[a-z0-9]+(-[a-z0-9]+)*$/,
        "Only lowercase letters, numbers and - allowed"
      )
      .refine(
        async (username) => {
          if (username.length < 4) return true;

          try {
            const { data: result, error } =
              await authClient.isUsernameAvailable({
                username,
              });

            return !error && (result?.available ?? false);
          } catch {
            return false;
          }
        },
        {
          message: "Username already taken",
        }
      ),
    displayUsername: z.string().min(3, "Enter a display username"),
    email: z.email("Invalid email address").nonempty("Email is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .nonempty("Password is required"),
    confirmPassword: z.string().nonempty("Please confirm your password"),
    formState: z.object({
      showPassword: z.boolean(),
      showConfirmPassword: z.boolean(),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const AcceptInvitationFormSchema = z.object({
  email: z.email("Invalid email address").nonempty("Email is required"),
  name: z.string().min(1, "Name is required"),
  username: z
    .string()
    .min(1, "Username is required")
    .min(4, "Minimum 4 characters")
    .max(40, "Maximum 40 characters")
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Only lowercase letters, numbers and - allowed"
    )
    .refine(
      async (username) => {
        if (username.length < 4) return true;

        try {
          const { data: result, error } = await authClient.isUsernameAvailable({
            username,
          });

          return !error && (result?.available ?? false);
        } catch {
          return false;
        }
      },
      {
        message: "Username already taken",
      }
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .nonempty("Password is required"),
  invitationId: z.string().min(1, "Invitation ID is required"),
  formState: z.object({
    showPassword: z.boolean(),
  }),
});
