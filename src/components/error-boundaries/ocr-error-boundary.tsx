'use client';

import React from 'react';
import { FileX, Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ErrorBoundary } from '@/components/error-boundary';

interface OCRErrorFallbackProps {
  error?: Error;
  onRetry?: () => void;
  onFileRemove?: () => void;
}

function OCRErrorFallback({ error, onRetry, onFileRemove }: OCRErrorFallbackProps) {
  const getErrorMessage = (error?: Error) => {
    if (!error) return 'Erro desconhecido no processamento OCR';
    
    const message = error.message.toLowerCase();
    
    if (message.includes('file too large') || message.includes('muito grande')) {
      return 'Arquivo muito grande. Tente um arquivo menor que 5MB.';
    }
    
    if (message.includes('unsupported') || message.includes('não suportado')) {
      return 'Formato de arquivo não suportado. Use PDF, JPG, PNG ou WEBP.';
    }
    
    if (message.includes('network') || message.includes('timeout')) {
      return 'Erro de rede. Verifique sua conexão e tente novamente.';
    }
    
    if (message.includes('worker') || message.includes('tesseract')) {
      return 'Erro no processamento OCR. Tente novamente ou use um arquivo diferente.';
    }
    
    return 'Falha no processamento do arquivo. Tente novamente.';
  };

  const getErrorSeverity = (error?: Error) => {
    if (!error) return 'warning';
    
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('worker')) {
      return 'destructive';
    }
    
    return 'warning';
  };

  return (
    <Card className="w-full border-orange-200 dark:border-orange-800">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-3 p-3 rounded-full bg-orange-100 dark:bg-orange-900/20 w-fit">
          <FileX className="h-6 w-6 text-orange-600 dark:text-orange-400" />
        </div>
        <CardTitle className="text-orange-600 dark:text-orange-400 text-lg">
          Erro no Processamento OCR
        </CardTitle>
        <CardDescription>
          Não foi possível processar o arquivo enviado
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert variant={getErrorSeverity(error) as 'warning' | 'destructive'}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {getErrorMessage(error)}
          </AlertDescription>
        </Alert>

        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <p className="font-medium">Possíveis soluções:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Verifique se o arquivo está em formato suportado (PDF, JPG, PNG, WEBP)</li>
            <li>Certifique-se de que o arquivo tem menos que 5MB</li>
            <li>Tente um arquivo com melhor qualidade de imagem</li>
            <li>Verifique sua conexão com a internet</li>
          </ul>
        </div>

        <div className="flex gap-2 pt-2">
          {onRetry && (
            <Button 
              onClick={onRetry}
              variant="outline"
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          )}
          {onFileRemove && (
            <Button 
              onClick={onFileRemove}
              variant="secondary"
              className="flex-1"
            >
              <FileX className="h-4 w-4 mr-2" />
              Remover Arquivo
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface OCRErrorBoundaryProps {
  children: React.ReactNode;
  onRetry?: () => void;
  onFileRemove?: () => void;
  showDetails?: boolean;
}

export function OCRErrorBoundary({ 
  children, 
  onRetry, 
  onFileRemove, 
  showDetails = false 
}: OCRErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={<OCRErrorFallback onRetry={onRetry} onFileRemove={onFileRemove} />}
      showDetails={showDetails}
      onError={(error, errorInfo) => {
        console.error('[OCR Error]', error);
        console.error('[OCR ErrorInfo]', errorInfo);
        
        // TODO: Enviar métricas específicas para OCR
        // analytics.track('ocr_error', {
        //   error: error.message,
        //   component: errorInfo.componentStack
        // });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}