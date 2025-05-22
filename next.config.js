/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["images.pexels.com"],
    unoptimized: true, // Only needed for `next export`
  },
  // Required for API routes & Supabase Realtime
  experimental: {
    serverComponentsExternalPackages: ["@supabase/supabase-js"],
    runtime: "experimental-edge",
  },
  // Enable if using middleware (e.g., auth)
  // middleware: true,
};

module.exports = nextConfig;
