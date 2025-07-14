'use client';

import { motion } from 'framer-motion';
import { User, Palette, Building, AlertTriangle, Settings2, Save } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/hooks/use-simple-auth';
import { useWorkspace } from '@/hooks/use-workspace';
import { useToast } from '@/hooks/use-toast';
import { updateUserProfile } from '@/services/user-service';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  return <SettingsPageContent />;
}

function SettingsPageContent() {
  const { user, userProfile, updateUserProfileState } = useAuth();
  const { currentWorkspace, updateWorkspace, deleteWorkspace } = useWorkspace();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Inicializar valores quando dados carregarem
  useEffect(() => {
    if (userProfile?.name || userProfile?.displayName) {
      setFullName(userProfile.name || userProfile.displayName || '');
    }
    if (currentWorkspace?.name) {
      setWorkspaceName(currentWorkspace.name);
    }
  }, [userProfile, currentWorkspace]);

  const handleSaveProfile = async () => {
    if (!user || !fullName.trim()) return;
    
    setIsLoading(true);
    try {
      // Atualizar perfil do usuário com novo nome
      const result = await updateUserProfile(user.uid, { 
        name: fullName.trim(),
        displayName: fullName.trim() 
      });
      
      if (result) {
        // Atualizar estado local
        updateUserProfileState({ 
          name: fullName.trim(),
          displayName: fullName.trim() 
        });
        
        toast({
          title: "Perfil atualizado",
          description: "Suas informações foram salvas com sucesso.",
        });
      } else {
        throw new Error('Erro ao salvar perfil');
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveWorkspace = async () => {
    if (!currentWorkspace || !workspaceName.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await updateWorkspace(currentWorkspace.id, {
        name: workspaceName.trim()
      });
      
      if (result) {
        toast({
          title: "Workspace atualizado",
          description: "O nome do workspace foi alterado com sucesso.",
        });
      } else {
        throw new Error('Erro ao salvar perfil');
      }
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o workspace.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWorkspace = async () => {
    if (!currentWorkspace) return;
    
    const confirmed = window.confirm(
      `Tem certeza de que deseja excluir o workspace "${currentWorkspace.name}"? Esta ação não pode ser desfeita.`
    );
    
    if (!confirmed) return;
    
    setIsLoading(true);
    try {
      const result = await deleteWorkspace(currentWorkspace.id);
      
      if (result) {
        toast({
          title: "Workspace excluído",
          description: "O workspace foi removido permanentemente.",
        });
        // Usuário será redirecionado automaticamente pelo WorkspaceContext
      } else {
        throw new Error('Erro ao salvar perfil');
      }
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o workspace.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="to-primary/3 min-h-screen flex-1 bg-gradient-to-br from-background via-background p-4 md:p-8">
      {/* Background Pattern */}
      <div className="bg-grid-slate-100/50 dark:bg-grid-slate-800/50 pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 space-y-6"
        >
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
              className="shadow-apple-lg flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80"
            >
              <Settings2 className="size-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-display mb-2">Configurações</h1>
              <p className="text-body-large max-w-2xl text-muted-foreground">
                Personalize sua experiência no LexAI e gerencie as configurações do seu workspace.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Settings Cards */}
        <div className="space-y-10">
          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="surface-elevated shadow-apple-lg hover:shadow-apple-lg border-2 border-border/50 transition-all duration-500 hover:scale-[1.01] hover:border-primary/30">
              <CardHeader className="pb-8">
                <div className="flex items-center gap-4">
                  <div className="shadow-apple-sm flex size-14 items-center justify-center rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-50 to-indigo-100 dark:border-blue-800/50 dark:from-blue-950/50 dark:to-indigo-950/50">
                    <User className="size-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-headline mb-2">Informações Pessoais</CardTitle>
                    <CardDescription className="text-body-large">Gerencie seus dados pessoais e preferências de conta.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="space-y-4">
                    <Label htmlFor="full-name" className="flex items-center gap-3 text-base font-semibold">
                      <div className="flex size-5 items-center justify-center rounded-full bg-primary/10">
                        <User className="size-3 text-primary" />
                      </div>
                      Nome Completo
                    </Label>
                    <Input 
                      id="full-name" 
                      value={fullName || userProfile?.name || userProfile?.displayName || ''}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Digite seu nome completo"
                      className="shadow-apple-sm hover:shadow-apple-md h-12 border-2 text-base transition-all duration-300 focus:border-primary/50 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="email" className="flex items-center gap-3 text-base font-semibold">
                      <div className="flex size-5 items-center justify-center rounded-full bg-primary/10">
                        <User className="size-3 text-primary" />
                      </div>
                      Email
                    </Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={user?.email || ''}
                      disabled 
                      className="h-12 border-2 bg-muted/50 text-base"
                    />
                    <p className="text-caption leading-relaxed">
                      Para alterar seu email, entre em contato com o suporte
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t border-border/50 pt-8">
                <Button 
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="shadow-apple-md hover:shadow-apple-lg h-12 bg-gradient-to-r from-primary to-primary/90 px-8 font-semibold transition-all duration-500 hover:scale-105 hover:from-primary/90 hover:to-primary/80"
                >
                  <Save className="mr-3 size-5" />
                  {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Appearance Settings */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="surface-elevated shadow-apple-lg hover:shadow-apple-lg border-2 border-border/50 transition-all duration-500 hover:scale-[1.01] hover:border-primary/30">
              <CardHeader className="pb-8">
                <div className="flex items-center gap-4">
                  <div className="shadow-apple-sm flex size-14 items-center justify-center rounded-2xl border border-purple-200/50 bg-gradient-to-br from-purple-50 to-violet-100 dark:border-purple-800/50 dark:from-purple-950/50 dark:to-violet-950/50">
                    <Palette className="size-7 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-headline mb-2">Aparência</CardTitle>
                    <CardDescription className="text-body-large">Personalize o tema e a aparência da interface do LexAI.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <Label className="flex items-center gap-3 text-base font-semibold">
                    <div className="flex size-5 items-center justify-center rounded-full bg-primary/10">
                      <Palette className="size-3 text-primary" />
                    </div>
                    Tema da Interface
                  </Label>
                  <div className="surface-overlay flex items-center gap-6 rounded-xl border border-border/50 p-4">
                    <ThemeToggle />
                    <p className="text-caption leading-relaxed">
                      Escolha entre modo claro, escuro ou automático baseado no sistema
                    </p>
                  </div>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="shadow-apple-sm rounded-2xl border border-blue-200/50 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:border-blue-800/50 dark:from-blue-950/30 dark:to-indigo-950/30"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex size-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                      <Palette className="size-3 text-blue-600" />
                    </div>
                    <span className="font-semibold text-blue-800 dark:text-blue-200">Novidades em breve</span>
                  </div>
                  <p className="text-caption leading-relaxed text-blue-600 dark:text-blue-300">
                    Personalização avançada de cores, fontes e layout da interface para uma experiência ainda mais única
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Workspace Settings */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="surface-elevated shadow-apple-lg hover:shadow-apple-lg border-2 border-border/50 transition-all duration-500 hover:scale-[1.01] hover:border-primary/30">
              <CardHeader className="pb-8">
                <div className="flex items-center gap-4">
                  <div className="shadow-apple-sm flex size-14 items-center justify-center rounded-2xl border border-green-200/50 bg-gradient-to-br from-green-50 to-emerald-100 dark:border-green-800/50 dark:from-green-950/50 dark:to-emerald-950/50">
                    <Building className="size-7 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-headline mb-2">Workspace Atual</CardTitle>
                    <CardDescription className="text-body-large">Configure e gerencie seu ambiente de trabalho.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-10">
                <div className="space-y-4">
                  <Label htmlFor="workspace-name" className="flex items-center gap-3 text-base font-semibold">
                    <div className="flex size-5 items-center justify-center rounded-full bg-primary/10">
                      <Building className="size-3 text-primary" />
                    </div>
                    Nome do Workspace
                  </Label>
                  <Input 
                    id="workspace-name" 
                    value={workspaceName || currentWorkspace?.name || ''}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    placeholder="Nome do workspace"
                    className="shadow-apple-sm hover:shadow-apple-md h-12 border-2 text-base transition-all duration-300 focus:border-primary/50 focus:ring-primary/20"
                  />
                  <p className="text-caption leading-relaxed">
                    Este nome será visível para todos os membros do workspace
                  </p>
                  <Button 
                    onClick={handleSaveWorkspace}
                    disabled={isLoading || !workspaceName.trim()}
                    size="sm"
                    className="w-fit"
                  >
                    <Save className="mr-2 size-4" />
                    {isLoading ? 'Salvando...' : 'Salvar Nome'}
                  </Button>
                </div>
                
                <Separator className="bg-border/50" />
                
                {/* Danger Zone */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-6 items-center justify-center rounded-full bg-destructive/10">
                      <AlertTriangle className="size-3 text-destructive" />
                    </div>
                    <h4 className="text-headline text-destructive">Zona de Perigo</h4>
                  </div>
                  <div className="shadow-apple-sm rounded-2xl border-2 border-red-200/50 bg-gradient-to-r from-red-50 to-rose-50 p-6 dark:border-red-800/50 dark:from-red-950/30 dark:to-rose-950/30">
                    <p className="text-caption mb-6 leading-relaxed">
                      A exclusão do workspace removerá permanentemente todos os dados, agentes e documentos associados. 
                      <strong className="font-semibold text-destructive">Esta ação não pode ser desfeita.</strong>
                    </p>
                    <Button 
                      onClick={handleDeleteWorkspace}
                      disabled={isLoading}
                      variant="destructive" 
                      className="shadow-apple-sm hover:shadow-apple-md h-11 px-6 font-semibold transition-all duration-300 hover:scale-105 hover:bg-destructive/90"
                    >
                      <AlertTriangle className="mr-3 size-4" />
                      {isLoading ? 'Excluindo...' : 'Excluir Workspace Permanentemente'}
                    </Button>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
