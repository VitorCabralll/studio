"use client"

import { UploadCloud, File, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';


// OCR processor temporarily removed

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  onTextExtracted?: (text: string, structured?: any) => void;
  enableOCR?: boolean;
  className?: string;
}

export function FileUpload({ 
  onFilesChange, 
  className 
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);

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
          <UploadCloud className="mb-4 size-12 text-muted-foreground" />
          <p className="font-semibold">Arraste e solte arquivos aqui</p>
          <p className="text-sm text-muted-foreground">ou clique para selecionar arquivos</p>
        </div>
      </div>
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold">Arquivos selecionados:</h4>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between rounded-md bg-muted p-2">
                <div className="flex items-center gap-3">
                  <File className="size-5 text-muted-foreground" />
                  <span className="max-w-xs truncate text-sm font-medium">{file.name}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeFile(file)} 
                  className="size-7"
                  aria-label={`Remover arquivo ${file.name}`}
                >
                  <X className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}