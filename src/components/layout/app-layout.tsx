"use client";

import { usePathname } from 'next/navigation';
import React from 'react';

import { AppHeader } from '@/components/layout/header';
import { AppSidebar } from '@/components/layout/sidebar';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't render the main layout on login, onboarding, or agent creation pages
  if (pathname === '/onboarding' || pathname === '/login' || pathname === '/agente/criar') {
    return <>{children}</>;
  }
  
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <AppHeader />
          <SidebarInset>
            <main id="main-content" className="flex-1" tabIndex={-1}>
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
