"use client";

import { useState } from "react";
import type { FinancialGoal } from "@/types";

interface Props {
  initialData: FinancialGoal | null;
  onSaved: (goal: FinancialGoal) => void;
  onCancel: () => void;
}

export default function GoalForm({ initialData, onSaved, onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    targetScore: initialData?.targetScore ?? 750,
    targetDate: initialData?.targetDate
      ? new Date(initialData.targetDate).toISOString().split("T")[0]
      : "",
    priority: initialData?.priority ?? "MEDIUM",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = initialData ? `/api/goals/${initialData.id}` : "/api/goals";
    const method = initialData ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        targetScore: Number(form.targetScore),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      setError(data.error || "Failed to save goal");
      return;
    }

    onSaved(data.data);
  }

  return (
    <div className="bg-[#1a1a24] border border-indigo-500/20 rounded-2xl p-6">
      <h3 className="font-semibold text-white mb-5">
        {initialData ? "Edit Goal" : "New Goal"}
      </h3>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Goal Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-[#0f0f13] border border-[#2a2a3a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
            placeholder="e.g. Reach 750 credit score by year end"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Description (optional)</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full bg-[#0f0f13] border border-[#2a2a3a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
            placeholder="What steps will you take?"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Target Score</label>
            <input
              type="number"
              min={300}
              max={850}
              required
              value={form.targetScore}
              onChange={(e) => setForm({ ...form, targetScore: Number(e.target.value) })}
              className="w-full bg-[#0f0f13] border border-[#2a2a3a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Target Date</label>
            <input
              type="date"
              required
              value={form.targetDate}
              onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
              className="w-full bg-[#0f0f13] border border-[#2a2a3a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Priority</label>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as FinancialGoal["priority"] })}
              className="w-full bg-[#0f0f13] border border-[#2a2a3a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-medium px-6 py-2.5 rounded-lg"
          >
            {loading ? "Saving..." : initialData ? "Update Goal" : "Create Goal"}
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
