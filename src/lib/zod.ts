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

export const updateGuideSchema = object({
  title: string({ required_error: "Title is required" })
    .min(1, "Title is required")
    .max(50, "Title must be less than 50 characters"),  
  duration: string()
    .regex(/^(?:[1-9][0-9]?|99)$/, "Duration must be a number between 1 and 99")
    .optional(),
  price: string()
    .regex(/^\d+(\.\d{1,2})?$/, "Price must be in currency format")
    .optional(),
});

export const createNewGuideSectionSchema = object({
  menuTitle: string({ required_error: "Menu title is required" })
    .min(1, "Menu title is required")
    .max(20, "Menu title must be less than 20 characters"),
  fullTitle: string({ required_error: "Full title is required" })
    .min(1, "Full title is required")
    .max(50, "Full title must be less than 50 characters")
});

export const updateGuideSectionSchema = object({
  menuTitle: string({ required_error: "Menu title is required" })
    .min(1, "Menu title is required")
    .max(20, "Menu title must be less than 20 characters"),
  fullTitle: string({ required_error: "Full title is required" })
    .min(1, "Full title is required")
    .max(50, "Full title must be less than 50 characters")
});

export const createNewSectionItemSchema = object({
  description: string({ required_error: "Description is required" })
    .min(1, "Description is required"),
});

export const updateSectionItemSchema = object({
  description: string({ required_error: "Description is required" })
    .min(1, "Description is required"),
});