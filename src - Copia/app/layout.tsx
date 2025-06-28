import type { Metadata } from 'next';
import { AppLayout } from '@/components/layout/app-layout';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { ErrorBoundary } from '@/components/layout/error-boundary';
import { SkipLinks } from '@/components/layout/skip-links';
import { fontVariables } from './fonts';
import './globals.css';
import { AuthProvider } from '@/hooks/use-auth';
import { OnboardingGuard } from '@/components/layout/onboarding-guard';
import { SpeedInsights } from "@vercel/speed-insights/next"
import dynamic from 'next/dynamic';
import { ResourcePreloader } from '@/components/optimization/resource-preloader';

// Lazy load do componente de debug apenas em desenvolvimento
const AuthDebug = dynamic(
  () => import('@/components/debug/auth-debug').then(mod => ({ default: mod.AuthDebug })),
  {
    loading: () => null, // Sem loading para debug
  }
);

export const metadata: Metadata = {
  title: 'LexAI',
  description: 'Seu assistente jurídico com IA',
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
                  <OnboardingGuard>
                      <AppLayout>
                          {children}
                      </AppLayout>
                      <Toaster />
                      <AuthDebug />
                      <ResourcePreloader />
                  </OnboardingGuard>
              </AuthProvider>
          </ThemeProvider>
          <SpeedInsights/>
        </ErrorBoundary>
      </body>
    </html>
  );
}
