'use client';

import { useRef, useCallback, useEffect } from 'react';

interface UseFocusManagementOptions {
  announceChanges?: boolean;
  focusDelay?: number;
}

export function useFocusManagement(options: UseFocusManagementOptions = {}) {
  const { announceChanges = true, focusDelay = 100 } = options;
  const announcementRef = useRef<HTMLDivElement>(null);

  // Função para focar em um elemento específico
  const focusElement = useCallback((elementId: string, announcement?: string) => {
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        element.focus();
        
        // Anunciar mudança para screen readers se necessário
        if (announceChanges && announcement && announcementRef.current) {
          announcementRef.current.textContent = announcement;
          // Limpar o anúncio após um tempo
          setTimeout(() => {
            if (announcementRef.current) {
              announcementRef.current.textContent = '';
            }
          }, 1000);
        }
      }
    }, focusDelay);
  }, [announceChanges, focusDelay]);

  // Função para focar no primeiro elemento focável de um container
  const focusFirstElement = useCallback((containerId: string, announcement?: string) => {
    setTimeout(() => {
      const container = document.getElementById(containerId);
      if (container) {
        const focusableElements = container.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        if (firstElement) {
          firstElement.focus();
          
          if (announceChanges && announcement && announcementRef.current) {
            announcementRef.current.textContent = announcement;
            setTimeout(() => {
              if (announcementRef.current) {
                announcementRef.current.textContent = '';
              }
            }, 1000);
          }
        }
      }
    }, focusDelay);
  }, [announceChanges, focusDelay]);

  // Função para focar no título de uma seção
  const focusHeading = useCallback((headingId: string, announcement?: string) => {
    setTimeout(() => {
      const heading = document.getElementById(headingId);
      if (heading) {
        // Garantir que o heading seja focável
        if (!heading.hasAttribute('tabindex')) {
          heading.setAttribute('tabindex', '-1');
        }
        heading.focus();
        
        if (announceChanges && announcement && announcementRef.current) {
          announcementRef.current.textContent = announcement;
          setTimeout(() => {
            if (announcementRef.current) {
              announcementRef.current.textContent = '';
            }
          }, 1000);
        }
      }
    }, focusDelay);
  }, [announceChanges, focusDelay]);

  // Função para anunciar algo para screen readers sem mudar o foco
  const announce = useCallback((message: string) => {
    if (announcementRef.current) {
      announcementRef.current.textContent = message;
      setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  // Componente de anúncios para screen readers
  const AnnouncementRegion = () => (
    <div
      ref={announcementRef}
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  );

  return {
    focusElement,
    focusFirstElement,
    focusHeading,
    announce,
    AnnouncementRegion
  };
}