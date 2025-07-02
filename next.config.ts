import type { NextConfig } from 'next';

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
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons']
  },
  
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

export default nextConfig;