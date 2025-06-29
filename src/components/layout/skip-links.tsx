'use client';

import React from 'react';

export function SkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="fixed left-0 top-0 z-50 -translate-y-full rounded-br-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-transform duration-150 ease-in-out focus:translate-y-0"
        onFocus={(e) => {
          // Garantir que o link seja visível quando focado
          e.currentTarget.style.transform = 'translateY(0)';
        }}
        onBlur={(e) => {
          // Ocultar quando o foco sair
          e.currentTarget.style.transform = 'translateY(-100%)';
        }}
      >
        Pular para o conteúdo principal
      </a>
      <a
        href="#navigation"
        className="fixed left-32 top-0 z-50 -translate-y-full rounded-br-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-transform duration-150 ease-in-out focus:translate-y-0"
        onFocus={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.transform = 'translateY(-100%)';
        }}
      >
        Pular para navegação
      </a>
      <a
        href="#sidebar"
        className="fixed left-64 top-0 z-50 -translate-y-full rounded-br-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-transform duration-150 ease-in-out focus:translate-y-0"
        onFocus={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.transform = 'translateY(-100%)';
        }}
      >
        Pular para menu lateral
      </a>
    </div>
  );
}