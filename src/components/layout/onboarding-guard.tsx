
'use client';

import { useAuth, UserProfile } from '@/hooks/use-auth';
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

    if (!user) {
      // You should implement a real login page, for now we let it pass
      // to see the UI. In a real app, you'd redirect to '/login'
      setIsVerified(true);
      return;
    }

    const needsOnboarding = !userProfile || userProfile.primeiro_acesso;
    
    if (needsOnboarding && pathname !== '/onboarding') {
      router.replace('/onboarding');
    } else if (!needsOnboarding && pathname === '/onboarding') {
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
