import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const session = await auth();

  // already logged in, go to dashboard
  if (session?.user) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-[#0f0f13] text-white">
      {/* nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a3a] max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-sm font-bold">
            CW
          </div>
          <span className="font-semibold text-lg">CreditWise AI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg font-medium"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-sm text-indigo-400 mb-8">
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
          AI-powered credit analysis
        </div>

        <h1 className="text-5xl font-bold leading-tight mb-6">
          Take control of your{" "}
          <span className="text-indigo-400">credit health</span>
        </h1>

        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          CreditWise AI helps you understand your credit score, track financial
          accounts, set improvement goals, and get personalized AI advice — all
          in one place.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold text-lg"
          >
            Start for free
          </Link>
          <Link
            href="/login"
            className="border border-[#2a2a3a] hover:border-indigo-500/50 text-gray-300 px-8 py-3 rounded-xl font-semibold text-lg"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "📊",
              title: "Credit Score Tracking",
              desc: "Monitor all credit factors — payment history, utilization, credit age, and more.",
            },
            {
              icon: "🤖",
              title: "AI-Powered Insights",
              desc: "Get personalized recommendations from Gemini AI based on your actual financial data.",
            },
            {
              icon: "🎯",
              title: "Goal Setting",
              desc: "Set credit score targets with deadlines and track your progress over time.",
            },
            {
              icon: "💳",
              title: "Account Management",
              desc: "Track all your credit cards, loans, and bank accounts in one dashboard.",
            },
            {
              icon: "🔒",
              title: "Secure & Private",
              desc: "JWT-based auth with encrypted passwords. Your data stays yours.",
            },
            {
              icon: "📈",
              title: "Debt Analysis",
              desc: "Understand your debt-to-income ratio and get strategies to reduce it.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-6 hover:border-indigo-500/30"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-[#2a2a3a] py-8 px-6 mt-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>
            © 2025 CreditWise AI · Built by{" "}
            <span className="text-gray-300 font-medium">Nishant Vashisth</span>
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Hacked-2000/Creditwise-Ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/nishant-vashisth-66445120b/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-gray-400 hover:text-[#0a66c2]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
