/** @type {import('next').NextConfig} */
const nextConfig = {
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.ts$/,
      include: /scripts/,
      use: 'ignore-loader',
    });
    return config;
  },
};

module.exports = nextConfig;