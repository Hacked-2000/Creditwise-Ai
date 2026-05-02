"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/dashboard/credit-profile", label: "Credit Profile", icon: "📊" },
  { href: "/dashboard/accounts", label: "Accounts", icon: "💳" },
  { href: "/dashboard/goals", label: "Goals", icon: "🎯" },
  { href: "/dashboard/insights", label: "AI Insights", icon: "🤖" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = navItems.map((item) => {
    const isActive =
      item.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname.startsWith(item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
          isActive
            ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20"
            : "text-gray-400 hover:text-white hover:bg-white/5"
        }`}
      >
        <span className="text-base">{item.icon}</span>
        {item.label}
      </Link>
    );
  });

  return (
    <>
      {/* mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#1a1a24] border-b border-[#2a2a3a] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center text-xs font-bold text-white">
            CW
          </div>
          <span className="font-semibold text-white text-sm">CreditWise AI</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-gray-400 hover:text-white p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* mobile drawer */}
      <div
        className={`lg:hidden fixed top-14 left-0 bottom-0 z-40 w-60 bg-[#1a1a24] border-r border-[#2a2a3a] flex flex-col py-4 px-4 transform transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex-1 space-y-1">{navLinks}</nav>
        <p className="text-xs text-gray-600 px-2 pt-4 border-t border-[#2a2a3a]">CreditWise AI v1.0</p>
      </div>

      {/* desktop sidebar */}
      <aside className="hidden lg:flex w-60 bg-[#1a1a24] border-r border-[#2a2a3a] flex-col py-6 px-4 shrink-0">
        <div className="flex items-center gap-2.5 px-2 mb-8">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-xs font-bold text-white">
            CW
          </div>
          <span className="font-semibold text-white">CreditWise AI</span>
        </div>

        <nav className="flex-1 space-y-1">{navLinks}</nav>

        <div className="mt-auto px-2 pt-4 border-t border-[#2a2a3a]">
          <p className="text-xs text-gray-600">CreditWise AI v1.0</p>
        </div>
      </aside>
    </>
  );
}
