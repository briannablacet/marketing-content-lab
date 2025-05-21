/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': require('path').resolve(__dirname, 'src'),
        };
        return config;
    },
    // Enable static optimization for production
    swcMinify: true,
    // Configure image domains if you're using external images
    images: {
        domains: ['localhost'],
    },
}

module.exports = nextConfig 