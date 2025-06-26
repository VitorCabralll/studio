
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

    // if no user, redirect to login page
    if (!user) {
      if (pathname !== '/login') {
        router.replace('/login');
      } else {
        setIsVerified(true);
      }
      return;
    }

    // if user is logged in, check for onboarding
    const needsOnboarding = !userProfile || userProfile.primeiro_acesso;
    
    if (needsOnboarding && pathname !== '/onboarding') {
      router.replace('/onboarding');
    } else if (!needsOnboarding && pathname === '/onboarding') {
      router.replace('/');
    } else if (pathname === '/login') {
      // if user is logged in and on login page, redirect to home
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
