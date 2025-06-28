import dynamic from 'next/dynamic';
import { Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

// Lazy load do wizard pesado com loading fallback aprimorado
const GenerationWizard = dynamic(
  () => import('./components/wizard').then(mod => ({ default: mod.GenerationWizard })),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-[600px] bg-gradient-to-br from-background via-background to-primary/5">
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
            <Sparkles className="h-12 w-12 text-primary" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0"
            >
              <Loader2 className="h-12 w-12 text-primary/60" />
            </motion.div>
          </motion.div>
          
          <div className="text-center space-y-2">
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
              className="text-sm text-muted-foreground max-w-md"
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
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span>Inteligência Artificial Especializada</span>
          </motion.div>
        </motion.div>
      </div>
    ),
  }
);

export default function GeneratePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex-1 p-4 md:p-8 bg-gradient-to-br from-background via-background to-primary/5 min-h-screen"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-200/20 dark:bg-grid-slate-700/20 pointer-events-none" />
      
      <div className="relative z-10">
        <GenerationWizard />
      </div>
    </motion.div>
  );
}
