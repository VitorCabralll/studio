'use client';

import { useAuth } from '@/hooks/use-auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, userProfile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (loading) {
      return;
    }

    // Redirect to login if not authenticated
    if (!user) {
      if (pathname !== '/login') {
        router.replace('/login');
      } else {
        setIsVerified(true);
      }
      return;
    }

    // --- User is authenticated from this point ---

    const needsOnboarding = !userProfile || userProfile.primeiro_acesso;

    if (needsOnboarding) {
      // Force user to the onboarding page if they haven't completed it
      if (pathname !== '/onboarding') {
        router.replace('/onboarding');
      } else {
        setIsVerified(true);
      }
      return;
    }
    
    // --- User has completed onboarding from this point ---

    // After onboarding, if the user has no workspaces, they are in the "create first workspace/agent" flow.
    if (!userProfile.workspaces || userProfile.workspaces.length === 0) {
      const allowedPaths = [
        '/workspace',
        '/workspace/success',
        '/agente/criar',
      ];
      const isAllowed = allowedPaths.some(p => pathname.startsWith(p)) || pathname.startsWith('/settings');

      if (!isAllowed) {
        router.replace('/workspace');
      } else {
        setIsVerified(true);
      }
      return;
    }

    // --- User has workspaces from this point ---

    // Redirect them away from login/onboarding/initial setup if they try to access it again.
    const forbiddenPaths = ['/login', '/onboarding', '/workspace', '/workspace/success', '/agente/criar'];
    if (forbiddenPaths.includes(pathname)) {
      router.replace('/');
    } else {
      setIsVerified(true);
    }

  }, [user, userProfile, loading, pathname, router]);

  if (!isVerified) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
