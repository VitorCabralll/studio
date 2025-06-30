'use client';

import { Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuth } from '@/hooks/use-auth';

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, userProfile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (loading || !router) {
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

    // If user is authenticated, but profile is not loaded yet, wait.
    if (!userProfile) {
      return;
    }

    // --- User is authenticated and profile is loaded from this point ---

    // 1. Check if user needs to go through the initial profile setup.
    if (userProfile.primeiro_acesso) {
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

  }, [user, userProfile, loading, pathname, router]);

  if (!isVerified) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
