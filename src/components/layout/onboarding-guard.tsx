
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

    const hasWorkspaces = userProfile.workspaces && userProfile.workspaces.length > 0;

    if (hasWorkspaces) {
      // If user has workspaces, they can access the app.
      // Redirect them away from login/onboarding.
      if (pathname === '/login' || pathname === '/onboarding') {
        router.replace('/');
      } else {
        setIsVerified(true);
      }
    } else {
      // If user has no workspaces, they must create one.
      // Force them to the /workspace page from anywhere else.
      // We allow settings to be accessible.
      if (pathname !== '/workspace' && !pathname.startsWith('/settings')) {
        router.replace('/workspace');
      } else {
        setIsVerified(true);
      }
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
