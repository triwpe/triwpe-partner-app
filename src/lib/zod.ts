import { object, string } from "zod";

const hasLowerCase = new RegExp(/[a-z]/);

const hasUpperCase = new RegExp(/[A-Z]/);

const hasNumber = new RegExp(/[0-9]/);

const hasSpecialChar = new RegExp(/[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/);

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" }).min(
    1,
    "Password is required",
  ),
});

export const signUpSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters")
    .regex(hasLowerCase, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(hasUpperCase, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(hasNumber, { message: "Password must contain at least one number" })
    .regex(hasSpecialChar, {
      message: "Password must contain at least one special character",
    }),
});

export const forgotPasswordSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
});

export const confirmEmailOtpSchema = object({
  otp: string({ required_error: "OTP is required" })
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(new RegExp("^[0-9]*$"), {
      message: "OTP must contain only numbers",
    }),
});

export const updatePasswordSchema = object({
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters")
    .regex(hasLowerCase, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(hasUpperCase, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(hasNumber, { message: "Password must contain at least one number" })
    .regex(hasSpecialChar, {
      message: "Password must contain at least one special character",
    }),
});
