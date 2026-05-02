import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: "CreditWise AI — Your Credit Health Platform",
  description:
    "Track your credit score, manage financial accounts, set goals, and get AI-powered insights to improve your financial health.",
  keywords: ["credit score", "financial health", "AI advisor", "credit improvement"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
