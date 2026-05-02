import Link from "next/link";

interface Props {
  hasProfile: boolean;
}

export default function QuickActions({ hasProfile }: Props) {
  const actions = [
    {
      href: "/dashboard/credit-profile",
      label: hasProfile ? "Update Credit Profile" : "Set Up Credit Profile",
      icon: "📊",
      desc: "Keep your score data current",
    },
    {
      href: "/dashboard/accounts",
      label: "Add Account",
      icon: "💳",
      desc: "Track a new financial account",
    },
    {
      href: "/dashboard/goals",
      label: "Set a Goal",
      icon: "🎯",
      desc: "Define your next credit target",
    },
    {
      href: "/dashboard/insights",
      label: "Run AI Analysis",
      icon: "🤖",
      desc: "Get personalized recommendations",
    },
  ];

  return (
    <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-2xl p-6 h-full">
      <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
      <div className="space-y-2">
        {actions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-[#2a2a3a] group"
          >
            <span className="text-xl">{a.icon}</span>
            <div>
              <p className="text-sm font-medium text-white group-hover:text-indigo-400">
                {a.label}
              </p>
              <p className="text-xs text-gray-500">{a.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
