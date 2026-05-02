"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      setError(data.error || "Registration failed");
      return;
    }

    // redirect to login after successful registration
    router.push("/login?registered=true");
  }

  return (
    <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-lg font-bold mx-auto mb-4">
            CW
          </div>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-gray-400 mt-1 text-sm">Start tracking your credit health today</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#1a1a24] border border-[#2a2a3a] rounded-2xl p-8 space-y-5"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-1.5" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-[#0f0f13] border border-[#2a2a3a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-gray-600"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-[#0f0f13] border border-[#2a2a3a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-gray-600"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-[#0f0f13] border border-[#2a2a3a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-gray-600"
              placeholder="Min 8 chars, 1 uppercase, 1 number"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg text-sm"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
