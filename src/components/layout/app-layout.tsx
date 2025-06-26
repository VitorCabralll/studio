"use client";

import React from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/sidebar';
import { AppHeader } from '@/components/layout/header';

export function AppLayout({ children }: { children: React.ReactNode }) {
  // Sets the default sidebar state from cookies
  const defaultOpen =
    typeof document !== "undefined"
      ? document.cookie.includes("sidebar_state=true")
      : true;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
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
