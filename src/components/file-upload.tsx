"use client"

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, X, ScanText, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  onTextExtracted?: (text: string, structured?: any) => void;
  enableOCR?: boolean;
  className?: string;
}

export function FileUpload({ 
  onFilesChange, 
  onTextExtracted,
  enableOCR = true,
  className 
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [extractedTexts, setExtractedTexts] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles];
    setFiles(newFiles);
    onFilesChange(newFiles);
  }, [files, onFilesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true });

  const removeFile = (fileToRemove: File) => {
    const newFiles = files.filter(file => file !== fileToRemove);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="font-semibold">Arraste e solte arquivos aqui</p>
          <p className="text-sm text-muted-foreground">ou clique para selecionar arquivos</p>
        </div>
      </div>
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold">Arquivos selecionados:</h4>
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
  );
}