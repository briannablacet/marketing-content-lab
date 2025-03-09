/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    
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
    
    // This ensures we use Server-Side Rendering for pages with context
    // Rather than trying to pre-render them statically at build time
    images: {
      domains: [],
    },
    
    // Increase timeout for static generation (if any is used)
    staticPageGenerationTimeout: 180,
  }
  
  module.exports = nextConfig