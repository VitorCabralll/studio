import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // Otimizações para Firebase App Hosting
  serverExternalPackages: ['firebase-admin'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
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
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle splitting
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            reuseExistingChunk: true,
          },
          firebase: {
            test: /[\\/]node_modules[\\/](@firebase|firebase)[\\/]/,
            name: 'firebase',
            priority: 20,
            reuseExistingChunk: true,
          },
          ui: {
            test: /[\\/]node_modules[\\/](@radix-ui|lucide-react)[\\/]/,
            name: 'ui',
            priority: 15,
            reuseExistingChunk: true,
          },
          tesseract: {
            test: /[\\/]node_modules[\\/](tesseract\.js)[\\/]/,
            name: 'tesseract',
            priority: 25,
            reuseExistingChunk: true,
          }
        }
      };
    }

    return config;
  },
  // Configurações para App Hosting
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

export default nextConfig;
