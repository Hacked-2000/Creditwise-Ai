"use client";

import { useState } from "react";
import type { FinancialAccount } from "@/types";

interface Props {
  initialData: FinancialAccount | null;
  onSaved: (account: FinancialAccount) => void;
  onCancel: () => void;
}

const accountTypes = [
  { value: "CREDIT_CARD", label: "Credit Card" },
  { value: "PERSONAL_LOAN", label: "Personal Loan" },
  { value: "AUTO_LOAN", label: "Auto Loan" },
  { value: "MORTGAGE", label: "Mortgage" },
  { value: "STUDENT_LOAN", label: "Student Loan" },
  { value: "SAVINGS", label: "Savings" },
  { value: "CHECKING", label: "Checking" },
];

export default function AccountForm({ initialData, onSaved, onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    accountName: initialData?.accountName ?? "",
    accountType: initialData?.accountType ?? "CREDIT_CARD",
    institution: initialData?.institution ?? "",
    balance: initialData?.balance ?? 0,
    creditLimit: initialData?.creditLimit ?? "",
    interestRate: initialData?.interestRate ?? "",
    openedDate: initialData?.openedDate
      ? new Date(initialData.openedDate).toISOString().split("T")[0]
      : "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      ...form,
      balance: Number(form.balance),
      creditLimit: form.creditLimit !== "" ? Number(form.creditLimit) : undefined,
      interestRate: form.interestRate !== "" ? Number(form.interestRate) : undefined,
    };

    const url = initialData ? `/api/accounts/${initialData.id}` : "/api/accounts";
    const method = initialData ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      setError(data.error || "Failed to save account");
      return;
    }

    onSaved(data.data);
  }

  const showCreditLimit = form.accountType === "CREDIT_CARD";

  return (
    <div className="bg-[#1a1a24] border border-indigo-500/20 rounded-2xl p-6">
      <h3 className="font-semibold text-white mb-5">
        {initialData ? "Edit Account" : "Add New Account"}
      </h3>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Account Name</label>
            <input
              required
              value={form.accountName}
              onChange={(e) => setForm({ ...form, accountName: e.target.value })}
              className="w-full bg-[#0f0f13] border border-[#2a2a3a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
              placeholder="e.g. HDFC Regalia"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Account Type</label>
            <select
              value={form.accountType}
              onChange={(e) => setForm({ ...form, accountType: e.target.value as FinancialAccount["accountType"] })}
              className="w-full bg-[#0f0f13] border border-[#2a2a3a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
            >
              {accountTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Institution / Bank</label>
            <input
              required
              value={form.institution}
              onChange={(e) => setForm({ ...form, institution: e.target.value })}
              className="w-full bg-[#0f0f13] border border-[#2a2a3a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
              placeholder="e.g. HDFC Bank"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Current Balance (₹)</label>
            <input
              type="number"
              min={0}
              required
              value={form.balance}
              onChange={(e) => setForm({ ...form, balance: Number(e.target.value) })}
              className="w-full bg-[#0f0f13] border border-[#2a2a3a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {showCreditLimit && (
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Credit Limit (₹)</label>
              <input
                type="number"
                min={0}
                value={form.creditLimit}
                onChange={(e) => setForm({ ...form, creditLimit: e.target.value })}
                className="w-full bg-[#0f0f13] border border-[#2a2a3a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Interest Rate (%)</label>
            <input
              type="number"
              min={0}
              step={0.1}
              value={form.interestRate}
              onChange={(e) => setForm({ ...form, interestRate: e.target.value })}
              className="w-full bg-[#0f0f13] border border-[#2a2a3a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Date Opened</label>
            <input
              type="date"
              required
              value={form.openedDate}
              onChange={(e) => setForm({ ...form, openedDate: e.target.value })}
              className="w-full bg-[#0f0f13] border border-[#2a2a3a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-medium px-6 py-2.5 rounded-lg"
          >
            {loading ? "Saving..." : initialData ? "Update" : "Add Account"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-white border border-[#2a2a3a] text-sm px-6 py-2.5 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
