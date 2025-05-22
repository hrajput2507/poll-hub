/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["images.pexels.com"],
    unoptimized: true,
  },
  // Enable server-side features
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
