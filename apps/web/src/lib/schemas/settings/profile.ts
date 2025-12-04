import { z } from "zod";
import { authClient } from "@/lib/auth-client";

// Full name validation
export const ProfileNameSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),
});

// Username format validation (synchronous) - used for quick format checks
export const ProfileUsernameFormatSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(
    /^[a-z0-9_-]+$/,
    "Username can only contain lowercase letters, numbers, underscores, and hyphens"
  );

// Username validation with async uniqueness check
export const ProfileUsernameSchema = z.object({
  username: ProfileUsernameFormatSchema.refine(
    async (username) => {
      try {
        const { data: response, error } = await authClient.isUsernameAvailable({
          username,
        });

        if (error) {
          return false;
        }

        return response?.available === true;
      } catch {
        // If check fails, assume available to not block user
        return true;
      }
    },
    {
      message: "This username is already taken",
    }
  ),
});

// Email validation
export const ProfileEmailSchema = z.object({
  email: z.email("Invalid email address").min(1, "Email is required"),
});

// Profile image validation
export const ProfileImageSchema = z.object({
  image: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "File size must be under 5MB"
    )
    .refine(
      (file) => !file || file.type.startsWith("image/"),
      "File must be an image"
    )
    .refine(
      (file) =>
        !file ||
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        ),
      "Only JPEG, PNG, and WebP images are allowed"
    ),
});
