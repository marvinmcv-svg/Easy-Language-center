import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-hostable standalone server output (.next/standalone/server.js).
  output: "standalone",
  reactStrictMode: false,
  // Cross-origin dev origins allowed to reach the dev server.
  allowedDevOrigins: ["localhost", "127.0.0.1"],
};

export default nextConfig;
