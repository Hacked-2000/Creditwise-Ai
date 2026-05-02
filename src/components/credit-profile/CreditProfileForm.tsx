"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CreditProfile } from "@/types";

interface Props {
  initialData: CreditProfile | null;
}

const factorFields = [
  {
    key: "paymentHistory",
    label: "Payment History",
    desc: "How consistently you pay bills on time (35% of score)",
  },
  {
    key: "creditUtilization",
    label: "Credit Utilization",
    desc: "How much of your available credit you're using (30% of score)",
  },
  {
    key: "creditAge",
    label: "Credit Age",
    desc: "Average age of your credit accounts (15% of score)",
  },
  {
    key: "creditMix",
    label: "Credit Mix",
    desc: "Variety of credit types you have (10% of score)",
  },
  {
    key: "newInquiries",
    label: "New Inquiries",
    desc: "Recent hard credit checks (10% of score)",
  },
];

export default function CreditProfileForm({ initialData }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    creditScore: initialData?.creditScore ?? 650,
    paymentHistory: initialData?.paymentHistory ?? 70,
    creditUtilization: initialData?.creditUtilization ?? 60,
    creditAge: initialData?.creditAge ?? 50,
    creditMix: initialData?.creditMix ?? 50,
    newInquiries: initialData?.newInquiries ?? 80,
    totalDebt: initialData?.totalDebt ?? 0,
    totalCredit: initialData?.totalCredit ?? 0,
    monthlyIncome: initialData?.monthlyIncome ?? 0,
  });

  function handleChange(key: string, value: number) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const method = initialData ? "PUT" : "POST";
    const res = await fetch("/api/credit-profile", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      setError(data.error || "Failed to save profile");
      return;
    }

    setSuccess("Credit profile saved successfully!");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* credit score */}
      <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-4">Overall Credit Score</h2>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <input
              type="range"
              min={300}
              max={850}
              value={form.creditScore}
              onChange={(e) => handleChange("creditScore", Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>300 (Poor)</span>
              <span>850 (Exceptional)</span>
            </div>
          </div>
          <div className="text-center">
            <input
              type="number"
              min={300}
              max={850}
              value={form.creditScore}
              onChange={(e) => handleChange("creditScore", Number(e.target.value))}
              className="w-20 bg-[#0f0f13] border border-[#2a2a3a] rounded-lg px-2 py-1.5 text-center text-white text-lg font-bold focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* credit factors */}
      <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-5">Credit Factors (0–100)</h2>
        <div className="space-y-5">
          {factorFields.map((f) => (
            <div key={f.key}>
              <div className="flex justify-between items-center mb-1.5">
                <div>
                  <p className="text-sm font-medium text-white">{f.label}</p>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
                <span className="text-sm font-semibold text-indigo-400 w-10 text-right">
                  {form[f.key as keyof typeof form]}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={form[f.key as keyof typeof form] as number}
                onChange={(e) => handleChange(f.key, Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* financial details */}
      <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-5">Financial Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { key: "totalDebt", label: "Total Debt (₹)" },
            { key: "totalCredit", label: "Total Credit Available (₹)" },
            { key: "monthlyIncome", label: "Monthly Income (₹)" },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-sm text-gray-400 mb-1.5">{f.label}</label>
              <input
                type="number"
                min={0}
                value={form[f.key as keyof typeof form] as number}
                onChange={(e) => handleChange(f.key, Number(e.target.value))}
                className="w-full bg-[#0f0f13] border border-[#2a2a3a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                placeholder="0"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-medium px-8 py-2.5 rounded-lg text-sm"
      >
        {loading ? "Saving..." : initialData ? "Update Profile" : "Save Profile"}
      </button>
    </form>
  );
}
