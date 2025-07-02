import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
// import { SpeedInsights } from "@vercel/speed-insights/next"; // Removed: Incompatible with Firebase App Hosting
import { fontVariables } from './fonts';
import { ErrorBoundary } from '@/components/layout/error-boundary';
import { SkipLinks } from '@/components/layout/skip-links';
import { ResourcePreloader } from '@/components/optimization/resource-preloader';
import { WebVitals } from '@/components/optimization/web-vitals';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/use-auth';
import { WorkspaceProvider } from '@/contexts/workspace-context';
import './globals.css';

// Lazy load do componente de debug apenas em desenvolvimento
const AuthDebug = process.env.NODE_ENV === 'development' 
  ? dynamic(
      () => import('@/components/debug/auth-debug').then(mod => ({ default: mod.AuthDebug })),
      {
        loading: () => null, // Sem loading para debug
      }
    )
  : () => null;

export const metadata: Metadata = {
  title: 'LexAI - IA Jurídica para Advogados e Escritórios',
  description: 'Automatize documentos jurídicos, petições, contratos e pareceres com inteligência artificial treinada em direito brasileiro. Segurança, compliance LGPD e produtividade máxima para advogados.',
  keywords: 'IA jurídica, automação de documentos, petições, contratos, advocacia, LGPD, inteligência artificial, LexAI',
  openGraph: {
    title: 'LexAI - IA Jurídica para Advogados',
    description: 'Automatize documentos jurídicos com IA treinada em direito brasileiro. Segurança, compliance LGPD e produtividade máxima.',
    url: 'https://lexai.com.br',
    siteName: 'LexAI',
    images: [
      {
        url: 'https://lexai.com.br/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LexAI - IA Jurídica',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@lexai_br',
    title: 'LexAI - IA Jurídica para Advogados',
    description: 'Automatize documentos jurídicos com IA treinada em direito brasileiro.',
    images: ['https://lexai.com.br/og-image.png'],
  },
  metadataBase: new URL('https://lexai.com.br'),
  alternates: {
    canonical: 'https://lexai.com.br',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${fontVariables} font-body antialiased`}>
        <SkipLinks />
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
              <AuthProvider>
                <WorkspaceProvider>
                  {children}
                  <Toaster />
                  {process.env.NODE_ENV === 'development' && <AuthDebug />}
                  <ResourcePreloader />
                  <WebVitals />
                </WorkspaceProvider>
              </AuthProvider>
          </ThemeProvider>
          {/* SpeedInsights removed: Incompatible with Firebase App Hosting */}
        </ErrorBoundary>
      </body>
    </html>
  );
}
