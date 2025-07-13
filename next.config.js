/** @type {import('next').NextConfig} */
const nextConfig = {
  // Firebase App Hosting compatibility (Next.js 15+ feature)
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
  
  // Configuração estável - sem experimentais
  // experimental: removido para máxima estabilidade
  
  // Enhanced webpack configuration with clean bundle analysis
  webpack: (config, { dev, isServer }) => {
    // Path alias - explicit resolution for Firebase App Hosting
    const path = require('path');
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
      '@/hooks': path.resolve(__dirname, 'src/hooks'),
      '@/services': path.resolve(__dirname, 'src/services'),
      '@/contexts': path.resolve(__dirname, 'src/contexts'),
      '@/ai': path.resolve(__dirname, 'src/ai'),
    };
    
    // Bundle analysis simplificado
    if (process.env.ANALYZE === 'true' && !isServer) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: '../bundle-analysis.html'
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
  
  // Headers configuration to fix CORS/COOP issues
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups'
          },
          {
            key: 'Cross-Origin-Embedder-Policy', 
            value: 'unsafe-none'
          }
        ],
      },
    ]
  },

  // Build optimizations
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  
  // Cloud Workstation compatibility - apenas em desenvolvimento
  ...(process.env.NODE_ENV === 'development' && {
    allowedDevOrigins: [
      'https://3000-firebase-studio-2-1751226604447.cluster-uf6urqn4lned4spwk4xorq6bpo.cloudworkstations.dev'
    ]
  }),
};

module.exports = nextConfig;