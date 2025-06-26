"use client";

import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FilePlus2, Bot, Gavel, Users, Settings, ChevronDown, Scale } from 'lucide-react';
import { Button } from '../ui/button';

const navItems = [
  { href: "/", label: "Início", icon: LayoutDashboard },
  { href: "/generate", label: "Criar Documento", icon: FilePlus2 },
];

const agentSections = [
    { 
        title: "Agentes por Matéria", 
        icon: Bot,
        agents: [
            { name: "Direito Civil", count: 5 },
            { name: "Direito Penal", count: 3 },
            { name: "Direito do Trabalho", count: 2 },
        ]
    },
    { 
        title: "Agentes Oficiais", 
        icon: Gavel,
        agents: [
            { name: "STF Jurisprudência", count: 1 },
            { name: "STJ Jurisprudência", count: 1 },
        ]
    },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
            <Scale className="w-7 h-7 text-primary" />
            <h1 className="text-xl font-bold font-headline">LexAI</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map(item => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton isActive={pathname === item.href} asChild>
                <Link href={item.href}>
                  <item.icon/>
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <div className="mt-4 space-y-2">
            {agentSections.map((section, index) => (
                <Collapsible key={index} defaultOpen>
                    <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-2 rounded-md hover:bg-sidebar-accent">
                            <div className="flex items-center gap-2">
                                <section.icon className="w-4 h-4"/>
                                <span className="text-sm font-medium">{section.title}</span>
                            </div>
                            <ChevronDown className="w-4 h-4 transition-transform [&[data-state=open]]:rotate-180"/>
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-6 pr-2 py-1 space-y-1">
                        {section.agents.map((agent, agentIndex) => (
                             <div key={agentIndex} className="flex items-center justify-between text-sm text-muted-foreground p-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                <span>{agent.name}</span>
                                <Badge variant="secondary">{agent.count}</Badge>
                             </div>
                        ))}
                    </CollapsibleContent>
                </Collapsible>
            ))}
        </div>

      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname.startsWith('/workspace')} asChild>
                  <Link href="/workspace">
                    <Users/>
                    <span>Workspaces</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname.startsWith('/settings')} asChild>
                  <Link href="/settings">
                    <Settings/>
                    <span>Configurações</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
