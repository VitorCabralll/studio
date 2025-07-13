'use client';

import { Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, userProfile, isInitialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState(false);
  
  // Redirect loop prevention
  const redirectCountRef = useRef(0);
  const lastRedirectRef = useRef<string | null>(null);
  const MAX_REDIRECTS = 3;
  const REDIRECT_RESET_TIME = 5000; // 5 seconds
  
  // Safe redirect function with loop prevention
  const safeRedirect = useCallback((to: string, reason: string) => {
    // Check if we're trying to redirect to the same place too many times
    if (lastRedirectRef.current === to) {
      redirectCountRef.current++;
    } else {
      redirectCountRef.current = 1;
      lastRedirectRef.current = to;
    }

    if (redirectCountRef.current > MAX_REDIRECTS) {
      console.error(`OnboardingGuard: Max redirects reached (${MAX_REDIRECTS}) to ${to}. Breaking loop.`, {
        reason,
        pathname,
        user: user?.uid,
        userProfile: userProfile ? 'exists' : 'none',
        redirectCount: redirectCountRef.current
      });

      // Break the loop by going to a safe fallback route
      const fallbackRoute = user ? '/workspace' : '/login';
      console.log(`OnboardingGuard: Using fallback route: ${fallbackRoute}`);
      
      // Reset counter and redirect to fallback
      redirectCountRef.current = 0;
      lastRedirectRef.current = null;
      router.replace(fallbackRoute);
      
      // Allow access to current page as emergency fallback
      setIsVerified(true);
      return;
    }

    console.log(`OnboardingGuard: Safe redirect to ${to} (attempt ${redirectCountRef.current}/${MAX_REDIRECTS})`, {
      reason,
      from: pathname
    });

    router.replace(to);

    // Reset counter after successful redirect (with delay)
    setTimeout(() => {
      if (redirectCountRef.current > 0) {
        redirectCountRef.current = 0;
        lastRedirectRef.current = null;
      }
    }, REDIRECT_RESET_TIME);
  }, [router, pathname, user, userProfile, MAX_REDIRECTS, REDIRECT_RESET_TIME]);
  
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
      safeRedirect('/login', 'User not authenticated');
      return;
    }

    // 2. Usuário autenticado mas ainda carregando perfil
    if (user && loading) {
      return;
    }

    // 3. Usuário autenticado mas sem perfil (precisa onboarding)
    if (user && !userProfile) {
      if (pathname !== '/onboarding') {
        safeRedirect('/onboarding', 'User needs profile creation');
        return;
      }
      setIsVerified(true);
      return;
    }

    // 4. Usuário com perfil válido - verificar fluxo de onboarding
    if (userProfile && userProfile.primeiro_acesso) {
      if (pathname !== '/onboarding') {
        safeRedirect('/onboarding', 'User first access - needs onboarding');
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
        safeRedirect('/workspace', 'Setup incomplete - needs workspace access');
        return;
      }
      setIsVerified(true);
      return;
    }
    
    // 6. Usuário completamente configurado
    const setupPages = ['/login', '/signup', '/onboarding'];
    if (setupPages.some(p => pathname.startsWith(p))) {
      safeRedirect('/workspace', 'User fully configured - redirect to workspace');
      return;
    }
    
    setIsVerified(true);

  }, [user, userProfile, loading, pathname, isInitialized, isPublicPage, isAuthPage, safeRedirect]);

  if (!isVerified) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
