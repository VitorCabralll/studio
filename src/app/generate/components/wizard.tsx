'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, ArrowLeft, ArrowRight, FileText, Lightbulb, User, Copy, Download } from 'lucide-react';
import { useState } from 'react';

import { FileUploadEnhanced } from '@/components/file-upload-enhanced';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useFocusManagement } from '@/hooks/use-focus-management';

// Temporarily commented out to fix import errors
// import { generateDocumentOutline, GenerateDocumentOutlineInput } from '@/ai/flows/generate-document-outline';
// import { contextualDocumentGeneration, ContextualDocumentGenerationInput } from '@/ai/flows/contextual-document-generation';

// Temporary types
type GenerateDocumentOutlineInput = {
  instructions: string;
  attachments?: string[];
  format?: 'outline' | 'full';
};

type ContextualDocumentGenerationInput = {
  instructions: string;
  attachmentDataUris?: string[];
};

const steps = [
  { id: 1, title: 'Modo de Geração' },
  { id: 2, title: 'Seleção de Agente' },
  { id: 3, title: 'Instruções' },
  { id: 4, title: 'Anexos' },
];

const progressStages = [
  'Analisando instruções...',
  'Processando anexos...',
  'Consultando base jurídica...',
  'Estruturando documento...',
  'Finalizando conteúdo...'
];

const agentInfo = {
  geral: {
    name: 'Agente Geral',
    description: 'Especialista em documentos jurídicos diversos, ideal para casos gerais.',
    strengths: ['Versatilidade', 'Linguagem clara', 'Estrutura sólida']
  },
  civil: {
    name: 'Agente de Direito Civil',
    description: 'Focado em contratos, responsabilidade civil e direitos reais.',
    strengths: ['Contratos', 'Responsabilidade civil', 'Direitos reais']
  },
  stj: {
    name: 'Agente de Jurisprudência (STJ)',
    description: 'Especializado em jurisprudência e precedentes do STJ.',
    strengths: ['Jurisprudência', 'Precedentes', 'Fundamentação sólida']
  }
};

export function GenerationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [generationMode, setGenerationMode] = useState<'outline' | 'full'>('outline');
  const [agent, setAgent] = useState('geral');
  const [instructions, setInstructions] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [extractedText, setExtractedText] = useState('');
  const [structuredData, setStructuredData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentProgressStage, setCurrentProgressStage] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  
  const { focusHeading, announce, AnnouncementRegion } = useFocusManagement();

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const simulateProgress = () => {
    setCurrentProgressStage(0);
    setProgressPercentage(0);
    
    const interval = setInterval(() => {
      setProgressPercentage(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        // Atualize o estágio baseado no progresso
        const stageIndex = Math.floor((newProgress / 100) * progressStages.length);
        setCurrentProgressStage(Math.min(stageIndex, progressStages.length - 1));
        
        return newProgress;
      });
    }, 800);
    
    return interval;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedDocument('');
    setError(null);
    
    const progressInterval = simulateProgress();
    
    try {
      let result;
      
      // Combinar instruções do usuário com texto extraído por OCR
      let enhancedInstructions = instructions;
      if (extractedText) {
        enhancedInstructions += `\n\nTexto extraído de documentos anexados:\n${extractedText}`;
      }
      if (structuredData) {
        enhancedInstructions += `\n\nDados estruturados detectados:\n${JSON.stringify(structuredData.structured, null, 2)}`;
      }

      // Preparar dados para API
      const attachmentDataUris = files.length > 0 
        ? await Promise.all(files.map(fileToDataUri))
        : [];

      const apiRequest = {
        instructions: enhancedInstructions,
        attachments: attachmentDataUris,
        agent: agent as 'geral' | 'civil' | 'stj',
        mode: generationMode
      };

      // Chamar API real de geração
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiRequest)
      });

      const apiResult = await response.json();
      
      if (apiResult.success) {
        result = { document: apiResult.document };
      } else {
        throw new Error(apiResult.error?.message || 'Erro na geração do documento');
      }
      
      clearInterval(progressInterval);
      setProgressPercentage(100);
      setCurrentProgressStage(progressStages.length - 1);
      
      // Pequeno delay para mostrar o progresso completo
      setTimeout(() => {
        setGeneratedDocument(result.document);
        announce('Documento gerado com sucesso!');
      }, 500);
      
    } catch (e) {
      clearInterval(progressInterval);
      setError('Ocorreu um erro ao gerar o documento.');
      console.error(e);
      announce('Erro ao gerar documento.');
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setProgressPercentage(0);
        setCurrentProgressStage(0);
      }, 500);
    }
  };

  const nextStep = () => {
    const newStep = Math.min(currentStep + 1, steps.length);
    setCurrentStep(newStep);
    const stepTitle = steps.find(s => s.id === newStep)?.title;
    focusHeading(`step-${newStep}-heading`, `Avançado para etapa ${newStep}: ${stepTitle}`);
  };
  
  const prevStep = () => {
    const newStep = Math.max(currentStep - 1, 1);
    setCurrentStep(newStep);
    const stepTitle = steps.find(s => s.id === newStep)?.title;
    focusHeading(`step-${newStep}-heading`, `Voltado para etapa ${newStep}: ${stepTitle}`);
  };
  
  const copyToClipboard = async () => {
    if (generatedDocument) {
      await navigator.clipboard.writeText(generatedDocument);
      announce('Documento copiado para a área de transferência!');
    }
  };
  
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-3">
      <AnnouncementRegion />
      <Card className="surface-elevated shadow-apple-md hover:shadow-apple-lg flex flex-col transition-all duration-500 lg:col-span-1">
        <CardHeader className="pb-6">
          <CardTitle id="wizard-title" className="text-headline">Gerar Novo Documento</CardTitle>
          <CardDescription className="text-body-large">Siga os passos para criar seu documento com IA.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col justify-between">
            <div>
                <div className="mb-8">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-caption font-medium">Progresso</span>
                    <span className="text-caption">{currentStep}/{steps.length}</span>
                  </div>
                  <Progress value={progress} className="shadow-apple-sm h-2" />
                </div>
                <div className="space-y-3">
                {steps.map(step => (
                    <motion.div 
                      key={step.id} 
                      className="flex items-center gap-4 rounded-xl p-3 transition-all duration-300"
                      animate={{
                        backgroundColor: currentStep === step.id ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                        scale: currentStep === step.id ? 1.02 : 1
                      }}
                    >
                    <div className={`flex size-10 items-center justify-center rounded-full transition-all duration-300 ${
                      currentStep > step.id 
                        ? 'shadow-apple-sm bg-green-500 text-white' 
                        : currentStep === step.id 
                        ? 'shadow-apple-md bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                        {currentStep > step.id ? <CheckCircle className="size-5" /> : step.id}
                    </div>
                    <div className="flex-1">
                        <h3 className={`font-semibold transition-colors ${
                          currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                        }`}>{step.title}</h3>
                        {currentStep === step.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-caption mt-1"
                          >
                            Em andamento...
                          </motion.div>
                        )}
                    </div>
                    </motion.div>
                ))}
                </div>
                <div className="mt-8 space-y-4">
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div
                        key="step-1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        id="step-content-1"
                        className="surface-overlay shadow-apple-sm rounded-2xl border border-border/50 p-6"
                      >
                        <h4 id="step-1-heading" className="text-headline mb-6" tabIndex={-1}>1. Modo de Geração</h4>
                        <RadioGroup value={generationMode} onValueChange={(v) => setGenerationMode(v as 'outline' | 'full')} className="space-y-4">
                          <motion.div 
                            className="hover:shadow-apple-sm group relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 hover:scale-[1.02]"
                            whileHover={{ y: -2 }}
                            animate={{
                              borderColor: generationMode === 'outline' ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                              backgroundColor: generationMode === 'outline' ? 'hsl(var(--primary) / 0.05)' : 'transparent'
                            }}
                          >
                            <div className="flex items-start space-x-4">
                              <RadioGroupItem value="outline" id="r1" className="mt-1" />
                              <div className="flex-1">
                                <Label htmlFor="r1" className="cursor-pointer text-base font-semibold">Rascunho (Outline)</Label>
                                <p className="text-caption mt-2 leading-relaxed">Estrutura e tópicos principais do documento para organização inicial</p>
                              </div>
                            </div>
                          </motion.div>
                          <motion.div 
                            className="hover:shadow-apple-sm group relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 hover:scale-[1.02]"
                            whileHover={{ y: -2 }}
                            animate={{
                              borderColor: generationMode === 'full' ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                              backgroundColor: generationMode === 'full' ? 'hsl(var(--primary) / 0.05)' : 'transparent'
                            }}
                          >
                            <div className="flex items-start space-x-4">
                              <RadioGroupItem value="full" id="r2" className="mt-1" />
                              <div className="flex-1">
                                <Label htmlFor="r2" className="cursor-pointer text-base font-semibold">Completo (Full)</Label>
                                <p className="text-caption mt-2 leading-relaxed">Documento jurídico completo e detalhado, pronto para uso</p>
                              </div>
                            </div>
                          </motion.div>
                        </RadioGroup>
                      </motion.div>
                    )}
                    {currentStep === 2 && (
                      <motion.div
                        key="step-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        id="step-content-2"
                        className="space-y-6"
                      >
                        <div className="surface-overlay shadow-apple-sm rounded-2xl border border-border/50 p-6">
                          <h4 id="step-2-heading" className="text-headline mb-6" tabIndex={-1}>2. Seleção de Agente</h4>
                          <RadioGroup defaultValue="geral" onValueChange={setAgent} className="space-y-4">
                            {Object.entries(agentInfo).map(([key, info]) => (
                              <motion.div 
                                key={key} 
                                className="hover:shadow-apple-sm group relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 hover:scale-[1.02]"
                                whileHover={{ y: -2 }}
                                animate={{
                                  borderColor: agent === key ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                                  backgroundColor: agent === key ? 'hsl(var(--primary) / 0.05)' : 'transparent'
                                }}
                              >
                                <div className="flex items-start space-x-4">
                                  <RadioGroupItem value={key} id={`agent-${key}`} className="mt-1" />
                                  <div className="flex-1">
                                    <Label htmlFor={`agent-${key}`} className="mb-2 flex cursor-pointer items-center gap-3 text-base font-semibold">
                                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                                        <User className="size-4 text-primary" />
                                      </div>
                                      {info.name}
                                    </Label>
                                    <p className="text-caption mb-3 leading-relaxed">{info.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                      {info.strengths.map((strength, idx) => (
                                        <span key={idx} className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                          {strength}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </RadioGroup>
                        </div>
                        {agent && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="shadow-apple-sm rounded-xl border border-blue-200/50 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:border-blue-800/50 dark:from-blue-950/50 dark:to-indigo-950/50"
                          >
                            <div className="mb-2 flex items-center gap-3 text-blue-800 dark:text-blue-200">
                              <div className="flex size-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                <Lightbulb className="size-3" />
                              </div>
                              <span className="font-semibold">Agente Selecionado</span>
                            </div>
                            <p className="text-caption leading-relaxed text-blue-600 dark:text-blue-300">
                              {agentInfo[agent as keyof typeof agentInfo].description}
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                    {currentStep === 3 && (
                      <motion.div
                        key="step-3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        id="step-content-3"
                        className="surface-overlay shadow-apple-sm rounded-2xl border border-border/50 p-6"
                      >
                        <h4 id="step-3-heading" className="text-headline mb-6" tabIndex={-1}>3. Instruções</h4>
                        <div className="space-y-4">
                          <Textarea 
                            placeholder="Descreva os fatos, fundamentos, e o que você precisa no documento..." 
                            value={instructions} 
                            onChange={(e) => setInstructions(e.target.value)} 
                            rows={8}
                            className="shadow-apple-sm resize-none border-2 text-base leading-relaxed transition-all duration-300 focus:border-primary/50 focus:ring-primary/20"
                          />
                          <div className="text-caption flex items-center justify-between">
                            <span>Seja específico para melhores resultados</span>
                            <span className={instructions.length > 50 ? 'text-green-600' : 'text-muted-foreground'}>
                              {instructions.length} caracteres
                            </span>
                          </div>
                        </div>
                        {instructions && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="shadow-apple-sm mt-6 rounded-xl border border-green-200/50 bg-gradient-to-r from-green-50 to-emerald-50 p-4 dark:border-green-800/50 dark:from-green-950/50 dark:to-emerald-950/50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex size-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                                <CheckCircle className="size-3 text-green-600" />
                              </div>
                              <span className="font-semibold text-green-800 dark:text-green-200">
                                Instruções definidas
                              </span>
                            </div>
                            <p className="text-caption mt-2 text-green-600 dark:text-green-300">
                              {instructions.length} caracteres • {instructions.split('\n').length} linhas
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                    {currentStep === 4 && (
                      <motion.div
                        key="step-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        id="step-content-4"
                        className="surface-overlay shadow-apple-sm rounded-2xl border border-border/50 p-6"
                      >
                        <h4 id="step-4-heading" className="text-headline mb-6" tabIndex={-1}>4. Anexos</h4>
                        <div className="space-y-6">
                          <FileUploadEnhanced 
                            onFilesChange={setFiles}
                            onTextExtracted={(text, structured) => {
                              setExtractedText(text);
                              setStructuredData(structured);
                              announce(`Texto extraído com sucesso! ${text.length} caracteres processados.`);
                            }}
                            enableOCR={true}
                          />
                          {extractedText && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ duration: 0.3 }}
                              className="shadow-apple-sm rounded-xl border border-blue-200/50 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:border-blue-800/50 dark:from-blue-950/50 dark:to-indigo-950/50"
                            >
                              <div className="mb-3 flex items-center gap-3">
                                <div className="flex size-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                  <FileText className="size-3 text-blue-600" />
                                </div>
                                <span className="font-semibold text-blue-800 dark:text-blue-200">
                                  Texto extraído por OCR
                                </span>
                              </div>
                              <p className="text-caption mb-3 text-blue-600 dark:text-blue-300">
                                {extractedText.length} caracteres processados e prontos para análise
                              </p>
                              <div className="rounded-lg border border-blue-200/30 bg-white/50 p-3 dark:border-blue-800/30 dark:bg-black/20">
                                <p className="text-caption font-mono leading-relaxed">
                                  {extractedText.slice(0, 200)}...
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
            </div>
            <motion.div 
              className="mt-8 flex items-center justify-between border-t border-border/50 pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
                <Button 
                  variant="outline" 
                  onClick={prevStep} 
                  disabled={currentStep === 1 || isGenerating}
                  className="hover:shadow-apple-sm h-11 px-6 font-medium transition-all duration-300"
                >
                    <ArrowLeft className="mr-2 size-4" /> Anterior
                </Button>
                {currentStep < steps.length ? (
                <Button 
                  onClick={nextStep} 
                  disabled={isGenerating}
                  className="shadow-apple-sm hover:shadow-apple-md h-11 bg-primary px-6 font-medium transition-all duration-300 hover:scale-105 hover:bg-primary/90"
                >
                    Próximo <ArrowRight className="ml-2 size-4" />
                </Button>
                ) : (
                <Button 
                    onClick={handleGenerate} 
                    disabled={isGenerating || !instructions}
                    className="shadow-apple-lg hover:shadow-apple-lg h-12 bg-gradient-to-r from-primary to-primary/90 px-8 font-semibold transition-all duration-500 hover:scale-105 hover:from-primary/90 hover:to-primary/80"
                >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-3 size-5 animate-spin" /> 
                        Gerando...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-3 size-5" />
                        Gerar Documento
                      </>
                    )}
                </Button>
                )}
            </motion.div>
        </CardContent>
      </Card>
      
      <Card className="surface-elevated shadow-apple-md hover:shadow-apple-lg flex flex-col transition-all duration-500 lg:col-span-2">
        <CardHeader className="pb-6">
          <CardTitle className="text-headline">Documento Gerado</CardTitle>
          <CardDescription className="text-body-large">O resultado da sua solicitação aparecerá aqui.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col rounded-b-lg bg-gradient-to-br from-background via-background to-muted/30">
          <AnimatePresence mode="wait">
            {isGenerating && (
              <motion.div
                key="generating"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-1 flex-col items-center justify-center space-y-8 p-8 text-center"
              >
                <div className="space-y-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="relative"
                  >
                    <div className="shadow-apple-md flex size-16 items-center justify-center rounded-full bg-primary/10">
                      <Loader2 className="size-8 text-primary" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border-2 border-primary/20"
                    />
                  </motion.div>
                  <div className="space-y-3">
                    <h3 className="text-headline">Gerando seu documento...</h3>
                    <motion.p
                      key={currentProgressStage}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-body-large text-muted-foreground"
                    >
                      {progressStages[currentProgressStage]}
                    </motion.p>
                  </div>
                </div>
                <div className="w-full max-w-md space-y-4">
                  <Progress value={progressPercentage} className="shadow-apple-sm h-3" />
                  <div className="text-caption flex items-center justify-between">
                    <span>Processando...</span>
                    <span className="font-medium">
                      {Math.round(progressPercentage)}% concluído
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
            {!isGenerating && !generatedDocument && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-1 flex-col items-center justify-center space-y-8 p-12 text-center"
              >
                <div className="space-y-6">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="relative"
                  >
                    <div className="shadow-apple-md flex size-20 items-center justify-center rounded-2xl bg-primary/10">
                      <FileText className="size-10 text-primary" />
                    </div>
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-green-500"
                    >
                      <CheckCircle className="size-3 text-white" />
                    </motion.div>
                  </motion.div>
                  <div className="max-w-lg space-y-3">
                    <h3 className="text-headline">Pronto para criar seu documento</h3>
                    <p className="text-body-large leading-relaxed text-muted-foreground">
                      Preencha as informações ao lado e clique em &quot;Gerar Documento&quot; para ver a mágica acontecer.
                    </p>
                  </div>
                </div>
                {agent && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="surface-elevated shadow-apple-sm max-w-md rounded-2xl border border-border/50 p-6"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                        <User className="size-4 text-primary" />
                      </div>
                      <span className="text-base font-semibold">
                        {agentInfo[agent as keyof typeof agentInfo].name}
                      </span>
                    </div>
                    <p className="text-caption leading-relaxed">
                      {agentInfo[agent as keyof typeof agentInfo].description}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-1 items-center justify-center"
              >
                <div className="text-center text-destructive">
                  <p className="mb-2 font-medium">Erro na geração</p>
                  <p className="text-sm">{error}</p>
                </div>
              </motion.div>
            )}
            {generatedDocument && (
              <motion.div
                key="document"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-1 flex-col space-y-0"
              >
                <div className="flex items-center justify-between border-b border-border/50 bg-gradient-to-r from-green-50 to-emerald-50 p-6 dark:from-green-950/30 dark:to-emerald-950/30">
                  <div className="flex items-center gap-3">
                    <div className="shadow-apple-sm flex size-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                      <CheckCircle className="size-4 text-green-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-green-800 dark:text-green-200">Documento gerado com sucesso!</span>
                      <p className="text-caption text-green-600 dark:text-green-300">Pronto para revisão e uso</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyToClipboard}
                      className="hover:shadow-apple-sm font-medium transition-all duration-300"
                    >
                      <Copy className="mr-2 size-4" />
                      Copiar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="hover:shadow-apple-sm font-medium transition-all duration-300"
                    >
                      <Download className="mr-2 size-4" />
                      Exportar
                    </Button>
                  </div>
                </div>
                <div className="prose prose-sm dark:prose-invert surface-overlay max-w-none flex-1 overflow-y-auto p-6">
                  <pre className="whitespace-pre-wrap font-body text-base leading-relaxed">{generatedDocument}</pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
