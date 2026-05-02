import Link from "next/link";
import { getScoreColor, getScoreBgColor } from "@/lib/utils";
import type { CreditProfile } from "@/types";

interface Props {
  profile: CreditProfile | null;
}

export default function CreditScoreCard({ profile }: Props) {
  if (!profile) {
    return (
      <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center gap-4">
        <div className="text-4xl">📊</div>
        <div>
          <p className="text-white font-semibold">No credit profile yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Set up your credit profile to start tracking your score
          </p>
        </div>
        <Link
          href="/dashboard/credit-profile"
          className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-5 py-2 rounded-lg font-medium"
        >
          Set up profile
        </Link>
      </div>
    );
  }

  const factors = [
    { label: "Payment History", value: profile.paymentHistory, weight: "35%" },
    { label: "Credit Utilization", value: profile.creditUtilization, weight: "30%" },
    { label: "Credit Age", value: profile.creditAge, weight: "15%" },
    { label: "Credit Mix", value: profile.creditMix, weight: "10%" },
    { label: "New Inquiries", value: profile.newInquiries, weight: "10%" },
  ];

  return (
    <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-2xl p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-gray-400 text-sm">Credit Score</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-5xl font-bold ${getScoreColor(profile.creditScore)}`}>
              {profile.creditScore}
            </span>
            <span className="text-gray-500 text-sm">/ 850</span>
          </div>
          <span
            className={`inline-block mt-2 text-xs px-2.5 py-1 rounded-full font-medium ${getScoreBgColor(profile.creditScore)} text-white`}
          >
            {profile.scoreCategory}
          </span>
        </div>
        <Link
          href="/dashboard/credit-profile"
          className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 px-3 py-1.5 rounded-lg"
        >
          Update
        </Link>
      </div>

      {/* score factors */}
      <div className="space-y-3">
        {factors.map((f) => (
          <div key={f.label}>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{f.label}</span>
              <span className="text-gray-500">{f.value}/100 · {f.weight}</span>
            </div>
            <div className="h-1.5 bg-[#0f0f13] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${getScoreBgColor(f.value * 8.5)}`}
                style={{ width: `${f.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
