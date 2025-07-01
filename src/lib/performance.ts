/**
 * Performance optimization utilities for LexAI
 */

// Resource preloading for critical assets
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return;
  
  // Preload critical CSS classes used across the app
  const criticalClasses = [
    'bg-primary',
    'text-primary-foreground', 
    'border-primary',
    'hover:bg-primary/90',
    'bg-muted',
    'text-muted-foreground'
  ];

  // Add critical font display optimization
  const fontStyle = document.createElement('style');
  fontStyle.textContent = `
    @font-face {
      font-family: 'Inter';
      font-display: swap;
    }
  `;
  document.head.appendChild(fontStyle);
}

// Lazy load heavy libraries only when needed
export const loadTesseract = () => import('tesseract.js');
export const loadOrchestrator = () => import('@/ai/orchestrator/orchestrator-lazy');

// Debounce utility for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility for scroll events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Web Worker for heavy computations
export function createWorker(workerFunction: () => void): Worker {
  const blob = new Blob([`(${workerFunction.toString()})()`], {
    type: 'application/javascript'
  });
  return new Worker(URL.createObjectURL(blob));
}

// Memory cleanup utility
export function cleanupMemory() {
  if (typeof window !== 'undefined' && 'gc' in window) {
    // Force garbage collection in development
    (window as any).gc();
  }
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver {
  return new IntersectionObserver(callback, {
    threshold: 0.1,
    rootMargin: '50px',
    ...options
  });
}

// Performance measurement
export class PerformanceTimer {
  private startTime: number = 0;
  private marks: Map<string, number> = new Map();

  start(label?: string): void {
    this.startTime = performance.now();
    if (label) {
      this.marks.set(label, this.startTime);
    }
  }

  mark(label: string): void {
    this.marks.set(label, performance.now());
  }

  end(label?: string): number {
    const endTime = performance.now();
    const duration = endTime - this.startTime;
    
    if (label) {
      console.log(`[PERF] ${label}: ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }

  getMark(label: string): number | undefined {
    return this.marks.get(label);
  }

  getDuration(startLabel: string, endLabel: string): number | undefined {
    const start = this.marks.get(startLabel);
    const end = this.marks.get(endLabel);
    return start && end ? end - start : undefined;
  }
}

// Bundle analysis helper
export function analyzeBundleSize() {
  if (process.env.NODE_ENV === 'development') {
    console.log('[PERF] Bundle analysis available in development mode');
    // This would integrate with webpack-bundle-analyzer in development
  }
}