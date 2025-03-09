/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    
    // Disable experimental features for now
    experimental: {},
    
    // Increase the timeout for generating static pages
    staticPageGenerationTimeout: 180,
    
    // REMOVE REDIRECTS - They're causing a redirect loop
    // Instead, let's just have 404s for now
    
    // Only include the index page
    async exportPathMap(defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
      return {
        '/': { page: '/' },
      }
    },
    
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