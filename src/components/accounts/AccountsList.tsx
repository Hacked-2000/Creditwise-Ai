"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency, formatDate, calcUtilization } from "@/lib/utils";
import type { FinancialAccount } from "@/types";
import AccountForm from "./AccountForm";

interface Props {
  initialAccounts: FinancialAccount[];
}

const accountTypeLabels: Record<string, string> = {
  CREDIT_CARD: "Credit Card",
  PERSONAL_LOAN: "Personal Loan",
  AUTO_LOAN: "Auto Loan",
  MORTGAGE: "Mortgage",
  STUDENT_LOAN: "Student Loan",
  SAVINGS: "Savings",
  CHECKING: "Checking",
};

const accountTypeIcons: Record<string, string> = {
  CREDIT_CARD: "💳",
  PERSONAL_LOAN: "💰",
  AUTO_LOAN: "🚗",
  MORTGAGE: "🏠",
  STUDENT_LOAN: "🎓",
  SAVINGS: "🏦",
  CHECKING: "🏧",
};

export default function AccountsList({ initialAccounts }: Props) {
  const router = useRouter();
  const [accounts, setAccounts] = useState(initialAccounts);
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<FinancialAccount | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Remove this account?")) return;
    setDeletingId(id);

    const res = await fetch(`/api/accounts/${id}`, { method: "DELETE" });
    const data = await res.json();

    setDeletingId(null);
    if (data.success) {
      setAccounts((prev) => prev.filter((a) => a.id !== id));
      router.refresh();
    }
  }

  function handleSaved(account: FinancialAccount) {
    if (editingAccount) {
      setAccounts((prev) => prev.map((a) => (a.id === account.id ? account : a)));
    } else {
      setAccounts((prev) => [account, ...prev]);
    }
    setShowForm(false);
    setEditingAccount(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => {
            setEditingAccount(null);
            setShowForm(true);
          }}
          className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg font-medium"
        >
          + Add Account
        </button>
      </div>

      {(showForm || editingAccount) && (
        <AccountForm
          initialData={editingAccount}
          onSaved={handleSaved}
          onCancel={() => {
            setShowForm(false);
            setEditingAccount(null);
          }}
        />
      )}

      {accounts.length === 0 ? (
        <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-2xl p-12 text-center">
          <p className="text-4xl mb-3">💳</p>
          <p className="text-white font-medium">No accounts added yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Add your credit cards and loans to track utilization
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((account) => {
            const utilization =
              account.accountType === "CREDIT_CARD" && account.creditLimit
                ? calcUtilization(account.balance, account.creditLimit)
                : null;

            return (
              <div
                key={account.id}
                className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">
                      {accountTypeIcons[account.accountType] ?? "💰"}
                    </span>
                    <div>
                      <p className="font-medium text-white text-sm">{account.accountName}</p>
                      <p className="text-xs text-gray-500">{account.institution}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-[#0f0f13] border border-[#2a2a3a] px-2 py-0.5 rounded-full text-gray-400">
                    {accountTypeLabels[account.accountType]}
                  </span>
                </div>

                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Balance</span>
                    <span className="text-white font-medium">{formatCurrency(account.balance)}</span>
                  </div>
                  {account.creditLimit && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Credit Limit</span>
                      <span className="text-white">{formatCurrency(account.creditLimit)}</span>
                    </div>
                  )}
                  {account.interestRate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Interest Rate</span>
                      <span className="text-white">{account.interestRate}%</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Opened</span>
                    <span className="text-white">{formatDate(account.openedDate)}</span>
                  </div>
                </div>

                {utilization !== null && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Utilization</span>
                      <span className={utilization > 30 ? "text-orange-400" : "text-green-400"}>
                        {utilization}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#0f0f13] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${utilization > 30 ? "bg-orange-400" : "bg-green-400"}`}
                        style={{ width: `${Math.min(utilization, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingAccount(account);
                      setShowForm(false);
                    }}
                    className="flex-1 text-xs text-gray-400 hover:text-white border border-[#2a2a3a] hover:border-indigo-500/30 py-1.5 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(account.id)}
                    disabled={deletingId === account.id}
                    className="flex-1 text-xs text-red-400 hover:text-red-300 border border-[#2a2a3a] hover:border-red-500/30 py-1.5 rounded-lg disabled:opacity-50"
                  >
                    {deletingId === account.id ? "Removing..." : "Remove"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
