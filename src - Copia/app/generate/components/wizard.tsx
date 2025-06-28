'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FileUploadEnhanced } from '@/components/file-upload-enhanced';
import { Progress } from '@/components/ui/progress';
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
import { useFocusManagement } from '@/hooks/use-focus-management';
import { Loader2, CheckCircle, ArrowLeft, ArrowRight, FileText, Lightbulb, User, Copy, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

      if (files.length > 0) {
        const attachmentDataUris = await Promise.all(files.map(fileToDataUri));
        const input: ContextualDocumentGenerationInput = {
          instructions: `Gerar um documento no modo "${generationMode}" usando o agente "${agent}" com as seguintes instruções: ${enhancedInstructions}`,
          attachmentDataUris,
        };
        // result = await contextualDocumentGeneration(input);
        result = { document: `Documento gerado com anexos para: ${input.instructions}` };
      } else {
        const input: GenerateDocumentOutlineInput = {
          instructions: `Gerar um documento usando o agente "${agent}" com as seguintes instruções: ${enhancedInstructions}`,
          format: generationMode,
        };
        // result = await generateDocumentOutline(input);
        result = { document: `Documento gerado em modo ${generationMode} para: ${input.instructions}` };
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      <AnnouncementRegion />
      <Card className="lg:col-span-1 flex flex-col">
        <CardHeader>
          <CardTitle id="wizard-title" className="font-headline">Gerar Novo Documento</CardTitle>
          <CardDescription>Siga os passos para criar seu documento com IA.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between">
            <div>
                <Progress value={progress} className="mb-6" />
                <div className="space-y-4">
                {steps.map(step => (
                    <div key={step.id} className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= step.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.id}
                    </div>
                    <div>
                        <h3 className={`font-semibold ${currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'}`}>{step.title}</h3>
                    </div>
                    </div>
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
                        transition={{ duration: 0.3 }}
                        id="step-content-1"
                        className="p-4 bg-muted/50 rounded-lg"
                      >
                        <h4 id="step-1-heading" className="font-semibold mb-4" tabIndex={-1}>1. Modo de Geração</h4>
                        <RadioGroup value={generationMode} onValueChange={(v) => setGenerationMode(v as 'outline' | 'full')} className="space-y-3">
                          <div className="flex items-start space-x-3 p-3 rounded-md hover:bg-background transition-colors">
                            <RadioGroupItem value="outline" id="r1" className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor="r1" className="font-medium cursor-pointer">Rascunho (Outline)</Label>
                              <p className="text-sm text-muted-foreground mt-1">Estrutura e tópicos principais do documento</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-3 rounded-md hover:bg-background transition-colors">
                            <RadioGroupItem value="full" id="r2" className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor="r2" className="font-medium cursor-pointer">Completo (Full)</Label>
                              <p className="text-sm text-muted-foreground mt-1">Documento jurídico completo e detalhado</p>
                            </div>
                          </div>
                        </RadioGroup>
                      </motion.div>
                    )}
                    {currentStep === 2 && (
                      <motion.div
                        key="step-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        id="step-content-2"
                        className="space-y-4"
                      >
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h4 id="step-2-heading" className="font-semibold mb-4" tabIndex={-1}>2. Seleção de Agente</h4>
                          <RadioGroup defaultValue="geral" onValueChange={setAgent} className="space-y-3">
                            {Object.entries(agentInfo).map(([key, info]) => (
                              <div key={key} className="flex items-start space-x-3 p-3 rounded-md hover:bg-background transition-colors">
                                <RadioGroupItem value={key} id={`agent-${key}`} className="mt-1" />
                                <div className="flex-1">
                                  <Label htmlFor={`agent-${key}`} className="font-medium cursor-pointer flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    {info.name}
                                  </Label>
                                  <p className="text-sm text-muted-foreground mt-1">{info.description}</p>
                                  <div className="flex gap-1 mt-2">
                                    {info.strengths.map((strength, idx) => (
                                      <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                        {strength}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                        {agent && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800"
                          >
                            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                              <Lightbulb className="w-4 h-4" />
                              <span className="font-medium">Agente Selecionado</span>
                            </div>
                            <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
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
                        transition={{ duration: 0.3 }}
                        id="step-content-3"
                        className="p-4 bg-muted/50 rounded-lg"
                      >
                        <h4 id="step-3-heading" className="font-semibold mb-4" tabIndex={-1}>3. Instruções</h4>
                        <Textarea 
                          placeholder="Descreva os fatos, fundamentos, e o que você precisa no documento..." 
                          value={instructions} 
                          onChange={(e) => setInstructions(e.target.value)} 
                          rows={6}
                          className="resize-none"
                        />
                        {instructions && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800"
                          >
                            <p className="text-sm text-green-800 dark:text-green-200">
                              ✓ Instruções definidas ({instructions.length} caracteres)
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
                        transition={{ duration: 0.3 }}
                        id="step-content-4"
                        className="p-4 bg-muted/50 rounded-lg"
                      >
                        <h4 id="step-4-heading" className="font-semibold mb-4" tabIndex={-1}>4. Anexos</h4>
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
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-md border border-blue-200 dark:border-blue-800"
                          >
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                              📄 Texto extraído por OCR será incluído na geração
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-300">
                              {extractedText.slice(0, 150)}...
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
            </div>
            <motion.div 
              className="flex justify-between items-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
                <Button variant="outline" onClick={prevStep} disabled={currentStep === 1 || isGenerating}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
                </Button>
                {currentStep < steps.length ? (
                <Button onClick={nextStep} disabled={isGenerating}>
                    Próximo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                ) : (
                <Button 
                    onClick={handleGenerate} 
                    disabled={isGenerating || !instructions}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
                >
                    {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando...</> : 'Gerar Documento'}
                </Button>
                )}
            </motion.div>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2 flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Documento Gerado</CardTitle>
          <CardDescription>O resultado da sua solicitação aparecerá aqui.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col bg-muted/30 rounded-b-lg">
          <AnimatePresence mode="wait">
            {isGenerating && (
              <motion.div
                key="generating"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="space-y-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="w-12 h-12 text-primary" />
                  </motion.div>
                  <div className="space-y-2">
                    <p className="font-semibold text-lg">Gerando seu documento...</p>
                    <motion.p
                      key={currentProgressStage}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-muted-foreground"
                    >
                      {progressStages[currentProgressStage]}
                    </motion.p>
                  </div>
                </div>
                <div className="w-full max-w-md space-y-2">
                  <Progress value={progressPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {Math.round(progressPercentage)}% concluído
                  </p>
                </div>
              </motion.div>
            )}
            {!isGenerating && !generatedDocument && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-8 space-y-6"
              >
                <div className="space-y-4">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <FileText className="w-16 h-16 mx-auto" />
                  </motion.div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground">Pronto para criar seu documento</h3>
                    <p className="max-w-md text-sm">Preencha as informações ao lado e clique em "Gerar Documento" para ver a mágica acontecer.</p>
                  </div>
                </div>
                {agent && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-4 bg-background rounded-lg border max-w-md"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-primary" />
                      <span className="font-medium text-sm text-foreground">
                        {agentInfo[agent as keyof typeof agentInfo].name}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
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
                className="flex-1 flex items-center justify-center"
              >
                <div className="text-destructive text-center">
                  <p className="font-medium mb-2">Erro na geração</p>
                  <p className="text-sm">{error}</p>
                </div>
              </motion.div>
            )}
            {generatedDocument && (
              <motion.div
                key="document"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex-1 flex flex-col space-y-4"
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-green-700 dark:text-green-400">Documento gerado com sucesso!</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-background rounded-md flex-1 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-body">{generatedDocument}</pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
