import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // Otimizações para Firebase App Hosting
  serverExternalPackages: ['firebase-admin'],
  
  // Source maps para desenvolvimento
  productionBrowserSourceMaps: false,
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
    // Source maps para desenvolvimento
    if (dev) {
      config.devtool = 'eval-source-map';
    }
    
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
  
  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'development' 
              ? "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.gstatic.com https://apis.google.com https://www.google.com https://www.gstatic.com/recaptcha/ https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://firebaseinstallations.googleapis.com https://firebaseremoteconfig.googleapis.com https://www.googleapis.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com https://firestore.googleapis.com https://storage.googleapis.com https://www.google.com/recaptcha/ https://vitals.vercel-insights.com wss: ws:; frame-src 'self' https: https://www.google.com/recaptcha/;"
              : "default-src 'self'; script-src 'self' https://www.gstatic.com https://apis.google.com https://www.google.com https://www.gstatic.com/recaptcha/ https://va.vercel-scripts.com 'sha256-NEXT_SCRIPT_HASH'; style-src 'self' https://fonts.googleapis.com 'sha256-NEXT_STYLE_HASH'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://firebaseinstallations.googleapis.com https://firebaseremoteconfig.googleapis.com https://www.googleapis.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com https://firestore.googleapis.com https://storage.googleapis.com https://www.google.com/recaptcha/ https://vitals.vercel-insights.com; frame-src 'self' https://www.google.com/recaptcha/; object-src 'none'; base-uri 'self';",
          },
        ],
      },
    ];
  },
  
  // Redirecionamento HTTP para HTTPS em produção
  async redirects() {
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/(.*)',
          has: [
            {
              type: 'header',
              key: 'x-forwarded-proto',
              value: 'http',
            },
          ],
          destination: 'https://lexai.com.br/$1',
          permanent: true,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
