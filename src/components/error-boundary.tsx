'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log estruturado
    import('@/lib/logger').then(({ logger }) => {
      logger.error('ErrorBoundary caught error', error, {
        component: 'error-boundary',
        metadata: {
          componentStack: errorInfo.componentStack,
          errorBoundary: true,
        },
      });
    });

    // Callback customizado se fornecido
    this.props.onError?.(error, errorInfo);

    // Enviar para serviço de monitoramento
    import('@/lib/monitoring').then(({ monitoring }) => {
      monitoring.reportError({
        message: 'React Error Boundary caught error',
        error,
        severity: 'high',
        context: {
          component: 'error-boundary',
          metadata: {
            componentStack: errorInfo.componentStack,
            errorBoundary: true,
          },
        },
      });
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Se há um fallback customizado, use-o
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI padrão de erro
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 rounded-full bg-red-100 dark:bg-red-900/20 w-fit">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-red-600 dark:text-red-400">
                Algo deu errado
              </CardTitle>
              <CardDescription>
                Ocorreu um erro inesperado. Nossa equipe foi notificada.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.props.showDetails && this.state.error && (
                <details className="text-sm text-gray-600 dark:text-gray-400">
                  <summary className="cursor-pointer font-medium mb-2">
                    Detalhes técnicos
                  </summary>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded border overflow-auto max-h-32">
                    <code className="text-xs">
                      {this.state.error.message}
                    </code>
                  </div>
                </details>
              )}
              
              <div className="flex gap-2">
                <Button 
                  onClick={this.handleRetry}
                  className="flex-1"
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </Button>
                <Button 
                  onClick={this.handleGoHome}
                  className="flex-1"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Página Inicial
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper funcional para uso mais fácil
export function withErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: T) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook para reportar erros programaticamente
export function useErrorHandler() {
  const handleError = React.useCallback((error: Error, context?: string) => {
    // Log estruturado
    import('@/lib/logger').then(({ logger }) => {
      logger.error(`User error: ${context || 'Unknown context'}`, error, {
        component: 'user-error-handler',
        metadata: { context },
      });
    });
    
    // Enviar para serviço de monitoramento
    import('@/lib/monitoring').then(({ monitoring }) => {
      monitoring.reportError({
        message: `User error: ${context || 'Unknown context'}`,
        error,
        severity: 'medium',
        context: {
          component: 'user-error-handler',
          metadata: { context },
        },
      });
    });
    
    // Re-throw para que seja capturado por error boundary se necessário
    throw error;
  }, []);

  return handleError;
}