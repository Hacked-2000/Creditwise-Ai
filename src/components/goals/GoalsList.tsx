"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import type { FinancialGoal } from "@/types";
import GoalForm from "./GoalForm";

interface Props {
  initialGoals: FinancialGoal[];
}

const statusColors: Record<string, string> = {
  IN_PROGRESS: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  COMPLETED: "text-green-400 bg-green-500/10 border-green-500/20",
  PAUSED: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  CANCELLED: "text-red-400 bg-red-500/10 border-red-500/20",
};

const statusLabels: Record<string, string> = {
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  PAUSED: "Paused",
  CANCELLED: "Cancelled",
};

const priorityColors: Record<string, string> = {
  HIGH: "text-red-400",
  MEDIUM: "text-yellow-400",
  LOW: "text-green-400",
};

export default function GoalsList({ initialGoals }: Props) {
  const router = useRouter();
  const [goals, setGoals] = useState(initialGoals);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this goal?")) return;
    setDeletingId(id);

    const res = await fetch(`/api/goals/${id}`, { method: "DELETE" });
    const data = await res.json();

    setDeletingId(null);
    if (data.success) {
      setGoals((prev) => prev.filter((g) => g.id !== id));
      router.refresh();
    }
  }

  async function handleStatusChange(id: string, status: string) {
    const res = await fetch(`/api/goals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) {
      setGoals((prev) => prev.map((g) => (g.id === id ? data.data : g)));
    }
  }

  function handleSaved(goal: FinancialGoal) {
    if (editingGoal) {
      setGoals((prev) => prev.map((g) => (g.id === goal.id ? goal : g)));
    } else {
      setGoals((prev) => [goal, ...prev]);
    }
    setShowForm(false);
    setEditingGoal(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => {
            setEditingGoal(null);
            setShowForm(true);
          }}
          className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg font-medium"
        >
          + New Goal
        </button>
      </div>

      {(showForm || editingGoal) && (
        <GoalForm
          initialData={editingGoal}
          onSaved={handleSaved}
          onCancel={() => {
            setShowForm(false);
            setEditingGoal(null);
          }}
        />
      )}

      {goals.length === 0 ? (
        <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-2xl p-12 text-center">
          <p className="text-4xl mb-3">🎯</p>
          <p className="text-white font-medium">No goals set yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Create a goal to start working toward a better credit score
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => {
            const progress =
              goal.targetScore > goal.currentScore
                ? Math.min(
                    Math.round(
                      ((goal.currentScore - 300) / (goal.targetScore - 300)) * 100
                    ),
                    100
                  )
                : 100;

            return (
              <div
                key={goal.id}
                className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-white">{goal.title}</p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[goal.status]}`}
                      >
                        {statusLabels[goal.status]}
                      </span>
                      <span className={`text-xs font-medium ${priorityColors[goal.priority]}`}>
                        {goal.priority} priority
                      </span>
                    </div>
                    {goal.description && (
                      <p className="text-sm text-gray-400 mt-1">{goal.description}</p>
                    )}
                  </div>
                </div>

                {/* score progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                    <span>
                      Current: <span className="text-white font-medium">{goal.currentScore}</span>
                    </span>
                    <span>
                      Target: <span className="text-indigo-400 font-medium">{goal.targetScore}</span>
                    </span>
                  </div>
                  <div className="h-2 bg-[#0f0f13] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {progress}% of the way there · Due {formatDate(goal.targetDate)}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {goal.status === "IN_PROGRESS" && (
                    <button
                      onClick={() => handleStatusChange(goal.id, "COMPLETED")}
                      className="text-xs text-green-400 border border-green-500/20 hover:bg-green-500/10 px-3 py-1.5 rounded-lg"
                    >
                      Mark complete
                    </button>
                  )}
                  {goal.status === "IN_PROGRESS" && (
                    <button
                      onClick={() => handleStatusChange(goal.id, "PAUSED")}
                      className="text-xs text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/10 px-3 py-1.5 rounded-lg"
                    >
                      Pause
                    </button>
                  )}
                  {goal.status === "PAUSED" && (
                    <button
                      onClick={() => handleStatusChange(goal.id, "IN_PROGRESS")}
                      className="text-xs text-blue-400 border border-blue-500/20 hover:bg-blue-500/10 px-3 py-1.5 rounded-lg"
                    >
                      Resume
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditingGoal(goal);
                      setShowForm(false);
                    }}
                    className="text-xs text-gray-400 hover:text-white border border-[#2a2a3a] px-3 py-1.5 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    disabled={deletingId === goal.id}
                    className="text-xs text-red-400 hover:text-red-300 border border-[#2a2a3a] hover:border-red-500/20 px-3 py-1.5 rounded-lg disabled:opacity-50"
                  >
                    {deletingId === goal.id ? "Deleting..." : "Delete"}
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
