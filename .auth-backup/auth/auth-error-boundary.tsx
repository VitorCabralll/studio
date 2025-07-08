'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authLogger } from '@/lib/auth-logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  context?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class AuthErrorBoundary extends Component<Props, State> {
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

    // Log estruturado usando authLogger
    authLogger.error('Auth boundary caught error', error, {
      context: this.props.context || 'auth-boundary',
      operation: 'error_boundary_catch',
      errorDetails: {
        code: 'boundary_error',
        message: error.message,
        stack: error.stack,
      },
      metadata: {
        componentStack: errorInfo.componentStack,
        errorBoundary: 'AuthErrorBoundary',
      },
    });

    // Callback customizado se fornecido
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    authLogger.info('Auth error boundary retry attempted', {
      context: this.props.context || 'auth-boundary',
      operation: 'error_boundary_retry',
    });

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoToLogin = () => {
    authLogger.info('Auth error boundary redirect to login', {
      context: this.props.context || 'auth-boundary',
      operation: 'error_boundary_redirect',
      metadata: { destination: 'login' },
    });

    window.location.href = '/login';
  };

  handleGoToSignup = () => {
    authLogger.info('Auth error boundary redirect to signup', {
      context: this.props.context || 'auth-boundary',
      operation: 'error_boundary_redirect',
      metadata: { destination: 'signup' },
    });

    window.location.href = '/signup';
  };

  render() {
    if (this.state.hasError) {
      // Se há um fallback customizado, use-o
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI específica para erros de autenticação
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
          <Card className="w-full max-w-md border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-900/80">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 rounded-full bg-red-100 dark:bg-red-900/20 w-fit">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-red-600 dark:text-red-400">
                Erro de Autenticação
              </CardTitle>
              <CardDescription>
                Ocorreu um problema durante a autenticação. Tente novamente ou entre em contato com o suporte.
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
              
              <div className="space-y-2">
                <Button 
                  onClick={this.handleRetry}
                  className="w-full"
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={this.handleGoToLogin}
                    variant="outline"
                    size="sm"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                  <Button 
                    onClick={this.handleGoToSignup}
                    variant="outline"
                    size="sm"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Cadastro
                  </Button>
                </div>
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
export function withAuthErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: T) => (
    <AuthErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </AuthErrorBoundary>
  );

  WrappedComponent.displayName = `withAuthErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Componente de fallback específico para auth
export function AuthErrorFallback({ error, onRetry }: { error?: Error; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20 w-fit mb-4">
        <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
        Erro de Autenticação
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Não foi possível completar a operação de autenticação.
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Tentar Novamente
        </Button>
      )}
    </div>
  );
}

// Hook para reportar erros de auth programaticamente
export function useAuthErrorHandler() {
  const handleAuthError = React.useCallback((error: Error, context?: string) => {
    authLogger.error('Auth error reported programmatically', error, {
      context: context || 'auth-error-handler',
      operation: 'programmatic_error_report',
    });
    
    // Re-throw para que seja capturado por error boundary se necessário
    throw error;
  }, []);

  return handleAuthError;
}