/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["images.pexels.com"],
    unoptimized: true,
  },
  // Remove output: 'export' as it's not needed for Vercel deployment
  // and can cause issues with API routes
};

module.exports = nextConfig;
