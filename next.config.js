/** @type {import('next').NextConfig} */
const nextConfig = {
  // Firebase App Hosting compatibility (Next.js 15+ feature, removed for 14.x)
  // serverExternalPackages: ['firebase-admin'],
  
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
  
  // Performance optimizations for Next.js 14.x
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
  },
  
  // Enhanced webpack configuration with clean bundle analysis
  webpack: (config, { dev, isServer, webpack }) => {
    // Path alias
    config.resolve.alias['@'] = require('path').resolve(__dirname, 'src');
    
    // Bundle analysis - clean implementation without hangs
    if (process.env.ANALYZE === 'true' && !isServer) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: '../bundle-analysis.html',
          generateStatsFile: true,
          statsFilename: '../bundle-stats.json',
          // Prevent hang issues
          analyzerHost: '127.0.0.1',
          analyzerPort: 'auto',
          logLevel: 'error'
        })
      );
    }
    
    // Performance optimizations
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            firebase: {
              test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
              name: 'firebase',
              chunks: 'all',
              priority: 10,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 5,
            },
          },
        },
      };
    }
    
    return config;
  },
  
  // Build optimizations
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  
  // Cloud Workstation compatibility
  allowedDevOrigins: [
    'https://3000-firebase-studio-2-1751226604447.cluster-uf6urqn4lned4spwk4xorq6bpo.cloudworkstations.dev'
  ],
};

module.exports = nextConfig;