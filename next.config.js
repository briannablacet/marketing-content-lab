/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Set minimum time to generate page in ms (for debugging only)
    staticPageGenerationTimeout: 180,
    
    // Disable static generation for all pages except root
    // Allow them to be generated on-demand
    experimental: {
      // This will make Next.js generate pages on-demand instead of 
      // trying to generate all at build time
      isrFlushToDisk: false
    },
    
    // Optional: configure asset prefixes for CDN support
    // assetPrefix: process.env.NODE_ENV === 'production' ? 'https://cdn.yourdomain.com' : '',
    
    // Exclude specific files or folders from build
    excludeDefaultMomentLocales: true,
    
    // Only allow these specific pages to be prerendered at build time
    // All other pages will use fallback: blocking
    // (important for fixing context issues)
    async exportPathMap(defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
      return {
        '/': { page: '/' },
        // Add other static pages here if needed
      }
    },
  }
  
  module.exports = nextConfig