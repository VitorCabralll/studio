'use client';

import React from 'react';

export function SkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="fixed top-0 left-0 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-br-md transform -translate-y-full focus:translate-y-0 transition-transform duration-150 ease-in-out font-medium"
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
        className="fixed top-0 left-32 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-br-md transform -translate-y-full focus:translate-y-0 transition-transform duration-150 ease-in-out font-medium"
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
        className="fixed top-0 left-64 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-br-md transform -translate-y-full focus:translate-y-0 transition-transform duration-150 ease-in-out font-medium"
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