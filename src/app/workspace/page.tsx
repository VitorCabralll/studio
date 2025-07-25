'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Users, Settings, Trash2, Loader2, Briefcase, Crown, ArrowRight, Building } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/hooks/use-simple-auth';
import { useWorkspace } from '@/hooks/use-workspace';
import { updateUserProfile } from '@/services/user-service';


// Animation variants removed for now

export default function WorkspacePage() {
  return <WorkspacePageContent />;
}

function WorkspacePageContent() {
  const [newWorkspaceName, setNewWorkspaceName] = useState("Meu Novo Workspace");
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const { user, updateUserProfileState } = useAuth();
  const { workspaces, createWorkspace, selectWorkspace } = useWorkspace();

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim() || !user) return;
    setIsCreating(true);
    try {
      // Criar workspace usando o novo sistema
      const workspaceId = await createWorkspace(newWorkspaceName.trim());
      
      if (workspaceId) {
        // Marcar setup como completo no perfil do usuário
        await updateUserProfile(user.uid, { 
          initial_setup_complete: true
        });
        updateUserProfileState({ 
          initial_setup_complete: true
        });
        
        // Definir como workspace ativo
        selectWorkspace(workspaceId);
        
        router.push('/workspace/success');
      } else {
        console.error("Erro ao criar workspace");
      }
    } catch (error) {
        console.error("Erro não tratado ao criar workspace:", error);
    } finally {
        setIsCreating(false);
    }
  };
  
  const handleOpenWorkspace = (workspace: { id: string; name: string; members: string[]; owners: string[]; createdAt: Date; updatedAt: Date }) => {
    selectWorkspace(workspace.id);
    router.push('/generate'); // ou '/dashboard' se preferir
  };
  
  return (
    <div className="to-primary/3 min-h-screen flex-1 bg-gradient-to-br from-background via-background p-4 md:p-8">
      {/* Background Pattern */}
      <div className="bg-grid-slate-100/50 dark:bg-grid-slate-800/50 pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 flex flex-col justify-between space-y-6 lg:flex-row lg:items-center lg:space-y-0"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                className="shadow-apple-lg flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80"
              >
                <Building className="size-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-display mb-2">Seus Workspaces</h1>
                <p className="text-body-large max-w-2xl text-muted-foreground">
                  Organize seus projetos jurídicos e colabore com sua equipe em ambientes dedicados e seguros.
                </p>
              </div>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="shadow-apple-lg hover:shadow-apple-lg h-14 bg-gradient-to-r from-primary to-primary/90 px-8 text-lg font-semibold transition-all duration-500 hover:scale-105 hover:from-primary/90 hover:to-primary/80"
                  disabled={workspaces.length >= 5}
                  title={workspaces.length >= 5 ? "Limite máximo de 5 workspaces atingido" : "Criar novo workspace"}
                >
                  <PlusCircle className="mr-3 size-6" />
                  {workspaces.length >= 5 ? `Limite atingido (${workspaces.length}/5)` : `Criar Workspace (${workspaces.length}/5)`}
                </Button>
              </DialogTrigger>
              <DialogContent className="surface-elevated shadow-apple-lg border-2 border-border/50 sm:max-w-lg">
                <DialogHeader className="space-y-6 text-center">
                  <div className="shadow-apple-md mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80">
                    <Building className="size-8 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-headline mb-3">Criar Novo Workspace</DialogTitle>
                    <DialogDescription className="text-body-large leading-relaxed">
                      Dê um nome descritivo ao seu workspace. Você poderá convidar membros da equipe posteriormente.
                    </DialogDescription>
                  </div>
                </DialogHeader>
                <div className="space-y-8 py-6">
                  <div className="space-y-4">
                    <Label htmlFor="name" className="flex items-center gap-3 text-base font-semibold">
                      <div className="flex size-5 items-center justify-center rounded-full bg-primary/10">
                        <Briefcase className="size-3 text-primary" />
                      </div>
                      Nome do Workspace
                    </Label>
                    <Input 
                      id="name" 
                      value={newWorkspaceName}
                      onChange={(e) => setNewWorkspaceName(e.target.value)}
                      className="shadow-apple-sm hover:shadow-apple-md h-12 border-2 text-base transition-all duration-300 focus:border-primary/50 focus:ring-primary/20"
                      placeholder="Ex: Meu Escritório, Projetos Especiais..."
                    />
                  </div>
                  
                  <div className="shadow-apple-sm rounded-xl border border-blue-200/50 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:border-blue-800/50 dark:from-blue-950/30 dark:to-indigo-950/30">
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex size-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                        <Briefcase className="size-2.5 text-blue-600" />
                      </div>
                      <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">Dica</span>
                    </div>
                    <p className="text-caption leading-relaxed text-blue-600 dark:text-blue-300">
                      Use nomes descritivos como &quot;Direito Civil&quot;, &quot;Equipe Trabalhista&quot; ou &quot;Projetos 2024&quot;
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="button" 
                    onClick={handleCreateWorkspace} 
                    disabled={isCreating || !newWorkspaceName.trim()}
                    className="shadow-apple-md hover:shadow-apple-lg h-12 w-full bg-gradient-to-r from-primary to-primary/90 text-base font-semibold transition-all duration-500 hover:scale-105 hover:from-primary/90 hover:to-primary/80"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-3 size-5 animate-spin" />
                        Criando...
                      </>
                    ) : (
                      <>
                        <Building className="mr-3 size-5" />
                        Criar Workspace
                        <ArrowRight className="ml-3 size-5" />
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        </motion.div>

        {/* Workspaces Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {workspaces.length === 0 ? (
            // Estado vazio premium
            <div className="flex flex-col items-center justify-center space-y-8 py-16 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="relative"
              >
                <div className="shadow-apple-lg flex size-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 border-2 border-primary/20">
                  <Building className="size-12 text-primary" />
                </div>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="absolute -right-2 -top-2"
                >
                  <div className="shadow-apple-sm flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600">
                    <PlusCircle className="size-4 text-white" />
                  </div>
                </motion.div>
              </motion.div>
              
              <div className="max-w-md space-y-4">
                <h2 className="text-headline">Nenhum workspace encontrado</h2>
                <p className="text-body-large leading-relaxed text-muted-foreground">
                  Crie seu primeiro workspace para começar a organizar seus projetos jurídicos com <span className="font-semibold text-primary">máxima eficiência</span>.
                </p>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    className="shadow-apple-lg hover:shadow-apple-lg h-16 bg-gradient-to-r from-primary to-primary/90 px-10 text-lg font-semibold transition-all duration-500 hover:scale-105 hover:from-primary/90 hover:to-primary/80"
                    disabled={workspaces.length >= 5}
                    title={workspaces.length >= 5 ? "Limite máximo de 5 workspaces atingido" : "Criar seu primeiro workspace"}
                  >
                    <PlusCircle className="mr-3 size-6" />
                    Criar Meu Primeiro Workspace
                    <ArrowRight className="ml-3 size-6" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="surface-elevated shadow-apple-lg border-2 border-border/50 sm:max-w-lg">
                  <DialogHeader className="space-y-6 text-center">
                    <div className="shadow-apple-md mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80">
                      <Building className="size-8 text-white" />
                    </div>
                    <div>
                      <DialogTitle className="text-headline mb-3">Criar Primeiro Workspace</DialogTitle>
                      <DialogDescription className="text-body-large leading-relaxed">
                        Dê um nome descritivo ao seu workspace. Você poderá convidar membros da equipe posteriormente.
                      </DialogDescription>
                    </div>
                  </DialogHeader>
                  <div className="space-y-8 py-6">
                    <div className="space-y-4">
                      <Label htmlFor="name" className="flex items-center gap-3 text-base font-semibold">
                        <div className="flex size-5 items-center justify-center rounded-full bg-primary/10">
                          <Briefcase className="size-3 text-primary" />
                        </div>
                        Nome do Workspace
                      </Label>
                      <Input 
                        id="name" 
                        value={newWorkspaceName}
                        onChange={(e) => setNewWorkspaceName(e.target.value)}
                        className="shadow-apple-sm hover:shadow-apple-md h-12 border-2 text-base transition-all duration-300 focus:border-primary/50 focus:ring-primary/20"
                        placeholder="Ex: Meu Escritório, Projetos Especiais..."
                      />
                    </div>
                    
                    <div className="shadow-apple-sm rounded-xl border border-blue-200/50 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:border-blue-800/50 dark:from-blue-950/30 dark:to-indigo-950/30">
                      <div className="mb-2 flex items-center gap-3">
                        <div className="flex size-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                          <Briefcase className="size-2.5 text-blue-600" />
                        </div>
                        <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">Dica</span>
                      </div>
                      <p className="text-caption leading-relaxed text-blue-600 dark:text-blue-300">
                        Use nomes descritivos como &quot;Direito Civil&quot;, &quot;Equipe Trabalhista&quot; ou &quot;Projetos 2024&quot;
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      type="button" 
                      onClick={handleCreateWorkspace} 
                      disabled={isCreating || !newWorkspaceName.trim()}
                      className="shadow-apple-md hover:shadow-apple-lg h-12 w-full bg-gradient-to-r from-primary to-primary/90 text-base font-semibold transition-all duration-500 hover:scale-105 hover:from-primary/90 hover:to-primary/80"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="mr-3 size-5 animate-spin" />
                          Criando...
                        </>
                      ) : (
                        <>
                          <Building className="mr-3 size-5" />
                          Criar Workspace
                          <ArrowRight className="ml-3 size-5" />
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {workspaces.map((ws: any, index: number) => (
              <motion.div
                key={ws.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8, scale: 1.02 }}
                layout
              >
                <Card className="surface-elevated shadow-apple-lg hover:shadow-apple-lg group flex h-full flex-col border-2 border-border/50 transition-all duration-500 hover:border-primary/30">
                  <CardHeader className="space-y-6 pb-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="shadow-apple-sm flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10">
                            <Briefcase className="size-6 text-primary" />
                          </div>
                          {ws.owners.includes(user?.uid || '') && (
                            <div className="shadow-apple-sm flex items-center gap-2 rounded-full border border-amber-200/50 bg-gradient-to-r from-amber-50 to-yellow-50 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:border-amber-800/50 dark:from-amber-950/50 dark:to-yellow-950/50 dark:text-amber-300">
                              <Crown className="size-3" />
                              Proprietário
                            </div>
                          )}
                        </div>
                        <CardTitle className="text-headline transition-colors duration-300 group-hover:text-primary">
                          {ws.name}
                        </CardTitle>
                      </div>
                    </div>
                    
                    <CardDescription className="flex items-center gap-3 text-base">
                      <div className="flex size-5 items-center justify-center rounded-full bg-primary/10">
                        <Users className="size-3 text-primary" />
                      </div>
                      <span className="font-medium">
                        {ws.members.length} {ws.members.length > 1 ? 'membros' : 'membro'}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex flex-1 flex-col justify-between space-y-6">
                    {/* Avatars dos membros */}
                    <div className="flex items-center space-x-1">
                      <motion.div
                        whileHover={{ scale: 1.1, y: -2 }}
                        className="relative"
                      >
                        <Avatar className="border-3 shadow-apple-sm size-10 border-background">
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 font-semibold text-primary">A</AvatarFallback>
                        </Avatar>
                      </motion.div>
                      {ws.members.length > 1 && (
                        <motion.div
                          whileHover={{ scale: 1.1, y: -2 }}
                          className="relative -ml-3"
                        >
                          <Avatar className="border-3 shadow-apple-sm size-10 border-background">
                            <AvatarFallback className="bg-gradient-to-br from-emerald-100 to-green-100 font-semibold text-emerald-700 dark:from-emerald-900 dark:to-green-900 dark:text-emerald-300">B</AvatarFallback>
                          </Avatar>
                        </motion.div>
                      )}
                      {ws.members.length > 2 && (
                        <motion.div
                          whileHover={{ scale: 1.1, y: -2 }}
                          className="relative -ml-3"
                        >
                          <Avatar className="border-3 shadow-apple-sm size-10 border-background">
                            <AvatarFallback className="bg-gradient-to-br from-slate-100 to-gray-100 text-xs font-semibold text-slate-600 dark:from-slate-800 dark:to-gray-800 dark:text-slate-300">
                              +{ws.members.length - 2}
                            </AvatarFallback>
                          </Avatar>
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Stats ou informações adicionais */}
                    <div className="surface-overlay space-y-3 rounded-xl border border-border/50 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-caption">Documentos recentes</span>
                        <span className="text-base font-semibold">12</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-caption">Atividade</span>
                        <div className="flex items-center gap-2">
                          <div className="size-2 animate-pulse rounded-full bg-green-500"></div>
                          <span className="text-sm font-semibold text-green-600 dark:text-green-400">Ativa</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between gap-3 border-t border-border/50 pt-6">
                    <div className="flex gap-2">
                      {ws.owners.includes(user?.uid || '') && (
                        <>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="hover:shadow-apple-sm size-10 transition-all duration-300 hover:border-primary/30 hover:bg-primary/10"
                          >
                            <Settings className="size-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="hover:shadow-apple-sm size-10 transition-all duration-300 hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </>
                      )}
                    </div>
                    <Button 
                      onClick={() => handleOpenWorkspace(ws)}
                      className="shadow-apple-sm hover:shadow-apple-md h-11 bg-gradient-to-r from-primary to-primary/90 px-6 font-semibold transition-all duration-300 hover:scale-105 hover:from-primary/90 hover:to-primary/80"
                    >
                      Abrir
                      <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
