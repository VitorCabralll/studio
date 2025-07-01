'use client';

import { useEffect } from 'react';

/**
 * Componente para preload inteligente de recursos críticos
 * Precarrega recursos baseado no contexto da página atual
 */
export function ResourcePreloader() {
  useEffect(() => {
    // Verificar se estamos no cliente antes de qualquer operação DOM
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    // Preload de scripts críticos apenas quando necessário
    const preloadResource = (href: string, as: string, type?: string) => {
      const existingLink = document.querySelector(`link[href="${href}"]`);
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        if (type) link.type = type;
        document.head.appendChild(link);
      }
    };

    // Preload apenas em contextos específicos
    const currentPath = window.location.pathname;

    // Preload wizard components para páginas de geração
    if (currentPath.includes('/generate')) {
      // Preload chunks do wizard que serão carregados
      import('@/app/generate/components/wizard').catch(() => {
        // Silently fail se o preload falhar
      });
    }

    // Preload file upload para páginas de criação de agente
    if (currentPath.includes('/agente/criar')) {
      import('@/components/file-upload-enhanced').catch(() => {
        // Silently fail se o preload falhar
      });
    }

    // Preload de assets críticos para todas as páginas
    preloadResource('/favicon.ico', 'image');

  }, []);

  return null; // Componente não renderiza nada
}

/**
 * Hook para preload condicional de componentes
 */
export function useConditionalPreload() {
  const preloadComponent = (importFn: () => Promise<any>, condition: boolean) => {
    if (condition && typeof window !== 'undefined') {
      // Preload com delay para não impactar o carregamento inicial
      setTimeout(() => {
        importFn().catch(() => {
          // Silently fail
        });
      }, 2000);
    }
  };

  return { preloadComponent };
}