'use client';

import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';
import { OnboardingGuard } from '@/components/layout/onboarding-guard';

// Lazy load do wizard pesado com loading fallback aprimorado
const GenerationWizard = dynamic(
  () => import('./components/wizard').then(mod => ({ default: mod.GenerationWizard })),
  {
    loading: () => (
      <div className="flex min-h-[600px] items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-6 p-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <Sparkles className="size-12 text-primary" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0"
            >
              <Loader2 className="size-12 text-primary/60" />
            </motion.div>
          </motion.div>
          
          <div className="space-y-2 text-center">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg font-semibold"
            >
              Preparando seu assistente jurídico
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-md text-sm text-muted-foreground"
            >
              Carregando ferramentas de IA especializadas para geração de documentos jurídicos...
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <div className="size-2 animate-pulse rounded-full bg-primary" />
            <span>Inteligência Artificial Especializada</span>
          </motion.div>
        </motion.div>
      </div>
    ),
  }
);

export default function GeneratePage() {
  return (
    <OnboardingGuard>
      <GenerationWizard />
    </OnboardingGuard>
  );
}
