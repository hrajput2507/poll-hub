/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["images.pexels.com"],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["@supabase/supabase-js"],
  },
};

module.exports = nextConfig;
