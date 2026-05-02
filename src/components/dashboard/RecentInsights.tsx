import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { AiInsight } from "@/types";

interface Props {
  insights: AiInsight[];
}

const impactColors: Record<string, string> = {
  High: "text-red-400 bg-red-500/10 border-red-500/20",
  Medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  Low: "text-green-400 bg-green-500/10 border-green-500/20",
};

export default function RecentInsights({ insights }: Props) {
  if (insights.length === 0) {
    return (
      <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-4">AI Insights</h2>
        <div className="text-center py-8">
          <p className="text-4xl mb-3">🤖</p>
          <p className="text-gray-400 text-sm">No insights yet</p>
          <p className="text-gray-600 text-xs mt-1">
            Set up your credit profile and run an AI analysis
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-white">Recent AI Insights</h2>
        <Link
          href="/dashboard/insights"
          className="text-xs text-indigo-400 hover:text-indigo-300"
        >
          View all →
        </Link>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`border rounded-xl p-4 ${!insight.isRead ? "border-indigo-500/20 bg-indigo-500/5" : "border-[#2a2a3a]"}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {!insight.isRead && (
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full shrink-0" />
                  )}
                  <p className="text-sm font-medium text-white truncate">{insight.title}</p>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2">{insight.content}</p>
                <p className="text-xs text-gray-600 mt-2">{formatDate(insight.createdAt)}</p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${impactColors[insight.impact] ?? "text-gray-400"}`}
              >
                {insight.impact}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
