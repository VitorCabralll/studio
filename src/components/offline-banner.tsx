'use client';

import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';

interface OfflineBannerProps {
  isOffline?: boolean;
  message?: string;
}

export function OfflineBanner({ isOffline, message }: OfflineBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  useEffect(() => {
    // Detectar status da rede
    const updateNetworkStatus = () => {
      setNetworkStatus(navigator.onLine ? 'online' : 'offline');
    };

    // Listeners para mudanças de conectividade
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    
    // Status inicial
    updateNetworkStatus();

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, []);

  useEffect(() => {
    setIsVisible(isOffline || networkStatus === 'offline');
  }, [isOffline, networkStatus]);

  if (!isVisible) return null;

  const displayMessage = message || (networkStatus === 'offline' 
    ? 'Sem conexão com a internet. Funcionando em modo offline.'
    : 'Sem conexão com o servidor. Alguns recursos podem não funcionar.');

  return (
    <Alert className="border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-200">
      <div className="flex items-center gap-2">
        {networkStatus === 'offline' ? (
          <WifiOff className="h-4 w-4" />
        ) : (
          <AlertTriangle className="h-4 w-4" />
        )}
        <AlertDescription className="text-sm">
          {displayMessage}
        </AlertDescription>
        {networkStatus === 'online' && (
          <div className="ml-auto flex items-center gap-1 text-xs">
            <Wifi className="h-3 w-3" />
            Internet OK
          </div>
        )}
      </div>
    </Alert>
  );
}

// Hook para detectar problemas de conectividade com Firebase
export function useFirebaseConnectivity() {
  const [isFirebaseOffline, setIsFirebaseOffline] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const reportFirebaseError = (error: any) => {
    if (error?.code === 'offline-mode' || 
        error?.message?.includes('Timeout') ||
        error?.message?.includes('offline')) {
      setIsFirebaseOffline(true);
      setLastError(error.message);
    }
  };

  const reportFirebaseSuccess = () => {
    setIsFirebaseOffline(false);
    setLastError(null);
  };

  return {
    isFirebaseOffline,
    lastError,
    reportFirebaseError,
    reportFirebaseSuccess
  };
}