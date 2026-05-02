import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const creditProfileSchema = z.object({
  creditScore: z
    .number()
    .min(300, "Score must be at least 300")
    .max(850, "Score cannot exceed 850"),
  paymentHistory: z.number().min(0).max(100),
  creditUtilization: z.number().min(0).max(100),
  creditAge: z.number().min(0).max(100),
  creditMix: z.number().min(0).max(100),
  newInquiries: z.number().min(0).max(100),
  totalDebt: z.number().min(0),
  totalCredit: z.number().min(0),
  monthlyIncome: z.number().min(0),
});

export const financialAccountSchema = z.object({
  accountName: z.string().min(2, "Account name is required"),
  accountType: z.enum([
    "CREDIT_CARD",
    "PERSONAL_LOAN",
    "AUTO_LOAN",
    "MORTGAGE",
    "STUDENT_LOAN",
    "SAVINGS",
    "CHECKING",
  ]),
  institution: z.string().min(2, "Institution name is required"),
  balance: z.number().min(0),
  creditLimit: z.number().optional(),
  interestRate: z.number().optional(),
  openedDate: z.string(),
});

export const financialGoalSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  targetScore: z
    .number()
    .min(300)
    .max(850, "Target score cannot exceed 850"),
  targetDate: z.string(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreditProfileInput = z.infer<typeof creditProfileSchema>;
export type FinancialAccountInput = z.infer<typeof financialAccountSchema>;
export type FinancialGoalInput = z.infer<typeof financialGoalSchema>;
