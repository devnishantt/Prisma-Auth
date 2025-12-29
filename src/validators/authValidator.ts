import z from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*?])[A-Za-z\d@#$%^&*?]/;

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const registerSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim(),

  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must not exceed 128 characters")
    .regex(
      passwordRegex,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  firstName: z
    .string({ message: "First name is required" })
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .trim(),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .trim()
    .optional()
    .nullable(),

  phone: z
    .string()
    .regex(phoneRegex, "Please provide a valid phone number")
    .optional()
    .nullable(),

  role: z
    .enum(["USER", "ADMIN"], {
      message: "Role must be either USER or ADMIN",
    })
    .optional()
    .default("USER"),
});

export const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim(),
  password: z.string({ message: "Password is required" }),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string({ message: "Current password is required" }),
  newPassword: z
    .string({ message: "New password is required" })
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must not exceed 128 characters")
    .regex(
      passwordRegex,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .trim()
    .optional(),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .trim()
    .optional()
    .nullable(),

  phone: z
    .string()
    .regex(phoneRegex, "Please provide a valid phone number")
    .optional()
    .nullable(),
});

export const deleteAccountSchema = z.object({
  password: z.string({ message: "Password is required for account deletion" }),
});
