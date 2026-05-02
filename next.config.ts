import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NextAuth needs the base URL to build redirect URLs correctly
  // In production this comes from the NEXTAUTH_URL env var set in Vercel
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "",
  },
};

export default nextConfig;
