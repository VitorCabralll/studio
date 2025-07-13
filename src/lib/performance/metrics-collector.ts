/**
 * Advanced Performance Metrics Collector
 * Sistema avançado de coleta e análise de métricas de performance
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'percent' | 'ratio';
  timestamp: number;
  category: 'auth' | 'ui' | 'network' | 'memory' | 'bundle';
  metadata?: Record<string, unknown>;
}

export interface MetricsSummary {
  totalMetrics: number;
  categories: Record<string, number>;
  averages: Record<string, number>;
  trends: Record<string, 'improving' | 'degrading' | 'stable'>;
  alerts: Array<{
    metric: string;
    severity: 'low' | 'medium' | 'high';
    message: string;
    value: number;
    threshold: number;
  }>;
}

export interface PerformanceThresholds {
  authLoginTime: number;
  tokenValidationTime: number;
  profileLoadTime: number;
  bundleSize: number;
  memoryUsage: number;
  errorRate: number;
}

/**
 * Core metrics collector class
 */
export class MetricsCollector {
  private metrics: PerformanceMetric[] = [];
  private readonly maxMetrics: number = 1000;
  private readonly cleanupInterval: number = 5 * 60 * 1000; // 5 minutes
  private cleanupTimer: NodeJS.Timeout | null = null;
  
  private readonly thresholds: PerformanceThresholds = {
    authLoginTime: 3000, // 3 seconds
    tokenValidationTime: 2000, // 2 seconds
    profileLoadTime: 1500, // 1.5 seconds
    bundleSize: 500 * 1024, // 500KB
    memoryUsage: 50 * 1024 * 1024, // 50MB
    errorRate: 5 // 5%
  };

  constructor() {
    this.startCleanup();
  }

  /**
   * Cleanup method for the singleton instance
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.metrics = [];
  }

  /**
   * Record a performance metric
   */
  record(metric: Omit<PerformanceMetric, 'timestamp'>): void {
    const fullMetric: PerformanceMetric = {
      ...metric,
      timestamp: Date.now()
    };

    this.metrics.push(fullMetric);
    
    // Check if we need to cleanup
    if (this.metrics.length > this.maxMetrics) {
      this.cleanup();
    }

    // Metric recording is silent in production for performance
  }

  /**
   * Record timing metric
   */
  recordTiming(name: string, startTime: number, category: PerformanceMetric['category'], metadata?: Record<string, unknown>): void {
    const duration = performance.now() - startTime;
    this.record({
      name,
      value: duration,
      unit: 'ms',
      category,
      metadata
    });
  }

  /**
   * Record memory usage
   */
  recordMemoryUsage(): void {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      
      this.record({
        name: 'memory.used',
        value: memory.usedJSHeapSize,
        unit: 'bytes',
        category: 'memory',
        metadata: {
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        }
      });
    }
  }

  /**
   * Record bundle size metrics
   */
  recordBundleMetrics(): void {
    if (typeof window !== 'undefined') {
      const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      
      if (entries.length > 0) {
        const timing = entries[0];
        
        this.record({
          name: 'bundle.loadTime',
          value: timing.loadEventEnd - timing.fetchStart,
          unit: 'ms',
          category: 'bundle'
        });

        this.record({
          name: 'bundle.transferSize',
          value: timing.transferSize,
          unit: 'bytes',
          category: 'bundle'
        });
      }
    }
  }

  /**
   * Record error rate
   */
  recordError(errorType: string, context: string): void {
    this.record({
      name: 'error.count',
      value: 1,
      unit: 'count',
      category: 'auth',
      metadata: {
        type: errorType,
        context
      }
    });
  }

  /**
   * Get metrics by category
   */
  getMetrics(category?: PerformanceMetric['category'], since?: number): PerformanceMetric[] {
    let filtered = this.metrics;

    if (category) {
      filtered = filtered.filter(m => m.category === category);
    }

    if (since) {
      filtered = filtered.filter(m => m.timestamp >= since);
    }

    return [...filtered].sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Get summary statistics
   */
  getSummary(timeWindow: number = 10 * 60 * 1000): MetricsSummary {
    const since = Date.now() - timeWindow;
    const recentMetrics = this.getMetrics(undefined, since);

    // Calculate categories
    const categories: Record<string, number> = {};
    recentMetrics.forEach(metric => {
      categories[metric.category] = (categories[metric.category] || 0) + 1;
    });

    // Calculate averages by metric name
    const metricGroups: Record<string, number[]> = {};
    recentMetrics.forEach(metric => {
      if (!metricGroups[metric.name]) {
        metricGroups[metric.name] = [];
      }
      metricGroups[metric.name].push(metric.value);
    });

    const averages: Record<string, number> = {};
    Object.entries(metricGroups).forEach(([name, values]) => {
      averages[name] = values.reduce((sum, val) => sum + val, 0) / values.length;
    });

    // Calculate trends (comparing current average with previous period)
    const trends: Record<string, 'improving' | 'degrading' | 'stable'> = {};
    const previousWindow = this.getMetrics(undefined, since - timeWindow);
    
    Object.keys(averages).forEach(metricName => {
      const previousValues = previousWindow
        .filter(m => m.name === metricName)
        .map(m => m.value);
      
      if (previousValues.length > 0) {
        const previousAvg = previousValues.reduce((sum, val) => sum + val, 0) / previousValues.length;
        const currentAvg = averages[metricName];
        const change = (currentAvg - previousAvg) / previousAvg;
        
        if (Math.abs(change) < 0.05) { // 5% threshold
          trends[metricName] = 'stable';
        } else if (change < 0) {
          trends[metricName] = 'improving'; // Lower is better for performance metrics
        } else {
          trends[metricName] = 'degrading';
        }
      } else {
        trends[metricName] = 'stable';
      }
    });

    // Generate alerts
    const alerts = this.generateAlerts(averages);

    return {
      totalMetrics: recentMetrics.length,
      categories,
      averages,
      trends,
      alerts
    };
  }

  /**
   * Generate performance alerts
   */
  private generateAlerts(averages: Record<string, number>) {
    const alerts: MetricsSummary['alerts'] = [];

    // Check auth performance
    if (averages['auth.login'] > this.thresholds.authLoginTime) {
      alerts.push({
        metric: 'auth.login',
        severity: 'high',
        message: 'Login time exceeds threshold',
        value: averages['auth.login'],
        threshold: this.thresholds.authLoginTime
      });
    }

    if (averages['auth.tokenValidation'] > this.thresholds.tokenValidationTime) {
      alerts.push({
        metric: 'auth.tokenValidation',
        severity: 'medium',
        message: 'Token validation time is high',
        value: averages['auth.tokenValidation'],
        threshold: this.thresholds.tokenValidationTime
      });
    }

    // Check bundle size
    if (averages['bundle.transferSize'] > this.thresholds.bundleSize) {
      alerts.push({
        metric: 'bundle.transferSize',
        severity: 'medium',
        message: 'Bundle size is large',
        value: averages['bundle.transferSize'],
        threshold: this.thresholds.bundleSize
      });
    }

    // Check memory usage
    if (averages['memory.used'] > this.thresholds.memoryUsage) {
      alerts.push({
        metric: 'memory.used',
        severity: 'low',
        message: 'Memory usage is high',
        value: averages['memory.used'],
        threshold: this.thresholds.memoryUsage
      });
    }

    // Check error rate
    const totalRequests = averages['auth.request'] || 1;
    const errorCount = averages['error.count'] || 0;
    const errorRate = (errorCount / totalRequests) * 100;
    
    if (errorRate > this.thresholds.errorRate) {
      alerts.push({
        metric: 'error.rate',
        severity: 'high',
        message: 'Error rate is high',
        value: errorRate,
        threshold: this.thresholds.errorRate
      });
    }

    return alerts;
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const header = 'timestamp,name,value,unit,category,metadata\n';
      const rows = this.metrics.map(metric => 
        `${metric.timestamp},${metric.name},${metric.value},${metric.unit},${metric.category},"${JSON.stringify(metric.metadata || {})}"`
      ).join('\n');
      return header + rows;
    }

    return JSON.stringify(this.metrics, null, 2);
  }

  /**
   * Clear old metrics
   */
  private cleanup(): void {
    const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
    const initialCount = this.metrics.length;
    
    this.metrics = this.metrics.filter(metric => metric.timestamp >= cutoff);
    
    const removedCount = initialCount - this.metrics.length;
    // Cleanup is silent in production
  }

  /**
   * Start automatic cleanup
   */
  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }

  // destroy() method moved to earlier in the file to avoid duplication

  /**
   * Get performance insights
   */
  getInsights(): {
    recommendations: string[];
    criticalIssues: string[];
    optimizations: string[];
  } {
    const summary = this.getSummary();
    const recommendations: string[] = [];
    const criticalIssues: string[] = [];
    const optimizations: string[] = [];

    // Critical issues
    summary.alerts.forEach(alert => {
      if (alert.severity === 'high') {
        criticalIssues.push(`${alert.metric}: ${alert.message} (${alert.value.toFixed(2)} > ${alert.threshold})`);
      }
    });

    // Recommendations based on trends
    Object.entries(summary.trends).forEach(([metric, trend]) => {
      if (trend === 'degrading') {
        recommendations.push(`Monitor ${metric} - performance is degrading`);
      }
    });

    // Optimizations
    if (summary.averages['bundle.transferSize'] > 300000) { // 300KB
      optimizations.push('Consider implementing more aggressive code splitting');
    }

    if (summary.averages['memory.used'] > 30000000) { // 30MB
      optimizations.push('Review memory usage and implement cleanup strategies');
    }

    if (summary.categories.auth / summary.totalMetrics > 0.7) {
      optimizations.push('High auth activity - consider caching strategies');
    }

    return {
      recommendations,
      criticalIssues,
      optimizations
    };
  }
}

/**
 * Auth-specific metrics tracker
 */
export class AuthMetricsTracker {
  private collector: MetricsCollector;

  constructor(collector: MetricsCollector) {
    this.collector = collector;
  }

  /**
   * Track login operation
   */
  trackLogin(startTime: number, success: boolean, method: string): void {
    this.collector.recordTiming('auth.login', startTime, 'auth', {
      success,
      method
    });

    if (success) {
      this.collector.record({
        name: 'auth.login.success',
        value: 1,
        unit: 'count',
        category: 'auth',
        metadata: { method }
      });
    } else {
      this.collector.recordError('login_failed', method);
    }
  }

  /**
   * Track token validation
   */
  trackTokenValidation(startTime: number, success: boolean): void {
    this.collector.recordTiming('auth.tokenValidation', startTime, 'auth', {
      success
    });
  }

  /**
   * Track profile operations
   */
  trackProfileOperation(operation: string, startTime: number, success: boolean): void {
    this.collector.recordTiming(`auth.profile.${operation}`, startTime, 'auth', {
      success,
      operation
    });
  }

  /**
   * Track auth state changes
   */
  trackStateChange(from: string, to: string): void {
    this.collector.record({
      name: 'auth.stateChange',
      value: 1,
      unit: 'count',
      category: 'auth',
      metadata: { from, to }
    });
  }

  /**
   * Get auth-specific summary
   */
  getAuthSummary(): {
    loginSuccess: number;
    loginFailure: number;
    avgLoginTime: number;
    avgTokenValidationTime: number;
    errorRate: number;
  } {
    const authMetrics = this.collector.getMetrics('auth');
    
    const loginMetrics = authMetrics.filter(m => m.name === 'auth.login');
    const successfulLogins = authMetrics.filter(m => m.name === 'auth.login.success').length;
    const errors = authMetrics.filter(m => m.name === 'error.count').length;
    
    const avgLoginTime = loginMetrics.reduce((sum, m) => sum + m.value, 0) / (loginMetrics.length || 1);
    
    const tokenValidationMetrics = authMetrics.filter(m => m.name === 'auth.tokenValidation');
    const avgTokenValidationTime = tokenValidationMetrics.reduce((sum, m) => sum + m.value, 0) / (tokenValidationMetrics.length || 1);
    
    const errorRate = authMetrics.length > 0 ? (errors / authMetrics.length) * 100 : 0;

    return {
      loginSuccess: successfulLogins,
      loginFailure: loginMetrics.length - successfulLogins,
      avgLoginTime,
      avgTokenValidationTime,
      errorRate
    };
  }
}

// Export singleton instances
export const metricsCollector = new MetricsCollector();
export const authMetricsTracker = new AuthMetricsTracker(metricsCollector);