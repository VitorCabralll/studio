"use client"

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, X, ScanText, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

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

interface FileUploadEnhancedProps {
  onFilesChange: (files: File[]) => void;
  onTextExtracted?: (text: string, structured?: any) => void;
  enableOCR?: boolean;
  className?: string;
}

export function FileUploadEnhanced({ 
  onFilesChange, 
  onTextExtracted,
  enableOCR = true,
  className 
}: FileUploadEnhancedProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [extractedTexts, setExtractedTexts] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles];
    setFiles(newFiles);
    onFilesChange(newFiles);
  }, [files, onFilesChange]);

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

  const handleOCRTextExtracted = useCallback((text: string, structured?: any) => {
    setExtractedTexts(prev => [...prev, text]);
    onTextExtracted?.(text, structured);
  }, [onTextExtracted]);

  const isImageFile = (file: File) => file.type.startsWith('image/') || file.type === 'application/pdf';
  const hasImageFiles = files.some(isImageFile);

  return (
    <div className={cn("space-y-4", className)}>
      {enableOCR ? (
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <UploadCloud className="h-4 w-4" />
              Upload de Arquivos
            </TabsTrigger>
            <TabsTrigger value="ocr" className="flex items-center gap-2">
              <ScanText className="h-4 w-4" />
              OCR - Extrair Texto
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                isDragActive 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50"
              )}
            >
              <input {...getInputProps()} />
              <UploadCloud className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              {isDragActive ? (
                <p className="text-lg font-medium">Solte os arquivos aqui...</p>
              ) : (
                <div>
                  <p className="text-lg font-medium mb-2">Clique para selecionar arquivos ou arraste e solte</p>
                  <p className="text-sm text-muted-foreground">Suporte para imagens, PDFs, documentos de texto</p>
                </div>
              )}
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Arquivos anexados:</h4>
                  {hasImageFiles && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <FileImage className="h-3 w-3" />
                      {files.filter(isImageFile).length} imagem(ns) - Use OCR para extrair texto
                    </Badge>
                  )}
                </div>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between p-2 rounded-md bg-muted">
                      <div className="flex items-center gap-3">
                        {isImageFile(file) ? (
                          <FileImage className="w-5 h-5 text-blue-500" />
                        ) : (
                          <File className="w-5 h-5 text-muted-foreground" />
                        )}
                        <span className="text-sm font-medium truncate max-w-xs">{file.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </Badge>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeFile(file)} 
                        className="h-7 w-7"
                        aria-label={`Remover arquivo ${file.name}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
                
                {extractedTexts.length > 0 && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-md">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      ✓ Texto extraído de {extractedTexts.length} documento(s) via OCR
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="ocr">
            <OCRProcessor
              onTextExtracted={handleOCRTextExtracted}
              maxFiles={5}
              language="por+eng"
              enableStructuredExtraction={true}
            />
          </TabsContent>
        </Tabs>
      ) : (
        // Versão simplificada sem OCR
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
              isDragActive 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50"
            )}
          >
            <input {...getInputProps()} />
            <UploadCloud className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg font-medium">Solte os arquivos aqui...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">Clique para selecionar arquivos ou arraste e solte</p>
                <p className="text-sm text-muted-foreground">Suporte para imagens, PDFs, documentos de texto</p>
              </div>
            )}
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Arquivos anexados:</h4>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center justify-between p-2 rounded-md bg-muted">
                    <div className="flex items-center gap-3">
                      <File className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm font-medium truncate max-w-xs">{file.name}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeFile(file)} 
                      className="h-7 w-7"
                      aria-label={`Remover arquivo ${file.name}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}