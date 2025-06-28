'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useOCR, OCRResult } from '@/hooks/use-ocr';
import { useFocusManagement } from '@/hooks/use-focus-management';
import { 
  FileImage, 
  ScanText, 
  Copy, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  Eye,
  FileText,
  Loader2
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface OCRProcessorProps {
  onTextExtracted?: (text: string, structured?: any) => void;
  onResults?: (results: OCRResult[]) => void;
  maxFiles?: number;
  language?: string;
  enableStructuredExtraction?: boolean;
}

export function OCRProcessor({
  onTextExtracted,
  onResults,
  maxFiles = 5,
  language = 'por+eng',
  enableStructuredExtraction = true,
}: OCRProcessorProps) {
  const [results, setResults] = useState<OCRResult[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [extractedText, setExtractedText] = useState('');
  const [structuredData, setStructuredData] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const { announce, AnnouncementRegion } = useFocusManagement();
  
  const {
    isProcessing,
    progress,
    error,
    processMultipleImages,
    extractCleanText,
    extractStructuredText,
    cleanup,
  } = useOCR({ language });

  // Configuração do dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    
    if (imageFiles.length === 0) {
      announce('Nenhum arquivo de imagem válido foi selecionado.');
      return;
    }
    
    if (imageFiles.length > maxFiles) {
      announce(`Máximo de ${maxFiles} arquivos permitidos. Selecionados apenas os primeiros ${maxFiles}.`);
      setSelectedImages(imageFiles.slice(0, maxFiles));
    } else {
      setSelectedImages(imageFiles);
      announce(`${imageFiles.length} arquivo(s) selecionado(s) para OCR.`);
    }
  }, [maxFiles, announce]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff'],
      'application/pdf': ['.pdf'],
    },
    maxFiles,
    multiple: true,
  });

  // Processar imagens selecionadas
  const handleProcessImages = async () => {
    if (selectedImages.length === 0) return;

    try {
      announce('Iniciando processamento OCR...');
      const ocrResults = await processMultipleImages(selectedImages);
      
      setResults(ocrResults);
      
      // Combinar todo o texto extraído
      const combinedText = ocrResults
        .map(result => extractCleanText(result))
        .join('\n\n--- PRÓXIMO DOCUMENTO ---\n\n');
      
      setExtractedText(combinedText);

      // Extrair dados estruturados se habilitado
      if (enableStructuredExtraction && ocrResults.length > 0) {
        const structured = extractStructuredText(ocrResults[0]);
        setStructuredData(structured);
      }

      // Callbacks
      onTextExtracted?.(combinedText, structuredData);
      onResults?.(ocrResults);

      announce(`OCR concluído! ${ocrResults.length} documento(s) processado(s).`);
    } catch (err) {
      console.error('Erro no processamento OCR:', err);
      announce('Erro durante o processamento OCR.');
    }
  };

  // Copiar texto para clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(extractedText);
      announce('Texto copiado para a área de transferência.');
    } catch (err) {
      console.error('Erro ao copiar:', err);
      announce('Erro ao copiar texto.');
    }
  };

  // Download do texto como arquivo
  const downloadText = () => {
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `texto-extraido-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    announce('Download do texto iniciado.');
  };

  // Limpar resultados
  const clearResults = () => {
    setResults([]);
    setSelectedImages([]);
    setExtractedText('');
    setStructuredData(null);
    cleanup();
    announce('Resultados limpos.');
  };

  return (
    <div className="space-y-6">
      <AnnouncementRegion />
      
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScanText className="h-5 w-5" />
            OCR - Extração de Texto Local
          </CardTitle>
          <CardDescription>
            Extraia texto de imagens e PDFs diretamente no seu navegador. 
            Seus documentos não saem do seu computador.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
              }
              ${selectedImages.length > 0 ? 'bg-muted/30' : ''}
            `}
          >
            <input {...getInputProps()} />
            <FileImage className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            
            {isDragActive ? (
              <p className="text-lg font-medium">Solte os arquivos aqui...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">
                  Arraste imagens ou PDFs aqui, ou clique para selecionar
                </p>
                <p className="text-sm text-muted-foreground">
                  Formatos suportados: PNG, JPG, JPEG, GIF, BMP, TIFF, PDF
                  {maxFiles > 1 && ` (máximo ${maxFiles} arquivos)`}
                </p>
              </div>
            )}
          </div>

          {/* Arquivos selecionados */}
          {selectedImages.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Arquivos selecionados:</h4>
              <div className="space-y-2">
                {selectedImages.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm font-medium">{file.name}</span>
                      <Badge variant="secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
                      aria-label={`Remover ${file.name}`}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex gap-2 mt-4">
            <Button
              onClick={handleProcessImages}
              disabled={selectedImages.length === 0 || isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <ScanText className="h-4 w-4 mr-2" />
                  Extrair Texto ({selectedImages.length})
                </>
              )}
            </Button>
            
            {results.length > 0 && (
              <Button variant="outline" onClick={clearResults}>
                Limpar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      {isProcessing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span>{Math.round(progress.progress * 100)}%</span>
              </div>
              <Progress value={progress.progress * 100} />
              <p className="text-sm text-muted-foreground">{progress.message}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Texto Extraído
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                  <Eye className="h-4 w-4 mr-2" />
                  {showPreview ? 'Ocultar' : 'Visualizar'}
                </Button>
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
                <Button variant="outline" size="sm" onClick={downloadText}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              {results.length} documento(s) processado(s) • 
              Confiança média: {Math.round(results.reduce((acc, r) => acc + r.confidence, 0) / results.length)}%
            </CardDescription>
          </CardHeader>
          
          {showPreview && (
            <CardContent>
              <Textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                className="min-h-64 font-mono text-sm"
                placeholder="Texto extraído aparecerá aqui..."
              />
              
              {/* Dados estruturados */}
              {enableStructuredExtraction && structuredData && (
                <div className="mt-4">
                  <Separator className="my-4" />
                  <h4 className="font-medium mb-2">Dados Estruturados Detectados:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(structuredData.structured).map(([key, values]) => {
                      const valueArray = Array.isArray(values) ? values : [];
                      return valueArray.length > 0 && (
                        <div key={key} className="space-y-1">
                          <span className="text-sm font-medium capitalize">{key}:</span>
                          <div className="flex flex-wrap gap-1">
                            {valueArray.map((value: string, index: number) => (
                              <Badge key={index} variant="secondary">
                                {value}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}