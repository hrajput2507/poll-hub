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
  },
  // middleware: true,
};

module.exports = nextConfig;
