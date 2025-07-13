/**
 * Lazy Component Loader - Sistema de carregamento lazy otimizado
 * 
 * Sistema de lazy loading com preload inteligente, error boundaries
 * e feedback visual para componentes pesados.
 */

import React, { Suspense, ComponentType, lazy } from 'react';
import { Loader2, AlertCircle, RefreshCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyLoadingFallbackProps {
  name?: string;
  height?: string;
  showSkeleton?: boolean;
}

interface LazyLoadingErrorProps {
  error: Error;
  resetErrorBoundary: () => void;
  componentName?: string;
}

interface LazyComponentOptions {
  fallback?: ComponentType<LazyLoadingFallbackProps>;
  errorBoundary?: ComponentType<LazyLoadingErrorProps>;
  preload?: boolean;
  chunkName?: string;
}

/**
 * Fallback padrão para componentes lazy
 */
const DefaultLazyFallback: React.FC<LazyLoadingFallbackProps> = ({ 
  name = 'componente', 
  height = '200px',
  showSkeleton = true 
}) => {
  if (showSkeleton) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div 
      className="flex items-center justify-center w-full bg-muted/10 rounded-lg border-2 border-dashed border-muted-foreground/20"
      style={{ minHeight: height }}
      role="status"
      aria-label={`Carregando ${name}...`}
    >
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="size-8 animate-spin" />
        <p className="text-sm font-medium">Carregando {name}...</p>
      </div>
    </div>
  );
};

/**
 * Error boundary padrão para componentes lazy
 */
const DefaultLazyErrorBoundary: React.FC<LazyLoadingErrorProps> = ({ 
  error, 
  resetErrorBoundary, 
  componentName = 'componente' 
}) => {
  return (
    <Card className="w-full border-destructive/50">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-destructive">Erro ao carregar {componentName}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Ocorreu um erro inesperado. Tente recarregar o componente.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-2">
                <summary className="text-xs text-muted-foreground cursor-pointer">Detalhes técnicos</summary>
                <pre className="text-xs text-muted-foreground mt-1 p-2 bg-muted rounded overflow-auto">
                  {error.message}
                </pre>
              </details>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetErrorBoundary}
              className="mt-3"
            >
              <RefreshCcw className="size-3 mr-2" />
              Tentar novamente
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Error Boundary para lazy components
 */
class LazyErrorBoundary extends React.Component<
  { 
    children: React.ReactNode; 
    errorComponent: ComponentType<LazyLoadingErrorProps>;
    componentName?: string;
  },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy component error:', error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const ErrorComponent = this.props.errorComponent;
      return (
        <ErrorComponent 
          error={this.state.error} 
          resetErrorBoundary={this.resetErrorBoundary}
          componentName={this.props.componentName}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Hook optimizado para preload com intersection observer
 */
export const useLazyPreload = () => {
  const [observer, setObserver] = React.useState<IntersectionObserver | null>(null);
  const preloadedComponents = React.useRef(new Set<string>());

  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const componentName = entry.target.getAttribute('data-preload-component');
              if (componentName && !preloadedComponents.current.has(componentName)) {
                preloadedComponents.current.add(componentName);
                const preloadFn = (entry.target as any)._preloadFn;
                if (preloadFn) {
                  preloadFn().catch((err: any) => {
                    console.warn(`Preload failed for ${componentName}:`, err);
                  });
                }
              }
            }
          });
        },
        {
          rootMargin: '100px', // Start loading 100px before element is visible
          threshold: 0.1
        }
      );
      setObserver(obs);
    }

    return () => {
      observer?.disconnect();
    };
  }, []);

  const preloadComponent = React.useCallback((lazyComponent: () => Promise<any>) => {
    // Fallback for immediate preload (non-intersection based)
    lazyComponent().catch(err => {
      console.warn('Preload failed:', err);
    });
  }, []);

  const observeElement = React.useCallback((element: Element, componentName: string, preloadFn: () => Promise<any>) => {
    if (observer && element) {
      element.setAttribute('data-preload-component', componentName);
      (element as any)._preloadFn = preloadFn;
      observer.observe(element);
    }
  }, [observer]);

  return { preloadComponent, observeElement, isObserverSupported: !!observer };
};

/**
 * Factory para criar componentes lazy com configurações
 */
export const createLazyComponent = (
  importFn: () => Promise<{ default: ComponentType<any> }>,
  options: LazyComponentOptions = {}
) => {
  const {
    fallback = DefaultLazyFallback,
    errorBoundary = DefaultLazyErrorBoundary,
    preload = false,
    chunkName
  } = options;

  // Criar componente lazy
  const LazyComponent = lazy(importFn);

  // Intelligent preload strategy
  if (preload && typeof window !== 'undefined') {
    // Use requestIdleCallback for better performance, fallback to setTimeout
    const preloadFn = () => {
      importFn().catch(err => {
        console.warn(`Preload failed for ${chunkName || 'component'}:`, err);
      });
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(preloadFn, { timeout: 2000 });
    } else {
      setTimeout(preloadFn, 100);
    }
  }

  // Enhanced wrapper with intersection observer support
  const WrappedComponent: React.FC<any> = (props) => {
    const FallbackComponent = fallback;
    const { observeElement } = useLazyPreload();
    const elementRef = React.useRef<HTMLDivElement>(null);
    const [shouldRender, setShouldRender] = React.useState(preload || false);

    React.useEffect(() => {
      if (!preload && elementRef.current) {
        observeElement(elementRef.current, chunkName || 'component', importFn);
        
        // Set up intersection observer for rendering
        const renderObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setShouldRender(true);
                renderObserver.disconnect();
              }
            });
          },
          { rootMargin: '50px' }
        );
        
        renderObserver.observe(elementRef.current);
        
        return () => {
          renderObserver.disconnect();
        };
      }
    }, [observeElement]);

    if (!shouldRender && !preload) {
      return (
        <div 
          ref={elementRef} 
          style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <FallbackComponent {...props} />
        </div>
      );
    }

    return (
      <LazyErrorBoundary 
        errorComponent={errorBoundary} 
        componentName={chunkName || 'componente'}
      >
        <Suspense fallback={<FallbackComponent {...props} />}>
          <LazyComponent {...props} />
        </Suspense>
      </LazyErrorBoundary>
    );
  };

  WrappedComponent.displayName = `Lazy(${chunkName || 'Component'})`;

  // Adicionar método de preload ao componente
  (WrappedComponent as any).preload = () => importFn();

  return WrappedComponent;
};

/**
 * Componentes lazy específicos para a aplicação
 */

// OCR Processor (componente pesado com Tesseract)
export const LazyOCRProcessor = createLazyComponent(
  () => import('@/components/ocr/ocr-processor').then(mod => ({ default: mod.OCRProcessor })),
  {
    chunkName: 'OCRProcessor',
    preload: false, // Só carrega quando necessário
    fallback: (props) => (
      <DefaultLazyFallback 
        name="processador OCR"
        height="400px"
        showSkeleton={true}
        {...props}
      />
    )
  }
);

// Analytics Dashboard (gráficos e visualizações)
export const LazyAnalyticsDashboard = createLazyComponent(
  () => import('@/components/analytics/analytics-dashboard'),
  {
    chunkName: 'AnalyticsDashboard',
    preload: false,
    fallback: (props) => (
      <DefaultLazyFallback 
        name="dashboard de analytics"
        height="600px"
        showSkeleton={true}
        {...props}
      />
    )
  }
);

// Document Processor (IA e processamento)
export const LazyDocumentProcessor = createLazyComponent(
  () => import('@/components/ai/document-processor'),
  {
    chunkName: 'DocumentProcessor',
    preload: true, // Preload pois é comum
    fallback: (props) => (
      <DefaultLazyFallback 
        name="processador de documentos"
        height="500px"
        showSkeleton={true}
        {...props}
      />
    )
  }
);

// Workspace Settings (formulários complexos)
export const LazyWorkspaceSettings = createLazyComponent(
  () => import('@/components/workspace/workspace-settings'),
  {
    chunkName: 'WorkspaceSettings',
    preload: false,
    fallback: (props) => (
      <DefaultLazyFallback 
        name="configurações do workspace"
        height="400px"
        showSkeleton={true}
        {...props}
      />
    )
  }
);

// System Monitoring (admin)
export const LazySystemMonitoring = createLazyComponent(
  () => import('@/components/admin/system-monitoring'),
  {
    chunkName: 'SystemMonitoring',
    preload: false,
    fallback: (props) => (
      <DefaultLazyFallback 
        name="monitoramento do sistema"
        height="500px"
        showSkeleton={true}
        {...props}
      />
    )
  }
);

// Auth Debug Panel removido - arquivos de debug foram removidos

// Landing sections (podem ser lazy em SPA)
export const LazyFeaturesSection = createLazyComponent(
  () => import('@/components/landing/features-section').then(mod => ({ default: mod.FeaturesSection })),
  {
    chunkName: 'FeaturesSection',
    preload: true, // Landing é importante
    fallback: (props) => (
      <DefaultLazyFallback 
        name="seção de funcionalidades"
        height="800px"
        showSkeleton={true}
        {...props}
      />
    )
  }
);

export const LazyPricingSection = createLazyComponent(
  () => import('@/components/landing/pricing-section').then(mod => ({ default: mod.PricingSection })),
  {
    chunkName: 'PricingSection',
    preload: true,
    fallback: (props) => (
      <DefaultLazyFallback 
        name="seção de preços"
        height="600px"
        showSkeleton={true}
        {...props}
      />
    )
  }
);

/**
 * Utilitários otimizados para gerenciamento de lazy loading
 */
export const lazyUtils = {
  /**
   * Preload múltiplos componentes com throttling
   */
  preloadComponents: (components: Array<any>, { concurrent = 2, delay = 100 } = {}) => {
    const preloadQueue = [...components];
    let activePreloads = 0;

    const processNext = () => {
      if (preloadQueue.length === 0 || activePreloads >= concurrent) {
        return;
      }

      const component = preloadQueue.shift();
      if (component && typeof component.preload === 'function') {
        activePreloads++;
        component.preload()
          .catch((err: any) => {
            console.warn('Component preload failed:', err);
          })
          .finally(() => {
            activePreloads--;
            setTimeout(processNext, delay);
          });
      }
    };

    // Start initial preloads
    for (let i = 0; i < concurrent && i < components.length; i++) {
      processNext();
    }
  },

  /**
   * Preload condicional baseado na rota
   */
  preloadForRoute: (route: string) => {
    const routePreloads: Record<string, Array<any>> = {
      '/workspace': [LazyDocumentProcessor, LazyWorkspaceSettings],
      '/analytics': [LazyAnalyticsDashboard],
      '/admin': [LazySystemMonitoring],
      '/': [LazyFeaturesSection, LazyPricingSection]
    };

    const components = routePreloads[route];
    if (components) {
      lazyUtils.preloadComponents(components);
    }
  },

  /**
   * Preload otimizado baseado na interação do usuário
   */
  preloadOnHover: (component: any) => {
    let preloadStarted = false;
    return {
      onMouseEnter: () => {
        if (!preloadStarted && component && typeof component.preload === 'function') {
          preloadStarted = true;
          component.preload().catch(() => {});
        }
      },
      onFocus: () => {
        if (!preloadStarted && component && typeof component.preload === 'function') {
          preloadStarted = true;
          component.preload().catch(() => {});
        }
      }
    };
  },

  /**
   * Preload com base na velocidade de conexão
   */
  preloadByConnectionSpeed: (components: Array<any>) => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      const isSlowConnection = connection && 
        (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
      
      if (!isSlowConnection) {
        lazyUtils.preloadComponents(components);
      }
    } else {
      // No connection info available, preload anyway
      lazyUtils.preloadComponents(components);
    }
  }
};

export default createLazyComponent;
