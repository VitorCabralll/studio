'use client';

import { Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, userProfile, isInitialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState(false);
  
  // Definir páginas públicas (acessíveis sem autenticação)
  const publicPaths = ['/', '/legal', '/about', '/privacy', '/terms', '/contact', '/seguranca', '/forgot-password'];
  const isPublicPage = publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  useEffect(() => {
    // Para páginas públicas, permitir acesso imediatamente
    if (isPublicPage || isAuthPage) {
      setIsVerified(true);
      return;
    }
    
    // Aguardar inicialização completa para páginas protegidas
    if (!isInitialized) {
      return;
    }

    // 1. Usuário não autenticado tentando acessar página protegida
    if (!user) {
      router.replace('/login');
      return;
    }

    // 2. Usuário autenticado mas ainda carregando perfil
    if (user && loading) {
      return;
    }

    // 3. Usuário autenticado mas sem perfil (precisa onboarding)
    if (user && !userProfile) {
      if (pathname !== '/onboarding') {
        router.replace('/onboarding');
        return;
      }
      setIsVerified(true);
      return;
    }

    // 4. Usuário com perfil válido - verificar fluxo de onboarding
    if (userProfile && userProfile.primeiro_acesso) {
      if (pathname !== '/onboarding') {
        router.replace('/onboarding');
        return;
      }
      setIsVerified(true);
      return;
    }

    // 5. Setup incompleto - direcionar para workspace
    if (userProfile && !userProfile.initial_setup_complete) {
      const allowedPaths = ['/workspace', '/agente/criar', '/settings', '/onboarding/success'];
      const isAllowed = allowedPaths.some(p => pathname.startsWith(p));
      
      if (!isAllowed) {
        router.replace('/workspace');
        return;
      }
      setIsVerified(true);
      return;
    }
    
    // 6. Usuário completamente configurado
    const setupPages = ['/login', '/signup', '/onboarding'];
    if (setupPages.some(p => pathname.startsWith(p))) {
      router.replace('/workspace');
      return;
    }
    
    setIsVerified(true);

  }, [user, userProfile, loading, pathname, router, isInitialized, isPublicPage, isAuthPage]);

  if (!isVerified) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
