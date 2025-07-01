'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, AlertCircle, Bot, Brain, FileText, Upload, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Lazy load do componente de upload de arquivos
const FileUpload = dynamic(
  () => import('@/components/file-upload-enhanced').then(mod => ({ default: mod.FileUploadEnhanced })),
  {
    loading: () => (
      <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
        <div className="animate-pulse">
          <div className="mx-auto mb-4 size-16 rounded-full bg-muted"></div>
          <p className="text-sm text-muted-foreground">Carregando área de upload...</p>
        </div>
      </div>
    ),
  }
);

import { useAuth } from '@/hooks/use-auth';
import { useToast } from "@/hooks/use-toast";
import { legalAreas } from '@/lib/legal-constants';
import { updateUserProfile } from '@/services/user-service';

export function CriarAgenteClient() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, updateUserProfileState } = useAuth();
  const [agentName, setAgentName] = useState('');
  const [materia, setMateria] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = agentName.trim() !== '' && materia !== '';

  const handleCreateAgent = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || !user) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsCreating(true);
    setError(null);
    
    try {
      // Simulate agent creation
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update user profile to mark the end of the initial setup flow
      const result = await updateUserProfile(user.uid, { initial_setup_complete: true });
      if (result.success) {
        updateUserProfileState({ initial_setup_complete: true });
        
        console.log("Agente criado com sucesso!", { agentName, materia, files: files.map(f => f.name) });
        
        // Show success toast
        toast({
          title: "Agente criado com sucesso!",
          description: `O agente "${agentName}" foi criado e está pronto para uso.`,
        });
        
        // Small delay before redirect to ensure toast is shown
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        console.error("Erro ao atualizar perfil:", result.error);
        setError('Erro ao finalizar configuração. Tente novamente.');
        setIsCreating(false);
      }
      
    } catch (error) {
      console.error("Erro não tratado ao criar agente:", error);
      setError('Erro ao criar o agente. Tente novamente.');
      setIsCreating(false);
    }
  };

  // Prevent form submission on Enter key if form is not valid
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !canSubmit) {
      event.preventDefault();
    }
  };

  return (
    <div className="to-primary/3 flex min-h-screen flex-1 items-center justify-center bg-gradient-to-br from-background via-background p-4 md:p-8">
      {/* Background Pattern */}
      <div className="bg-grid-slate-100/50 dark:bg-grid-slate-800/50 pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-4xl"
      >
        <Card className="surface-elevated shadow-apple-lg border-2 border-border/50">
          <form onSubmit={handleCreateAgent} onKeyDown={handleKeyPress}>
            <CardHeader className="space-y-8 pb-8 text-center">
              {/* Logo/Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                className="shadow-apple-lg mx-auto flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80"
              >
                <Bot className="size-10 text-white" />
              </motion.div>
              
              {/* Hero Text */}
              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-display"
                >
                  Criar Novo Agente de IA
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-body-large mx-auto max-w-2xl text-muted-foreground"
                >
                  Crie um assistente jurídico especializado, treinado com seus documentos e personalizado para sua área de atuação
                </motion.p>
              </div>
              
              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center gap-6 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <Brain className="size-4 text-primary" />
                  <span>IA Personalizada</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-primary" />
                  <span>Documentos Próprios</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  <span>Resultados Precisos</span>
                </div>
              </motion.div>
            </CardHeader>
            <CardContent className="space-y-8">
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4"
                  >
                    <AlertCircle className="size-5 shrink-0 text-destructive" />
                    <span className="text-sm font-medium text-destructive">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-6"
              >
                {/* Nome do Agente */}
                <div className="space-y-3">
                  <Label htmlFor="agent-name" className="flex items-center gap-2 text-base font-medium">
                    <Bot className="size-4 text-primary" />
                    Nome do Agente *
                  </Label>
                  <Input 
                    id="agent-name" 
                    placeholder="Ex: Especialista em Contratos Imobiliários" 
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    required 
                    disabled={isCreating}
                    className="h-12 text-base transition-all focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="text-sm text-muted-foreground">
                    Dê um nome descritivo que reflita a especialidade do seu agente
                  </p>
                </div>
                
                {/* Matéria do Direito */}
                <div className="space-y-3">
                  <Label htmlFor="materia-direito" className="flex items-center gap-2 text-base font-medium">
                    <Brain className="size-4 text-primary" />
                    Área de Especialização *
                  </Label>
                  <Select required value={materia} onValueChange={setMateria} disabled={isCreating}>
                    <SelectTrigger id="materia-direito" className="h-12 text-base">
                      <SelectValue placeholder="Selecione a área de direito..." />
                    </SelectTrigger>
                    <SelectContent>
                      {legalAreas.map(item => (
                        <SelectItem key={item} value={item} className="py-3 text-base">
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {materia && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950"
                    >
                      <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                        <CheckCircle className="size-4" />
                        <span className="text-sm font-medium">Área selecionada: {materia}</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Upload de Documentos */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-base font-medium">
                    <Upload className="size-4 text-primary" />
                    Documentos de Treinamento
                    <span className="text-sm font-normal text-muted-foreground">(Opcional)</span>
                  </Label>
                  <div className="space-y-3">
                    <FileUpload onFilesChange={setFiles} />
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                      <div className="flex items-start gap-3">
                        <FileText className="mt-0.5 size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            Como funciona o treinamento personalizado?
                          </p>
                          <ul className="space-y-1 text-xs text-blue-600 dark:text-blue-300">
                            <li>• Envie documentos modelo da sua prática (contratos, petições, etc.)</li>
                            <li>• O agente aprenderá seu estilo de redação e terminologia</li>
                            <li>• Documentos são processados localmente e não são armazenados</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    {files.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950"
                      >
                        <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                          <CheckCircle className="size-4" />
                          <span className="text-sm font-medium">
                            {files.length} documento{files.length > 1 ? 's' : ''} carregado{files.length > 1 ? 's' : ''} para treinamento
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </CardContent>
            <CardFooter className="flex flex-col justify-between gap-4 border-t pt-8 md:flex-row">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="outline" type="button" asChild disabled={isCreating} className="w-full md:w-auto">
                  <Link href="/">
                    <ArrowLeft className="mr-2 size-4" /> 
                    Voltar ao Dashboard
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: canSubmit && !isCreating ? 1.02 : 1 }}
                whileTap={{ scale: canSubmit && !isCreating ? 0.98 : 1 }}
                className="w-full md:w-auto"
              >
                <Button 
                  type="submit" 
                  disabled={!canSubmit || isCreating} 
                  className="h-12 w-full bg-gradient-to-r from-primary to-primary/90 px-8 text-base font-medium transition-all hover:from-primary/90 hover:to-primary md:w-auto"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 size-5 animate-spin" />
                      Criando seu agente...
                    </>
                  ) : (
                    <>
                      <Bot className="mr-2 size-5" />
                      Criar Agente Personalizado
                      <ArrowRight className="ml-2 size-5" />
                    </>
                  )}
                </Button>
              </motion.div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}