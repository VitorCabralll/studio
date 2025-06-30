'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamic import of the heavy OCR processor
const OCRProcessor = dynamic(() => import('./ocr-processor').then(mod => ({ default: mod.OCRProcessor })), {
  ssr: false,
  loading: () => <OCRProcessorSkeleton />
});

function OCRProcessorSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Loader2 className="size-5 animate-spin" />
          Carregando OCR...
        </CardTitle>
        <CardDescription>
          Preparando o processador de texto local...
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

export { OCRProcessor as default };
export type { OCRResult } from '@/hooks/use-ocr';