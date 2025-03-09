/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    
    // Only process the index page for static generation
    // All other pages will be handled on demand with SSR
    async exportPathMap(defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
      return {
        '/': { page: '/' },
        // Do not include other routes for initial deployment
      }
    },
    
    // Increase timeout for page generation
    staticPageGenerationTimeout: 180,
    
    // Don't flush ISR cache to disk
    experimental: {
      isrFlushToDisk: false
    }
  }
  
  module.exports = nextConfig