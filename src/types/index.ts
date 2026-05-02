// Shared types used across the app

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role: "USER" | "ADMIN";
  createdAt: Date;
}

export interface CreditProfile {
  id: string;
  userId: string;
  creditScore: number;
  scoreCategory: string;
  paymentHistory: number;
  creditUtilization: number;
  creditAge: number;
  creditMix: number;
  newInquiries: number;
  totalDebt: number;
  totalCredit: number;
  monthlyIncome: number;
  lastUpdated: Date;
}

export interface FinancialAccount {
  id: string;
  userId: string;
  accountName: string;
  accountType: AccountType;
  institution: string;
  balance: number;
  creditLimit?: number | null;
  interestRate?: number | null;
  isActive: boolean;
  openedDate: Date;
  createdAt: Date;
}

export type AccountType =
  | "CREDIT_CARD"
  | "PERSONAL_LOAN"
  | "AUTO_LOAN"
  | "MORTGAGE"
  | "STUDENT_LOAN"
  | "SAVINGS"
  | "CHECKING";

export interface FinancialGoal {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  targetScore: number;
  currentScore: number;
  targetDate: Date;
  status: GoalStatus;
  priority: Priority;
  createdAt: Date;
}

export type GoalStatus = "IN_PROGRESS" | "COMPLETED" | "PAUSED" | "CANCELLED";
export type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface AiInsight {
  id: string;
  userId: string;
  type: InsightType;
  title: string;
  content: string;
  actionItems: string[];
  impact: string;
  isRead: boolean;
  createdAt: Date;
}

export type InsightType =
  | "SCORE_IMPROVEMENT"
  | "DEBT_REDUCTION"
  | "CREDIT_UTILIZATION"
  | "PAYMENT_REMINDER"
  | "GENERAL_ADVICE";

// dashboard summary type
export interface DashboardData {
  creditProfile: CreditProfile | null;
  accounts: FinancialAccount[];
  goals: FinancialGoal[];
  recentInsights: AiInsight[];
  totalAccounts: number;
  activeGoals: number;
}
