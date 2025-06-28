'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Atualiza o estado para que a próxima renderização mostre a UI de fallback
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Captura detalhes do erro para logging
    this.setState({
      error,
      errorInfo
    });

    // Log do erro (em produção, enviar para serviço de monitoramento)
    console.error('ErrorBoundary capturou um erro:', error, errorInfo);
    
    // Em produção, você enviaria isso para um serviço como Sentry
    if (process.env.NODE_ENV === 'production') {
      // Exemplo: Sentry.captureException(error, { contexts: { react: errorInfo } });
    }
  }

  handleReload = () => {
    // Recarrega a página para tentar recuperar o estado
    window.location.reload();
  };

  handleReset = () => {
    // Reset do estado para tentar renderizar novamente
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-xl font-headline">
                Oops! Algo deu errado
              </CardTitle>
              <CardDescription>
                Ocorreu um erro inesperado na aplicação. Nossa equipe foi notificada e está trabalhando para resolver o problema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={this.handleReload}
                  className="w-full"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Recarregar Página
                </Button>
                <Button 
                  variant="outline"
                  onClick={this.handleReset}
                  className="w-full"
                >
                  Tentar Novamente
                </Button>
              </div>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 p-3 bg-muted rounded-md">
                  <summary className="cursor-pointer text-sm font-medium text-muted-foreground mb-2">
                    Detalhes do Erro (Desenvolvimento)
                  </summary>
                  <div className="text-xs font-mono space-y-2">
                    <div>
                      <strong>Erro:</strong> {this.state.error.message}
                    </div>
                    <div>
                      <strong>Stack:</strong>
                      <pre className="mt-1 whitespace-pre-wrap bg-background p-2 rounded border">
                        {this.state.error.stack}
                      </pre>
                    </div>
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="mt-1 whitespace-pre-wrap bg-background p-2 rounded border">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook para uso em componentes funcionais (opcional)
export function useErrorHandler() {
  return (error: Error, errorInfo?: string) => {
    console.error('Erro capturado:', error);
    throw error; // Re-throw para que o ErrorBoundary possa capturar
  };
}