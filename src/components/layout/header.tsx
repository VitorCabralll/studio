
"use client";

import { motion } from 'framer-motion';
import { ChevronsLeftRight, User, Settings, LogOut, Building2, Plus, Shield } from "lucide-react";
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-simple-auth";
import { cn } from '@/lib/utils';


export function AppHeader() {
  const { logout } = useAuth();

  return (
    <header id="navigation" className="shadow-apple-sm sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/50 bg-gradient-to-r from-background via-background to-primary/5 px-4 backdrop-blur-sm sm:px-6">
      <motion.div 
        className="md:hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <SidebarTrigger 
          aria-label="Abrir menu lateral" 
          className="rounded-lg transition-colors hover:bg-primary/10 hover:text-primary"
        />
      </motion.div>
      <motion.div 
        className="hidden md:block"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <SidebarTrigger 
          aria-label="Alternar menu lateral" 
          className="rounded-lg transition-colors hover:bg-primary/10 hover:text-primary"
        />
      </motion.div>
      
      <div className="flex w-full items-center justify-end gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className={cn(
                  "flex items-center gap-3 h-10 px-4 rounded-xl",
                  "border-border/50 hover:border-primary/50",
                  "bg-background/50 hover:bg-primary/5",
                  "shadow-apple-sm hover:shadow-apple-md",
                  "transition-all duration-300 group"
                )}
              >
                <div className="flex size-6 items-center justify-center rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5">
                  <Building2 className="size-3 text-primary" />
                </div>
                <span className="font-medium transition-colors group-hover:text-primary">Workspace Pessoal</span>
                <ChevronsLeftRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="shadow-apple-lg w-64 border-border/50">
              <DropdownMenuLabel className="flex items-center gap-2 text-base">
                <Building2 className="size-4 text-primary" />
                Meus Workspaces
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-3 rounded-lg p-3">
                <div className="flex size-8 items-center justify-center rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5">
                  <Building2 className="size-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Workspace Pessoal</div>
                  <div className="text-xs text-muted-foreground">Apenas você</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-3 rounded-lg p-3">
                <div className="flex size-8 items-center justify-center rounded-lg border border-blue-200/50 bg-gradient-to-br from-blue-100 to-indigo-100 dark:border-blue-800/50 dark:from-blue-950/50 dark:to-indigo-950/50">
                  <Building2 className="size-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Workspace de Desenvolvimento</div>
                  <div className="text-xs text-muted-foreground">Apenas você</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/workspace" className="flex items-center gap-3 rounded-lg border-2 border-dashed border-primary/20 p-3 hover:border-primary/40 hover:bg-primary/5">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                    <Plus className="size-4 text-primary" />
                  </div>
                  <span className="font-medium text-primary">Criar novo workspace</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="group relative cursor-pointer">
                <Avatar className="shadow-apple-sm group-hover:shadow-apple-md size-10 border-2 border-border/50 transition-all duration-300 group-hover:border-primary/50">
                  <AvatarImage src="/avatars/default-lawyer.jpg" alt="Foto do usuário" />
                  <AvatarFallback className="border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 font-semibold text-primary">
                    AV
                  </AvatarFallback>
                </Avatar>
                <div className="shadow-apple-sm absolute -right-1 -top-1 size-4 rounded-full border-2 border-background bg-green-500"></div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="shadow-apple-lg w-64 border-border/50">
              <DropdownMenuLabel className="flex items-center gap-3 p-3">
                <Avatar className="size-10 border border-border/50">
                  <AvatarImage src="/avatars/default-lawyer.jpg" alt="Foto do usuário" />
                  <AvatarFallback className="border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 font-semibold text-primary">
                    AV
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold">Desenvolvedor LexAI</div>
                  <div className="text-xs text-muted-foreground">Cuiabá - MT</div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className="space-y-1">
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-3 rounded-lg p-3 hover:bg-muted/50">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-muted/50">
                      <User className="size-4 text-muted-foreground" />
                    </div>
                    <span className="font-medium">Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-3 rounded-lg p-3 hover:bg-muted/50">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-muted/50">
                      <Settings className="size-4 text-muted-foreground" />
                    </div>
                    <span className="font-medium">Configurações</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/seguranca" className="flex items-center gap-3 rounded-lg p-3 hover:bg-green-50 dark:hover:bg-green-950/20">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                      <Shield className="size-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="font-medium text-green-700 dark:text-green-300">Segurança</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={logout} className="flex items-center gap-3 rounded-lg p-3 hover:bg-destructive/10 hover:text-destructive">
                <div className="flex size-8 items-center justify-center rounded-lg bg-destructive/10">
                  <LogOut className="size-4 text-destructive" />
                </div>
                <span className="font-medium">Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      </div>
    </header>
  );
}
