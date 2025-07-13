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
    
    // Enhanced performance optimizations
    if (!dev) {
      // Tree shaking enhancements
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
        splitChunks: {
          ...config.optimization.splitChunks,
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            // Firebase bundle splitting
            firebase: {
              test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
              name: 'firebase',
              chunks: 'all',
              priority: 30,
              reuseExistingChunk: true,
            },
            // UI libraries splitting
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|@headlessui|framer-motion)[\\/]/,
              name: 'ui',
              chunks: 'all',
              priority: 25,
              reuseExistingChunk: true,
            },
            // React ecosystem
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|react-router)[\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 20,
              reuseExistingChunk: true,
            },
            // Utilities and helpers
            utils: {
              test: /[\\/]node_modules[\\/](lodash|date-fns|clsx|tailwind-merge)[\\/]/,
              name: 'utils',
              chunks: 'all',
              priority: 15,
              reuseExistingChunk: true,
            },
            // Default vendor bundle for remaining packages
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    
    return config;
  },
  
  // Security headers configuration
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.gstatic.com https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://firebasestorage.googleapis.com https://lh3.googleusercontent.com; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://api.openai.com https://api.anthropic.com; frame-src 'self' https://accounts.google.com; object-src 'none'; base-uri 'self'; form-action 'self';"
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups'
          },
          {
            key: 'Cross-Origin-Embedder-Policy', 
            value: 'unsafe-none'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
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