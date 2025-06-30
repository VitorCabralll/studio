/**
 * Service Worker registration and management for LexAI
 */

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('[SW] Service Worker registered successfully:', registration);

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            console.log('[SW] New version available');
            // You could show a notification to the user here
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('[SW] Service Worker registration failed:', error);
    return null;
  }
}

export async function unregisterServiceWorker(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.unregister();
      console.log('[SW] Service Worker unregistered');
      return true;
    }
    return false;
  } catch (error) {
    console.error('[SW] Service Worker unregistration failed:', error);
    return false;
  }
}

export function isServiceWorkerSupported(): boolean {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator;
}

export function getServiceWorkerStatus(): Promise<string> {
  if (!isServiceWorkerSupported()) {
    return Promise.resolve('not-supported');
  }

  return navigator.serviceWorker.getRegistration().then((registration) => {
    if (!registration) return 'not-registered';
    if (registration.waiting) return 'waiting';
    if (registration.installing) return 'installing';
    if (registration.active) return 'active';
    return 'unknown';
  });
}