// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  // Add this to prevent static generation errors with context providers
  runtime: 'nodejs'
};

console.log("✅ Next.js is loading the config file...");

module.exports = nextConfig;