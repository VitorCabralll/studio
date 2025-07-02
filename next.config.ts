import type { NextConfig } from 'next';

// Bundle analyzer configuration
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Firebase App Hosting compatibility
  serverExternalPackages: ['firebase-admin'],
  
  // Images configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      'lucide-react', 
      '@radix-ui/react-icons',
      'framer-motion',
      'react-hook-form',
      '@hookform/resolvers',
      'zod',
      'clsx'
    ],
    webpackBuildWorker: true
  },
  
  // Build optimizations
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  
  // Cloud Workstation compatibility
  allowedDevOrigins: [
    'https://3000-firebase-studio-2-1751226604447.cluster-uf6urqn4lned4spwk4xorq6bpo.cloudworkstations.dev'
  ],
  
  // Webpack configuration to handle path aliases
  webpack: (config, { isServer }) => {
    // Ensure path aliases work in Firebase App Hosting
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };
    
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);