"use client";

import { signOut } from "next-auth/react";

interface Props {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export default function TopBar({ user }: Props) {
  return (
    <header className="h-14 bg-[#1a1a24] border-b border-[#2a2a3a] flex items-center justify-between px-6 shrink-0">
      <div />

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">{user.email}</span>
        <div className="w-8 h-8 bg-indigo-500/20 border border-indigo-500/30 rounded-full flex items-center justify-center text-xs font-semibold text-indigo-400">
          {user.name?.charAt(0).toUpperCase() ?? "U"}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-sm text-gray-500 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/10"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
