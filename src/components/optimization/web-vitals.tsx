'use client';

import { useEffect } from 'react';
import { onCLS, onINP, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';

interface WindowWithGTag extends Window {
  gtag?: (command: string, action: string, options: Record<string, unknown>) => void;
}

function sendToAnalytics(metric: Metric) {
  // Enviar métricas para Firebase Performance Monitoring
  console.log('Web Vitals:', metric);
  
  // Opcional: Enviar para outros serviços de analytics
  if (typeof window !== 'undefined') {
    const windowWithGTag = window as WindowWithGTag;
    if (windowWithGTag.gtag) {
      windowWithGTag.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      });
    }
  }
}

export function WebVitals() {
  useEffect(() => {
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  }, []);

  return null;
}