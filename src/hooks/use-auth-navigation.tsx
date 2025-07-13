/**
 * Stub temporário - funcionalidade será migrada para use-auth principal
 */

'use client';

export function useAuthNavigation() {
  return {
    redirectToLogin: () => {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
    redirectToWorkspace: () => {
      if (typeof window !== 'undefined') {
        window.location.href = '/workspace';
      }
    },
    redirectToOnboarding: () => {
      if (typeof window !== 'undefined') {
        window.location.href = '/onboarding';
      }
    },
    navigateToLogin: () => {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
    navigateToWorkspace: () => {
      if (typeof window !== 'undefined') {
        window.location.href = '/workspace';
      }
    }
  };
}