
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, Settings, Trash2, Loader2, Briefcase, Crown, ArrowRight, Building } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/hooks/use-auth';
import { updateUserProfile } from '@/services/user-service';
import { motion, AnimatePresence } from 'framer-motion';

interface Workspace {
  name: string;
  members?: number;
  isOwner?: boolean;
}

const staticWorkspaces: Workspace[] = [
  { name: "Escritório & Associados", members: 5, isOwner: false },
  { name: "Projetos Especiais", members: 3, isOwner: true },
];

const workspaceVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { y: -5, transition: { duration: 0.2 } }
};

export default function WorkspacePage() {
  const [newWorkspaceName, setNewWorkspaceName] = useState("Meu Novo Workspace");
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const { user, userProfile, updateUserProfileState } = useAuth();

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim() || !user) return;
    setIsCreating(true);
    try {
      const existingWorkspaces = userProfile?.workspaces || [];
      const newWorkspace = { name: newWorkspaceName.trim() };
      const updatedWorkspaces = [...existingWorkspaces, newWorkspace];

      const result = await updateUserProfile(user.uid, { workspaces: updatedWorkspaces });
      if (result.success) {
        updateUserProfileState({ workspaces: updatedWorkspaces });
        router.push('/workspace/success');
      } else {
        console.error("Erro ao criar workspace:", result.error);
        // Aqui você poderia mostrar um toast de erro para o usuário
      }
    } catch (error) {
        console.error("Erro não tratado ao criar workspace:", error);
    } finally {
        setIsCreating(false);
    }
  };
  
  const userWorkspaces: Workspace[] = userProfile?.workspaces || [];
  
  return (
    <div className="flex-1 p-4 md:p-8 bg-gradient-to-br from-background via-background to-primary/5 min-h-screen">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-200/20 dark:bg-grid-slate-700/20 pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-12 space-y-4 md:space-y-0"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center"
              >
                <Building className="w-6 h-6 text-white" />
              </motion.div>
              <h1 className="text-4xl font-bold tracking-tight font-headline">Seus Workspaces</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Organize seus projetos jurídicos e colabore com sua equipe em ambientes dedicados e seguros.
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Criar Workspace
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <DialogTitle className="font-headline text-xl text-center">Criar Novo Workspace</DialogTitle>
                  <DialogDescription className="text-center">
                    Dê um nome descritivo ao seu workspace. Você poderá convidar membros da equipe posteriormente.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      Nome do Workspace
                    </Label>
                    <Input 
                      id="name" 
                      value={newWorkspaceName}
                      onChange={(e) => setNewWorkspaceName(e.target.value)}
                      className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                      placeholder="Ex: Meu Escritório, Projetos Especiais..."
                    />
                  </div>
                  
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      📝 Dica: Use nomes descritivos como "Direito Civil", "Equipe Trabalhista" ou "Projetos 2024"
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
                    <Button 
                      type="button" 
                      onClick={handleCreateWorkspace} 
                      disabled={isCreating || !newWorkspaceName.trim()}
                      className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Criando...
                        </>
                      ) : (
                        <>
                          Criar Workspace
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        </motion.div>

        {/* Workspaces Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence>
            {[...userWorkspaces, ...staticWorkspaces].map((ws, index) => (
              <motion.div
                key={index}
                variants={workspaceVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ duration: 0.3, delay: index * 0.1 }}
                layout
              >
                <Card className="flex flex-col h-full shadow-lg border-primary/10 hover:shadow-xl transition-all duration-300 group">
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-primary" />
                          </div>
                          {ws.isOwner && (
                            <div className="px-2 py-1 bg-amber-100 dark:bg-amber-900 rounded text-xs font-medium text-amber-700 dark:text-amber-300 flex items-center gap-1">
                              <Crown className="w-3 h-3" />
                              Proprietário
                            </div>
                          )}
                        </div>
                        <CardTitle className="font-headline text-lg group-hover:text-primary transition-colors">
                          {ws.name}
                        </CardTitle>
                      </div>
                    </div>
                    
                    <CardDescription className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="font-medium">
                        {ws.members || 1} {(ws.members && ws.members > 1) ? 'membros' : 'membro'}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                    {/* Avatars dos membros */}
                    <div className="flex items-center space-x-2">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="relative"
                      >
                        <Avatar className="h-8 w-8 border-2 border-background">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">A</AvatarFallback>
                        </Avatar>
                      </motion.div>
                      {(ws.members && ws.members > 1) && (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="relative -ml-2"
                        >
                          <Avatar className="h-8 w-8 border-2 border-background">
                            <AvatarFallback className="bg-secondary/80 text-secondary-foreground font-semibold">B</AvatarFallback>
                          </Avatar>
                        </motion.div>
                      )}
                      {(ws.members && ws.members > 2) && (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="relative -ml-2"
                        >
                          <Avatar className="h-8 w-8 border-2 border-background">
                            <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
                              +{ws.members - 2}
                            </AvatarFallback>
                          </Avatar>
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Stats ou informações adicionais */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Documentos recentes</span>
                        <span className="font-medium">12</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Atividade</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">Ativa</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between gap-2 pt-4 border-t">
                    <div className="flex gap-2">
                      {ws.isOwner && (
                        <>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="outline" size="icon" className="hover:bg-primary/10">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="outline" size="icon" className="hover:bg-destructive/10 hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </>
                      )}
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
                        Abrir
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
