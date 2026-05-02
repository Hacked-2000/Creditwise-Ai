// simple cn utility — no extra deps needed
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

// maps a credit score number to a human-readable category
export function getCreditScoreCategory(score: number): string {
  if (score >= 800) return "Exceptional";
  if (score >= 740) return "Very Good";
  if (score >= 670) return "Good";
  if (score >= 580) return "Fair";
  return "Poor";
}

// returns a tailwind color class based on score category
export function getScoreColor(score: number): string {
  if (score >= 800) return "text-emerald-500";
  if (score >= 740) return "text-green-500";
  if (score >= 670) return "text-yellow-500";
  if (score >= 580) return "text-orange-500";
  return "text-red-500";
}

export function getScoreBgColor(score: number): string {
  if (score >= 800) return "bg-emerald-500";
  if (score >= 740) return "bg-green-500";
  if (score >= 670) return "bg-yellow-500";
  if (score >= 580) return "bg-orange-500";
  return "bg-red-500";
}

// formats a number as currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// calculates credit utilization percentage
export function calcUtilization(balance: number, limit: number): number {
  if (limit === 0) return 0;
  return Math.round((balance / limit) * 100);
}

// simple date formatter
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
