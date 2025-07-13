/**
 * Performance Monitor Hook
 * Hook React para monitoramento de performance em tempo real
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { metricsCollector, authMetricsTracker, MetricsSummary } from '@/lib/performance/metrics-collector';

/**
 * Hook principal para monitoramento de performance
 */
export function usePerformanceMonitor(enabled: boolean = true) {
  const [summary, setSummary] = useState<MetricsSummary | null>(null);
  const [isCollecting, setIsCollecting] = useState(enabled);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update summary every 30 seconds
  useEffect(() => {
    if (!isCollecting) return;

    const updateSummary = () => {
      setSummary(metricsCollector.getSummary());
    };

    // Initial update
    updateSummary();

    // Set up interval
    intervalRef.current = setInterval(updateSummary, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isCollecting]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const startCollecting = useCallback(() => {
    setIsCollecting(true);
  }, []);

  const stopCollecting = useCallback(() => {
    setIsCollecting(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const clearMetrics = useCallback(() => {
    metricsCollector.destroy();
    setSummary(null);
  }, []);

  const exportMetrics = useCallback((format: 'json' | 'csv' = 'json') => {
    return metricsCollector.exportMetrics(format);
  }, []);

  return {
    summary,
    isCollecting,
    startCollecting,
    stopCollecting,
    clearMetrics,
    exportMetrics,
    insights: summary ? metricsCollector.getInsights() : null
  };
}

/**
 * Hook para tracking de operações com timing automático
 */
export function usePerformanceTracker(category: string) {
  const startTimeRef = useRef<number | null>(null);

  const startTimer = useCallback((operationName?: string) => {
    startTimeRef.current = performance.now();
    
    if (process.env.NODE_ENV === 'development' && operationName) {
      console.log(`⏱️ Started tracking: ${operationName}`);
    }
  }, []);

  const endTimer = useCallback((
    metricName: string, 
    metadata?: Record<string, unknown>
  ) => {
    if (startTimeRef.current === null) {
      console.warn('endTimer called without startTimer');
      return;
    }

    const duration = performance.now() - startTimeRef.current;
    
    metricsCollector.record({
      name: metricName,
      value: duration,
      unit: 'ms',
      category: category as any,
      metadata
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Completed: ${metricName} (${duration.toFixed(2)}ms)`, metadata);
    }

    startTimeRef.current = null;
  }, [category]);

  const trackOperation = useCallback(async <T,>(
    operation: () => Promise<T>,
    metricName: string,
    metadata?: Record<string, unknown>
  ): Promise<T> => {
    startTimer(metricName);
    
    try {
      const result = await operation();
      endTimer(metricName, { ...metadata, success: true });
      return result;
    } catch (error) {
      endTimer(metricName, { ...metadata, success: false, error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }, [startTimer, endTimer]);

  return {
    startTimer,
    endTimer,
    trackOperation
  };
}

/**
 * Hook específico para auth operations
 */
export function useAuthPerformanceTracker() {
  const tracker = usePerformanceTracker('auth');

  const trackLogin = useCallback(async <T,>(
    loginFn: () => Promise<T>,
    method: string = 'email'
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await loginFn();
      authMetricsTracker.trackLogin(startTime, true, method);
      return result;
    } catch (error) {
      authMetricsTracker.trackLogin(startTime, false, method);
      throw error;
    }
  }, []);

  const trackTokenValidation = useCallback(async <T,>(
    validationFn: () => Promise<T>
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await validationFn();
      authMetricsTracker.trackTokenValidation(startTime, true);
      return result;
    } catch (error) {
      authMetricsTracker.trackTokenValidation(startTime, false);
      throw error;
    }
  }, []);

  const trackProfileOperation = useCallback(async <T,>(
    operation: () => Promise<T>,
    operationType: string
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await operation();
      authMetricsTracker.trackProfileOperation(operationType, startTime, true);
      return result;
    } catch (error) {
      authMetricsTracker.trackProfileOperation(operationType, startTime, false);
      throw error;
    }
  }, []);

  const trackStateChange = useCallback((from: string, to: string) => {
    authMetricsTracker.trackStateChange(from, to);
  }, []);

  const getAuthSummary = useCallback(() => {
    return authMetricsTracker.getAuthSummary();
  }, []);

  return {
    trackLogin,
    trackTokenValidation,
    trackProfileOperation,
    trackStateChange,
    getAuthSummary,
    ...tracker
  };
}

/**
 * Hook para memory monitoring
 */
export function useMemoryMonitor(interval: number = 30000) {
  const [memoryUsage, setMemoryUsage] = useState<{
    used: number;
    total: number;
    limit: number;
  } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('memory' in performance)) {
      return;
    }

    const updateMemoryUsage = () => {
      const memory = (performance as any).memory;
      setMemoryUsage({
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      });

      // Record metric
      metricsCollector.recordMemoryUsage();
    };

    // Initial measurement
    updateMemoryUsage();

    // Set up interval
    const intervalId = setInterval(updateMemoryUsage, interval);

    return () => clearInterval(intervalId);
  }, [interval]);

  return memoryUsage;
}

/**
 * Hook para bundle size monitoring
 */
export function useBundleMonitor() {
  const [bundleMetrics, setBundleMetrics] = useState<{
    loadTime: number;
    transferSize: number;
    encodedSize: number;
  } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateBundleMetrics = () => {
      const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      
      if (entries.length > 0) {
        const timing = entries[0];
        
        setBundleMetrics({
          loadTime: timing.loadEventEnd - timing.fetchStart,
          transferSize: timing.transferSize,
          encodedSize: timing.encodedBodySize
        });

        // Record metrics
        metricsCollector.recordBundleMetrics();
      }
    };

    // Update after page load
    if (document.readyState === 'complete') {
      updateBundleMetrics();
    } else {
      window.addEventListener('load', updateBundleMetrics);
      return () => window.removeEventListener('load', updateBundleMetrics);
    }
  }, []);

  return bundleMetrics;
}

/**
 * Hook para network performance monitoring
 */
export function useNetworkMonitor() {
  const [networkMetrics, setNetworkMetrics] = useState<{
    effectiveType: string;
    downlink: number;
    rtt: number;
  } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('connection' in navigator)) {
      return;
    }

    const connection = (navigator as any).connection;
    
    const updateNetworkMetrics = () => {
      setNetworkMetrics({
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      });

      // Record network quality metric
      metricsCollector.record({
        name: 'network.quality',
        value: connection.downlink,
        unit: 'ratio',
        category: 'network',
        metadata: {
          effectiveType: connection.effectiveType,
          rtt: connection.rtt
        }
      });
    };

    // Initial measurement
    updateNetworkMetrics();

    // Listen for changes
    connection.addEventListener('change', updateNetworkMetrics);

    return () => {
      connection.removeEventListener('change', updateNetworkMetrics);
    };
  }, []);

  return networkMetrics;
}

/**
 * Hook combinado para dashboard de performance
 */
export function usePerformanceDashboard() {
  const monitor = usePerformanceMonitor();
  const authTracker = useAuthPerformanceTracker();
  const memoryUsage = useMemoryMonitor();
  const bundleMetrics = useBundleMonitor();
  const networkMetrics = useNetworkMonitor();

  return {
    // Overall monitoring
    ...monitor,
    
    // Auth-specific tracking
    authTracker,
    authSummary: authTracker.getAuthSummary(),
    
    // System metrics
    memoryUsage,
    bundleMetrics,
    networkMetrics,
    
    // Helper methods
    recordCustomMetric: useCallback((
      name: string,
      value: number,
      unit: 'ms' | 'bytes' | 'count' | 'percent' | 'ratio',
      category: 'auth' | 'ui' | 'network' | 'memory' | 'bundle',
      metadata?: Record<string, unknown>
    ) => {
      metricsCollector.record({
        name,
        value,
        unit,
        category,
        metadata
      });
    }, [])
  };
}