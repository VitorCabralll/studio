'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FileUpload } from '@/components/file-upload';
import { Progress } from '@/components/ui/progress';
import { generateDocumentOutline, GenerateDocumentOutlineInput } from '@/ai/flows/generate-document-outline';
import { contextualDocumentGeneration, ContextualDocumentGenerationInput } from '@/ai/flows/contextual-document-generation';
import { Loader2, CheckCircle, ArrowLeft, ArrowRight, FileText } from 'lucide-react';

const steps = [
  { id: 1, title: 'Modo de Geração' },
  { id: 2, title: 'Seleção de Agente' },
  { id: 3, title: 'Instruções' },
  { id: 4, title: 'Anexos' },
];

export function GenerationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [generationMode, setGenerationMode] = useState<'outline' | 'full'>('outline');
  const [agent, setAgent] = useState('geral');
  const [instructions, setInstructions] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedDocument('');
    setError(null);
    try {
      let result;
      if (files.length > 0) {
        const attachmentDataUris = await Promise.all(files.map(fileToDataUri));
        const input: ContextualDocumentGenerationInput = {
          instructions: `Gerar um documento no modo "${generationMode}" usando o agente "${agent}" com as seguintes instruções: ${instructions}`,
          attachmentDataUris,
        };
        result = await contextualDocumentGeneration(input);
      } else {
        const input: GenerateDocumentOutlineInput = {
          instructions: `Gerar um documento usando o agente "${agent}" com as seguintes instruções: ${instructions}`,
          format: generationMode,
        };
        result = await generateDocumentOutline(input);
      }
      setGeneratedDocument(result.document);
    } catch (e) {
      setError('Ocorreu um erro ao gerar o documento.');
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      <Card className="lg:col-span-1 flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Gerar Novo Documento</CardTitle>
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
                <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                {currentStep === 1 && (
                    <div>
                    <h4 className="font-semibold mb-2">1. Modo de Geração</h4>
                    <RadioGroup value={generationMode} onValueChange={(v) => setGenerationMode(v as 'outline' | 'full')}>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="outline" id="r1" /><Label htmlFor="r1">Rascunho (Outline)</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="full" id="r2" /><Label htmlFor="r2">Completo (Full)</Label></div>
                    </RadioGroup>
                    </div>
                )}
                {currentStep === 2 && (
                    <div>
                    <h4 className="font-semibold mb-2">2. Seleção de Agente</h4>
                    <RadioGroup defaultValue="geral" onValueChange={setAgent}>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="geral" id="a1" /><Label htmlFor="a1">Agente Geral</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="civil" id="a2" /><Label htmlFor="a2">Agente de Direito Civil</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="stj" id="a3" /><Label htmlFor="a3">Agente de Jurisprudência (STJ)</Label></div>
                    </RadioGroup>
                    </div>
                )}
                {currentStep === 3 && (
                    <div>
                    <h4 className="font-semibold mb-2">3. Instruções</h4>
                    <Textarea placeholder="Descreva os fatos, fundamentos, e o que você precisa no documento..." value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={6} />
                    </div>
                )}
                {currentStep === 4 && (
                    <div>
                    <h4 className="font-semibold mb-2">4. Anexos</h4>
                    <FileUpload onFilesChange={setFiles} />
                    </div>
                )}
                </div>
            </div>
            <div className="flex justify-between items-center mt-8">
                <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
                </Button>
                {currentStep < steps.length ? (
                <Button onClick={nextStep}>
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
            </div>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2 flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Documento Gerado</CardTitle>
          <CardDescription>O resultado da sua solicitação aparecerá aqui.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col bg-muted/30 rounded-b-lg">
          {isGenerating && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <p className="font-semibold">Gerando seu documento...</p>
              <p className="text-sm text-muted-foreground">Isso pode levar alguns segundos.</p>
            </div>
          )}
          {!isGenerating && !generatedDocument && (
             <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                <FileText className="w-16 h-16 mb-4" />
                <h3 className="font-semibold text-lg">Seu documento está pronto para ser criado</h3>
                <p className="max-w-md">Preencha as informações ao lado e clique em "Gerar Documento" para ver a mágica acontecer.</p>
             </div>
          )}
          {error && <div className="text-destructive">{error}</div>}
          {generatedDocument && (
            <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-background rounded-md h-full overflow-y-auto">
              <pre className="whitespace-pre-wrap font-body">{generatedDocument}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
