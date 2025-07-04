'use client';

import { Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuth } from '@/hooks/use-auth';

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, userProfile, isInitialized, error } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    // Skip during build/SSR to prevent redirect loops
    if (typeof window === 'undefined') {
      setIsVerified(true);
      return;
    }
    
    if (!mounted || !isInitialized || !router) {
      return;
    }
    
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    // Redirect to login if not authenticated and not on an auth page
    if (!user) {
      if (!isAuthPage) {
        router.replace('/login');
      } else {
        setIsVerified(true);
      }
      return;
    }

    // If user is authenticated but profile failed to load, show error handling
    if (user && !userProfile && error && !loading) {
      // For now, redirect to onboarding which can handle profile creation
      if (pathname !== '/onboarding') {
        router.replace('/onboarding');
      } else {
        setIsVerified(true);
      }
      return;
    }

    // If user is authenticated but profile is still loading, wait
    if (user && !userProfile && loading) {
      return;
    }

    // --- User is authenticated and profile is loaded from this point ---
    if (!userProfile) {
      return; // Safety check - should not happen
    }

    console.log('🎯 OnboardingGuard - Profile loaded:', {
      primeiro_acesso: userProfile.primeiro_acesso,
      initial_setup_complete: userProfile.initial_setup_complete,
      pathname: pathname,
      userProfile: userProfile
    });

    // 1. Check if user needs to go through the initial profile setup.
    if (userProfile.primeiro_acesso) {
      console.log('🔀 Redirecting to onboarding - primeiro_acesso = true');
      if (pathname !== '/onboarding') {
        router.replace('/onboarding');
      } else {
        setIsVerified(true);
      }
      return;
    }

    // 2. Check if user has completed the entire setup flow (workspace + first agent).
    if (!userProfile.initial_setup_complete) {
      const allowedPaths = [
        '/workspace',
        '/workspace/success',
        '/agente/criar',
        '/settings',
        '/onboarding/success',
      ];
      const isAllowed = allowedPaths.some(p => pathname.startsWith(p));

      if (!isAllowed) {
        // If not on an allowed page, start the flow.
        router.replace('/workspace');
      } else {
        setIsVerified(true);
      }
      return;
    }
    
    // 3. User is fully onboarded. Allow access to all pages except setup pages.
    const setupPages = ['/login', '/signup', '/onboarding'];
    if (setupPages.some(p => pathname.startsWith(p))) {
      router.replace('/');
    } else {
      setIsVerified(true);
    }

  }, [mounted, user, userProfile, loading, pathname, router, isInitialized, error]);

  if (!isVerified) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
