/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["images.pexels.com"],
  },
  output: process.env.VERCEL ? "standalone" : undefined,
};

module.exports = nextConfig;
