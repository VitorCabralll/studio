import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
// import { SpeedInsights } from "@vercel/speed-insights/next";
import { fontVariables } from './fonts';
import { ErrorBoundary } from '@/components/error-boundary';
import { SkipLinks } from '@/components/layout/skip-links';
import { ResourcePreloader } from '@/components/optimization/resource-preloader';
import { WebVitals } from '@/components/optimization/web-vitals';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/use-auth';
import { WorkspaceProvider } from '@/contexts/workspace-context';
import { OnboardingGuard } from '@/components/layout/onboarding-guard';
import './globals.css';

// Lazy load do componente de debug apenas em desenvolvimento
const AuthDebug = dynamic(
  () => import('@/components/debug/auth-debug').then(mod => ({ default: mod.AuthDebug })),
  {
    loading: () => null, // Sem loading para debug
  }
);

export const metadata: Metadata = {
  title: 'LexAI - IA Jurídica para Operadores do Direito',
  description: 'Automatize documentos jurídicos com inteligência artificial especializada. Para advogados, promotores, defensores, procuradores e todos os operadores do direito brasileiro. Segurança, compliance LGPD e produtividade em 2025.',
  keywords: 'IA jurídica, automação de documentos, petições, contratos, operadores do direito, advocacia, ministério público, defensoria, procuradoria, LGPD, inteligência artificial, LexAI 2025',
  openGraph: {
    title: 'LexAI - IA Jurídica para Operadores do Direito',
    description: 'Automatize documentos jurídicos com IA especializada. Para todos os operadores do direito brasileiro - 2025.',
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
    title: 'LexAI - IA Jurídica para Operadores do Direito',
    description: 'Automatize documentos jurídicos com IA especializada para operadores do direito - 2025.',
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
                  <OnboardingGuard>
                    {children}
                  </OnboardingGuard>
                  <Toaster />
                  {process.env.NEXT_PUBLIC_FIREBASE_DEBUG === 'true' && <AuthDebug />}
                  <ResourcePreloader />
                  <WebVitals />
                </WorkspaceProvider>
              </AuthProvider>
          </ThemeProvider>
          {/* Speed Insights temporarily disabled
          <ErrorBoundary>
            <SpeedInsights />
          </ErrorBoundary> */}
        </ErrorBoundary>
      </body>
    </html>
  );
}
