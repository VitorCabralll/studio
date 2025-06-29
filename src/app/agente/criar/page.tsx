'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import dynamic from 'next/dynamic';
import { ArrowLeft, Loader2, AlertCircle, Bot, Brain, FileText, Upload, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load do componente de upload de arquivos
const FileUpload = dynamic(
  () => import('@/components/file-upload').then(mod => ({ default: mod.FileUpload })),
  {
    ssr: false,
    loading: () => (
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Carregando área de upload...</p>
        </div>
      </div>
    ),
  }
);
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { updateUserProfile } from '@/services/user-service';
import { legalAreas } from '@/lib/legal-constants';
import { useToast } from "@/hooks/use-toast";

export default function CreateAgentPage() {
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
    <div className="flex-1 p-4 md:p-8 bg-gradient-to-br from-background via-background to-primary/5 min-h-screen flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-200/20 dark:bg-grid-slate-700/20 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-3xl"
      >
        <Card className="shadow-2xl border-primary/10">
          <form onSubmit={handleCreateAgent} onKeyPress={handleKeyPress}>
            <CardHeader className="text-center space-y-6 pb-8">
              {/* Logo/Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-4"
              >
                <Bot className="w-8 h-8 text-white" />
              </motion.div>
              
              {/* Hero Text */}
              <div className="space-y-3">
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold font-headline tracking-tight"
                >
                  Criar Novo Agente de IA
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground text-lg max-w-2xl mx-auto"
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
                  <Brain className="w-4 h-4 text-primary" />
                  <span>IA Personalizada</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span>Documentos Próprios</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
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
                  className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
                >
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                  <span className="text-sm text-destructive font-medium">{error}</span>
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
                <Label htmlFor="agent-name" className="text-base font-medium flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" />
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
                <Label htmlFor="materia-direito" className="text-base font-medium flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" />
                  Área de Especialização *
                </Label>
                <Select required value={materia} onValueChange={setMateria} disabled={isCreating}>
                  <SelectTrigger id="materia-direito" className="h-12 text-base">
                    <SelectValue placeholder="Selecione a área de direito..." />
                  </SelectTrigger>
                  <SelectContent>
                    {legalAreas.map(item => (
                      <SelectItem key={item} value={item} className="text-base py-3">
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {materia && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800"
                  >
                    <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium text-sm">Área selecionada: {materia}</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Upload de Documentos */}
              <div className="space-y-3">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Upload className="w-4 h-4 text-primary" />
                  Documentos de Treinamento
                  <span className="text-sm font-normal text-muted-foreground">(Opcional)</span>
                </Label>
                <div className="space-y-3">
                  <FileUpload onFilesChange={setFiles} />
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Como funciona o treinamento personalizado?
                        </p>
                        <ul className="text-xs text-blue-600 dark:text-blue-300 space-y-1">
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
                      className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800"
                    >
                      <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium text-sm">
                          {files.length} documento{files.length > 1 ? 's' : ''} carregado{files.length > 1 ? 's' : ''} para treinamento
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </CardContent>
          <CardFooter className="flex flex-col md:flex-row justify-between gap-4 pt-8 border-t">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="outline" type="button" asChild disabled={isCreating} className="w-full md:w-auto">
                    <Link href="/">
                      <ArrowLeft className="mr-2 h-4 w-4" /> 
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
                  className="w-full md:w-auto h-12 px-8 text-base font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Criando seu agente...
                    </>
                  ) : (
                    <>
                      <Bot className="mr-2 h-5 w-5" />
                      Criar Agente Personalizado
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </motion.div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}