"use client";

import { useEffect } from "react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

// catches any unhandled errors in the dashboard and shows a fallback
export default function DashboardError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="text-4xl mb-4">⚠️</p>
      <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
      <p className="text-gray-400 text-sm mb-6 max-w-sm">
        {error.message || "An unexpected error occurred. Try refreshing the page."}
      </p>
      <button
        onClick={reset}
        className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-6 py-2.5 rounded-lg font-medium"
      >
        Try again
      </button>
    </div>
  );
}
