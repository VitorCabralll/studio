
"use client";

import React from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/sidebar';
import { AppHeader } from '@/components/layout/header';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <AppHeader />
          <SidebarInset>
            <main className="flex-1">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
