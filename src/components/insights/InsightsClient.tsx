"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import type { AiInsight } from "@/types";

interface Props {
  initialInsights: AiInsight[];
  hasProfile: boolean;
}

const insightTypeIcons: Record<string, string> = {
  SCORE_IMPROVEMENT: "📈",
  DEBT_REDUCTION: "📉",
  CREDIT_UTILIZATION: "💳",
  PAYMENT_REMINDER: "⏰",
  GENERAL_ADVICE: "💡",
};

const impactColors: Record<string, string> = {
  High: "text-red-400 bg-red-500/10 border-red-500/20",
  Medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  Low: "text-green-400 bg-green-500/10 border-green-500/20",
};

export default function InsightsClient({ initialInsights, hasProfile }: Props) {
  const router = useRouter();
  const [insights, setInsights] = useState(initialInsights);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  async function runAnalysis() {
    setError("");
    setAnalyzing(true);

    const res = await fetch("/api/ai/analyze", { method: "POST" });
    const data = await res.json();

    setAnalyzing(false);

    if (!data.success) {
      setError(data.error || "Analysis failed");
      return;
    }

    // prepend new insights
    setInsights((prev) => [...data.data, ...prev]);
    router.refresh();
  }

  async function markAllRead() {
    await fetch("/api/ai/insights", { method: "PATCH" });
    setInsights((prev) => prev.map((i) => ({ ...i, isRead: true })));
  }

  const unreadCount = insights.filter((i) => !i.isRead).length;

  return (
    <div className="space-y-4">
      {/* action bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          {!hasProfile && (
            <p className="text-sm text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-lg">
              Set up your credit profile first to run AI analysis
            </p>
          )}
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-sm text-gray-400 hover:text-white border border-[#2a2a3a] px-4 py-2 rounded-lg"
            >
              Mark all read ({unreadCount})
            </button>
          )}
        </div>

        <button
          onClick={runAnalysis}
          disabled={analyzing || !hasProfile}
          className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-lg flex items-center gap-2"
        >
          {analyzing ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            "🤖 Run AI Analysis"
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {insights.length === 0 ? (
        <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-2xl p-16 text-center">
          <p className="text-5xl mb-4">🤖</p>
          <p className="text-white font-semibold text-lg">No insights yet</p>
          <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">
            Click &quot;Run AI Analysis&quot; to get personalized credit improvement
            recommendations based on your financial data.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`bg-[#1a1a24] border rounded-2xl p-6 ${
                !insight.isRead
                  ? "border-indigo-500/30"
                  : "border-[#2a2a3a]"
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {insightTypeIcons[insight.type] ?? "💡"}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      {!insight.isRead && (
                        <span className="w-2 h-2 bg-indigo-400 rounded-full" />
                      )}
                      <h3 className="font-semibold text-white">{insight.title}</h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatDate(insight.createdAt)}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full border shrink-0 ${
                    impactColors[insight.impact] ?? "text-gray-400"
                  }`}
                >
                  {insight.impact} impact
                </span>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                {insight.content}
              </p>

              {insight.actionItems.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Action Steps
                  </p>
                  <ul className="space-y-1.5">
                    {insight.actionItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-indigo-400 mt-0.5 shrink-0">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
