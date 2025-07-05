"use client"

import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, File, X, ScanText, FileImage, CheckCircle, Shield } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useDocumentProcessor } from '@/hooks/use-document-processor';
import { cn } from '@/lib/utils';


// Lazy load do OCR processor
const OCRProcessor = dynamic(
  () => import('@/components/ocr/ocr-processor').then(mod => ({ default: mod.OCRProcessor })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-sm text-muted-foreground">Carregando OCR...</div>
      </div>
    ),
  }
);

interface FileExtractedText {
  text: string;
  metadata?: Record<string, unknown>;
}

interface FileUploadEnhancedProps {
  onFilesChange: (files: File[]) => void;
  onTextExtracted?: (text: string, structured?: Record<string, unknown>) => void;
  onTextsProcessed?: (extractedTexts: FileExtractedText[]) => void;
  documentId?: string;
  enableOCR?: boolean;
  className?: string;
}

export function FileUploadEnhanced({ 
  onFilesChange, 
  onTextExtracted,
  onTextsProcessed,
  documentId,
  enableOCR = true,
  className 
}: FileUploadEnhancedProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [extractedTexts, setExtractedTexts] = useState<string[]>([]);
  
  // Hook do Document Processor
  const { 
    processFiles, 
    processing, 
    progress, 
    status,
    error: processingError,
    clearError 
  } = useDocumentProcessor();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles];
    setFiles(newFiles);
    onFilesChange(newFiles);
    
    // Processar documentos automaticamente se habilitado e documentId fornecido
    if (enableOCR && documentId && acceptedFiles.length > 0) {
      clearError();
      const processedTexts = await processFiles(acceptedFiles, documentId);
      if (processedTexts) {
        const fileTexts: FileExtractedText[] = processedTexts.map(item => ({
          text: item.content,
          metadata: { source: item.source, type: item.type }
        }));
        onTextsProcessed?.(fileTexts);
      }
    }
  }, [files, onFilesChange, enableOCR, documentId, processFiles, onTextsProcessed, clearError]);

  const removeFile = useCallback((fileToRemove: File) => {
    const newFiles = files.filter(file => file !== fileToRemove);
    setFiles(newFiles);
    onFilesChange(newFiles);
  }, [files, onFilesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'application/pdf': [],
      'text/*': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': []
    },
    multiple: true
  });

  const handleOCRTextExtracted = useCallback((text: string, structured?: Record<string, unknown>) => {
    setExtractedTexts(prev => [...prev, text]);
    onTextExtracted?.(text, structured);
  }, [onTextExtracted]);

  const isImageFile = (file: File) => file.type.startsWith('image/') || file.type === 'application/pdf';
  const hasImageFiles = files.some(isImageFile);

  const renderUploadArea = () => (
    <motion.div
      className="group"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-500 hover:scale-[1.02]",
          isDragActive 
            ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-apple-lg" 
            : "border-border/50 hover:border-primary/50 hover:bg-primary/5 surface-elevated shadow-apple-md hover:shadow-apple-lg"
        )}
      >
        <input {...getInputProps()} />
        <motion.div
          animate={{ 
            scale: isDragActive ? 1.1 : 1,
            rotate: isDragActive ? [0, -5, 5, 0] : 0
          }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="shadow-apple-sm mx-auto flex size-20 items-center justify-center rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5">
            <UploadCloud className="size-10 text-primary" />
          </div>
          {isDragActive ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <h3 className="text-headline text-primary">Solte os arquivos aqui...</h3>
              <p className="text-body-large text-primary/80">Processando upload...</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-headline transition-colors group-hover:text-primary">
                Envie seus documentos
              </h3>
              <p className="text-body-large mx-auto max-w-md leading-relaxed text-muted-foreground">
                Clique para selecionar arquivos ou arraste e solte aqui. 
              </p>
              {enableOCR && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mx-auto max-w-sm rounded-lg border border-green-200/50 bg-gradient-to-r from-green-50 to-emerald-50 p-3 dark:border-green-800/50 dark:from-green-950/30 dark:to-emerald-950/30"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="size-4 text-green-600 dark:text-green-400" />
                    <span className="font-semibold text-green-800 dark:text-green-200">
                      100% Seguro
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-green-600 dark:text-green-300">
                    OCR processado localmente • Seus arquivos nunca saem do seu dispositivo
                  </p>
                </motion.div>
              )}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Badge variant="secondary" className="bg-muted/50 text-xs text-muted-foreground">
                  PDF
                </Badge>
                <Badge variant="secondary" className="bg-muted/50 text-xs text-muted-foreground">
                  Imagens
                </Badge>
                <Badge variant="secondary" className="bg-muted/50 text-xs text-muted-foreground">
                  Documentos
                </Badge>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );

  const renderProcessingProgress = () => (
    <AnimatePresence>
      {(processing || progress > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <ScanText className="size-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {processing ? 'Processando documentos com segurança...' : 'Processamento concluído!'}
              </p>
              {status && (
                <p className="text-xs text-muted-foreground">{status}</p>
              )}
              {processing && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  🔒 Processamento local • Dados não são transmitidos
                </p>
              )}
              <Progress value={progress} className="mt-1 h-1" />
            </div>
            {progress === 100 && (
              <CheckCircle className="size-5 text-green-600" />
            )}
          </div>
          {processingError && (
            <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950/30">
              <p className="text-sm text-red-600 dark:text-red-400">{processingError}</p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderFileList = () => (
    <AnimatePresence>
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="shadow-apple-sm flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-950/50 dark:to-emerald-950/50">
                <CheckCircle className="size-4 text-green-600" />
              </div>
              <h4 className="text-headline">Arquivos anexados</h4>
            </div>
            {hasImageFiles && (
              <Badge variant="secondary" className="flex items-center gap-2 border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800/50 dark:bg-blue-950/50 dark:text-blue-300">
                <ScanText className="size-3" />
                {files.filter(isImageFile).length} arquivo(s) com extração de texto
              </Badge>
            )}
          </div>
          
          <div className="grid gap-3">
            <AnimatePresence mode="popLayout">
              {files.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="surface-elevated shadow-apple-sm hover:shadow-apple-md group flex items-center justify-between rounded-xl border border-border/50 p-4 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className={`shadow-apple-sm flex size-12 items-center justify-center rounded-xl border ${
                      isImageFile(file) 
                        ? 'border-blue-200/50 bg-gradient-to-br from-blue-50 to-indigo-100 dark:border-blue-800/50 dark:from-blue-950/50 dark:to-indigo-950/50' 
                        : 'border-gray-200/50 bg-gradient-to-br from-gray-50 to-slate-100 dark:border-gray-800/50 dark:from-gray-950/50 dark:to-slate-950/50'
                    }`}>
                      {isImageFile(file) ? (
                        <FileImage className="size-6 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <File className="size-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="truncate text-base font-medium transition-colors group-hover:text-primary">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="border-border/50 bg-muted/30 text-xs">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </Badge>
                        <span className="text-caption">
                          {file.type || 'Tipo desconhecido'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeFile(file)}
                    className="size-10 shrink-0 transition-all duration-300 hover:scale-110 hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Remover arquivo ${file.name}`}
                  >
                    <X className="size-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <AnimatePresence>
            {extractedTexts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="shadow-apple-sm rounded-2xl border border-green-200/50 bg-gradient-to-r from-green-50 to-emerald-50 p-6 dark:border-green-800/50 dark:from-green-950/30 dark:to-emerald-950/30"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="shadow-apple-sm flex size-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                    <CheckCircle className="size-4 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-green-800 dark:text-green-200">
                      Texto extraído com sucesso!
                    </h5>
                    <p className="text-caption text-green-600 dark:text-green-300">
                      {extractedTexts.length} documento(s) processado(s) via OCR
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={cn("space-y-6", className)}>
      {renderUploadArea()}
      {enableOCR && renderProcessingProgress()}
      {renderFileList()}
      
      {/* OCR automático para arquivos de imagem/PDF */}
      {enableOCR && hasImageFiles && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="shadow-apple-sm rounded-2xl border border-blue-200/50 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:border-blue-800/50 dark:from-blue-950/30 dark:to-indigo-950/30"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="shadow-apple-sm flex size-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <ScanText className="size-4 text-blue-600" />
            </div>
            <div>
              <h5 className="font-semibold text-blue-800 dark:text-blue-200">
                Extração de Texto Automática
              </h5>
              <p className="text-caption text-blue-600 dark:text-blue-300">
                Detectamos {files.filter(isImageFile).length} arquivo(s) de imagem/PDF. O texto será extraído automaticamente.
              </p>
            </div>
          </div>
          
          <OCRProcessor
            onTextExtracted={handleOCRTextExtracted}
            maxFiles={5}
            language="por+eng"
            enableStructuredExtraction={true}
          />
        </motion.div>
      )}
    </div>
  );
}