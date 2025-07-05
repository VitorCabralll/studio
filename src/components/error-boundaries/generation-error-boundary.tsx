'use client';

import React from 'react';
import { Bot, RefreshCw, Settings, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ErrorBoundary } from '@/components/error-boundary';

interface GenerationErrorFallbackProps {
  error?: Error;
  onRetry?: () => void;
  onBack?: () => void;
}

function GenerationErrorFallback({ error, onRetry, onBack }: GenerationErrorFallbackProps) {
  const getErrorDetails = (error?: Error) => {
    if (!error) return { 
      title: 'Erro na Geração', 
      message: 'Erro desconhecido durante a geração do documento',
      severity: 'warning' as const,
      isRetryable: true
    };
    
    const message = error.message.toLowerCase();
    
    if (message.includes('api') || message.includes('quota') || message.includes('limit')) {
      return {
        title: 'Limite de API Atingido',
        message: 'Limite diário de gerações atingido. Tente novamente amanhã ou entre em contato com o suporte.',
        severity: 'destructive' as const,
        isRetryable: false
      };
    }
    
    if (message.includes('network') || message.includes('timeout') || message.includes('fetch')) {
      return {
        title: 'Erro de Conexão',
        message: 'Falha na conexão com os serviços de IA. Verifique sua internet e tente novamente.',
        severity: 'warning' as const,
        isRetryable: true
      };
    }
    
    if (message.includes('unauthorized') || message.includes('403') || message.includes('401')) {
      return {
        title: 'Erro de Autenticação',
        message: 'Sessão expirada. Faça login novamente para continuar.',
        severity: 'destructive' as const,
        isRetryable: false
      };
    }
    
    if (message.includes('invalid') || message.includes('validation')) {
      return {
        title: 'Dados Inválidos',
        message: 'Os dados fornecidos são inválidos. Verifique as informações e tente novamente.',
        severity: 'warning' as const,
        isRetryable: true
      };
    }
    
    if (message.includes('orchestrator') || message.includes('pipeline')) {
      return {
        title: 'Erro no Pipeline de IA',
        message: 'Falha no processamento do documento. Nossa equipe foi notificada.',
        severity: 'destructive' as const,
        isRetryable: true
      };
    }
    
    return {
      title: 'Erro na Geração',
      message: 'Erro inesperado durante a geração. Tente novamente ou entre em contato com o suporte.',
      severity: 'warning' as const,
      isRetryable: true
    };
  };

  const errorDetails = getErrorDetails(error);

  return (
    <Card className={`w-full ${
      errorDetails.severity === 'destructive' 
        ? 'border-red-200 dark:border-red-800' 
        : 'border-orange-200 dark:border-orange-800'
    }`}>
      <CardHeader className="text-center pb-4">
        <div className={`mx-auto mb-3 p-3 rounded-full w-fit ${
          errorDetails.severity === 'destructive'
            ? 'bg-red-100 dark:bg-red-900/20'
            : 'bg-orange-100 dark:bg-orange-900/20'
        }`}>
          <Bot className={`h-6 w-6 ${
            errorDetails.severity === 'destructive'
              ? 'text-red-600 dark:text-red-400'
              : 'text-orange-600 dark:text-orange-400'
          }`} />
        </div>
        <CardTitle className={
          errorDetails.severity === 'destructive'
            ? 'text-red-600 dark:text-red-400 text-lg'
            : 'text-orange-600 dark:text-orange-400 text-lg'
        }>
          {errorDetails.title}
        </CardTitle>
        <CardDescription>
          Falha durante a geração do documento
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert variant={errorDetails.severity}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {errorDetails.message}
          </AlertDescription>
        </Alert>

        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <p className="font-medium">O que você pode fazer:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            {errorDetails.isRetryable && (
              <li>Tente gerar o documento novamente</li>
            )}
            <li>Verifique se todas as informações estão corretas</li>
            <li>Simplifique as instruções se muito complexas</li>
            <li>Entre em contato com o suporte se o problema persistir</li>
          </ul>
        </div>

        <div className="flex gap-2 pt-2">
          {errorDetails.isRetryable && onRetry && (
            <Button 
              onClick={onRetry}
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          )}
          
          {onBack && (
            <Button 
              onClick={onBack}
              variant="outline"
              className="flex-1"
            >
              <Settings className="h-4 w-4 mr-2" />
              Ajustar Configurações
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface GenerationErrorBoundaryProps {
  children: React.ReactNode;
  onRetry?: () => void;
  onBack?: () => void;
  showDetails?: boolean;
}

export function GenerationErrorBoundary({ 
  children, 
  onRetry, 
  onBack, 
  showDetails = false 
}: GenerationErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={<GenerationErrorFallback onRetry={onRetry} onBack={onBack} />}
      showDetails={showDetails}
      onError={(error, errorInfo) => {
        console.error('[Generation Error]', error);
        console.error('[Generation ErrorInfo]', errorInfo);
        
        // TODO: Enviar métricas específicas para geração
        // analytics.track('document_generation_error', {
        //   error: error.message,
        //   component: errorInfo.componentStack,
        //   user_id: getCurrentUserId(),
        //   timestamp: new Date().toISOString()
        // });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}