/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    
    // No experimental features
    experimental: {},
    
    // Turn off typechecking during build for faster builds
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
    
    // Turn off ESLint during build
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
  }
  
  module.exports = nextConfig