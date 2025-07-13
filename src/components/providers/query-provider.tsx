/**
 * React Query Provider
 * Provider otimizado para caching e sincronização com autenticação
 */

'use client';

import { ReactNode, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createAuthQueryClient, QueryUtils } from '@/lib/performance/query-client';

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Provider que inicializa React Query com configurações otimizadas
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // Create query client instance (only once per app)
  const [queryClient] = useState(() => {
    const client = createAuthQueryClient();
    
    // Initialize QueryUtils with this client
    QueryUtils.setClient(client);
    
    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Show devtools only in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
        />
      )}
    </QueryClientProvider>
  );
}

/**
 * HOC para componentes que precisam de query client
 */
export function withQueryProvider<P extends object>(
  Component: React.ComponentType<P>
) {
  return function WrappedComponent(props: P) {
    return (
      <QueryProvider>
        <Component {...props} />
      </QueryProvider>
    );
  };
}