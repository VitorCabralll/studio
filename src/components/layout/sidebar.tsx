
"use client";

import { motion } from 'framer-motion';
import { LayoutDashboard, FilePlus2, Bot, Users, Settings, ChevronDown, Scale, PlusCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navItems = [
  { href: "/", label: "Início", icon: LayoutDashboard },
  { href: "/generate", label: "Criar Documento", icon: FilePlus2 },
];

const agentSections = [
    { 
        title: "Agentes", 
        icon: Bot,
        agents: [
            { name: "Direito Civil", count: 5 },
            { name: "Direito Penal", count: 3 },
            { name: "Direito do Trabalho", count: 2 },
        ]
    }
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar id="sidebar" className="border-r border-border/50 bg-gradient-to-b from-background via-background to-primary/5">
      <SidebarHeader className="border-b border-border/50 p-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Link href="/" className="group flex items-center gap-3">
            <div className="shadow-apple-sm group-hover:shadow-apple-md flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 transition-all duration-300">
              <Scale className="size-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-headline font-bold transition-colors group-hover:text-primary">LexAI</h1>
              <p className="text-caption text-muted-foreground">Assistente Jurídico</p>
            </div>
          </Link>
        </motion.div>
      </SidebarHeader>
      <SidebarContent className="space-y-2 p-4">
        <SidebarMenu className="space-y-2">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={pathname === item.href} 
                  asChild
                  className={cn(
                    "h-11 rounded-xl transition-all duration-300 group",
                    pathname === item.href 
                      ? "bg-primary/10 text-primary shadow-apple-sm border border-primary/20" 
                      : "hover:bg-muted/50 hover:shadow-apple-sm hover:scale-[1.02]"
                  )}
                >
                  <Link href={item.href} className="flex items-center gap-3 px-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                      pathname === item.href 
                        ? "bg-primary/20 text-primary" 
                        : "bg-muted/30 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                      <item.icon className="size-4"/>
                    </div>
                    <span className="font-medium">{item.label}</span>
                    {item.href === "/generate" && (
                      <Sparkles className="ml-auto size-4 text-primary" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </motion.div>
          ))}
        </SidebarMenu>

        <div className="mt-8 space-y-4">
            {agentSections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                >
                  <Collapsible defaultOpen>
                      <CollapsibleTrigger className="group w-full">
                          <div className="hover:shadow-apple-sm flex items-center justify-between rounded-xl p-3 transition-all duration-300 hover:bg-muted/50 group-hover:scale-[1.02]">
                              <div className="flex items-center gap-3">
                                  <div className="flex size-8 items-center justify-center rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5">
                                    <section.icon className="size-4 text-primary"/>
                                  </div>
                                  <span className="text-base font-semibold">{section.title}</span>
                              </div>
                              <ChevronDown className="size-4 text-muted-foreground transition-transform duration-300 [&[data-state=open]]:rotate-180"/>
                          </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-2 py-2 pl-4 pr-2">
                          {section.agents.map((agent, agentIndex) => (
                               <motion.div 
                                 key={agentIndex} 
                                 whileHover={{ x: 4, scale: 1.02 }}
                                 transition={{ duration: 0.2 }}
                                 className="hover:shadow-apple-sm group flex cursor-pointer items-center justify-between rounded-lg p-3 transition-all duration-300 hover:bg-muted/50"
                               >
                                  <div className="flex items-center gap-3">
                                    <div className="flex size-6 items-center justify-center rounded-md bg-muted/50">
                                      <Bot className="size-3 text-muted-foreground" />
                                    </div>
                                    <span className="text-caption font-medium transition-colors group-hover:text-foreground">{agent.name}</span>
                                  </div>
                                  <Badge variant="secondary" className="shadow-apple-sm border border-primary/20 bg-primary/10 text-primary">{agent.count}</Badge>
                               </motion.div>
                          ))}
                          <motion.div
                            whileHover={{ x: 4, scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Link href="/agente/criar" className="hover:shadow-apple-sm group mt-2 flex items-center gap-3 rounded-lg border-2 border-dashed border-primary/20 p-3 transition-all duration-300 hover:border-primary/40 hover:bg-primary/5">
                                <div className="flex size-6 items-center justify-center rounded-md bg-primary/10">
                                  <PlusCircle className="size-3 text-primary" />
                                </div>
                                <span className="text-caption font-medium text-primary">Criar Agente</span>
                            </Link>
                          </motion.div>
                      </CollapsibleContent>
                  </Collapsible>
                </motion.div>
            ))}
        </div>

      </SidebarContent>
      <SidebarFooter className="border-t border-border/50 bg-muted/20 p-4">
        <SidebarMenu className="space-y-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={pathname.startsWith('/workspace')} 
                    asChild
                    className={cn(
                      "h-11 rounded-xl transition-all duration-300 group",
                      pathname.startsWith('/workspace') 
                        ? "bg-primary/10 text-primary shadow-apple-sm border border-primary/20" 
                        : "hover:bg-muted/50 hover:shadow-apple-sm hover:scale-[1.02]"
                    )}
                  >
                    <Link href="/workspace" className="flex items-center gap-3 px-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                        pathname.startsWith('/workspace') 
                          ? "bg-primary/20 text-primary" 
                          : "bg-muted/30 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                      )}>
                        <Users className="size-4"/>
                      </div>
                      <span className="font-medium">Workspaces</span>
                    </Link>
                  </SidebarMenuButton>
              </SidebarMenuItem>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={pathname.startsWith('/settings')} 
                    asChild
                    className={cn(
                      "h-11 rounded-xl transition-all duration-300 group",
                      pathname.startsWith('/settings') 
                        ? "bg-primary/10 text-primary shadow-apple-sm border border-primary/20" 
                        : "hover:bg-muted/50 hover:shadow-apple-sm hover:scale-[1.02]"
                    )}
                  >
                    <Link href="/settings" className="flex items-center gap-3 px-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                        pathname.startsWith('/settings') 
                          ? "bg-primary/20 text-primary" 
                          : "bg-muted/30 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                      )}>
                        <Settings className="size-4"/>
                      </div>
                      <span className="font-medium">Configurações</span>
                    </Link>
                  </SidebarMenuButton>
              </SidebarMenuItem>
            </motion.div>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
