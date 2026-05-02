import { formatCurrency } from "@/lib/utils";

interface Props {
  totalAccounts: number;
  activeGoals: number;
  unreadInsights: number;
  totalDebt: number;
}

export default function StatsRow({ totalAccounts, activeGoals, unreadInsights, totalDebt }: Props) {
  const stats = [
    { label: "Active Accounts", value: totalAccounts, icon: "💳", color: "text-blue-400" },
    { label: "Active Goals", value: activeGoals, icon: "🎯", color: "text-green-400" },
    { label: "New Insights", value: unreadInsights, icon: "🤖", color: "text-indigo-400" },
    { label: "Total Debt", value: formatCurrency(totalDebt), icon: "📉", color: "text-orange-400" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl">{s.icon}</span>
          </div>
          <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          <p className="text-gray-500 text-xs mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
