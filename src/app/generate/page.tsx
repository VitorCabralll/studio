'use client';

import { motion } from 'framer-motion';
import { Loader2, Sparkles, Zap, Settings } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LegalDisclaimer } from '@/components/legal-disclaimer';

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
  const [selectedMode, setSelectedMode] = useState<'simple' | 'advanced' | null>(null);

  if (selectedMode === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <div className="w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12"
          >
            <div className="mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                className="shadow-apple-lg mx-auto mb-6 flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80"
              >
                <Sparkles className="size-10 text-white" />
              </motion.div>
              <h1 className="text-display mb-4">Como você prefere gerar documentos?</h1>
              <p className="text-body-large mx-auto max-w-2xl leading-relaxed text-muted-foreground">
                Escolha a interface que melhor atende seu nível de experiência e necessidades.
              </p>
            </div>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Modo Simples */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="cursor-pointer"
              onClick={() => setSelectedMode('simple')}
            >
              <Card className="surface-elevated shadow-apple-lg hover:shadow-apple-lg h-full border-2 border-border/50 transition-all duration-500 hover:border-primary/30">
                <CardHeader className="text-center pb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900"
                  >
                    <Zap className="size-8 text-green-600 dark:text-green-400" />
                  </motion.div>
                  <CardTitle className="text-headline text-2xl">Modo Simples</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Interface rápida e intuitiva para gerar documentos com apenas 3 cliques
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">Seleção automática do melhor agente</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">Configurações otimizadas pré-definidas</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">Ideal para casos do dia a dia</span>
                    </div>
                  </div>
                  
                  <Button className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 font-semibold">
                    <Zap className="mr-2 size-4" />
                    Usar Modo Simples
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Modo Avançado */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="cursor-pointer"
              onClick={() => setSelectedMode('advanced')}
            >
              <Card className="surface-elevated shadow-apple-lg hover:shadow-apple-lg h-full border-2 border-border/50 transition-all duration-500 hover:border-primary/30">
                <CardHeader className="text-center pb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: "spring" }}
                    className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900 dark:to-violet-900"
                  >
                    <Settings className="size-8 text-purple-600 dark:text-purple-400" />
                  </motion.div>
                  <CardTitle className="text-headline text-2xl">Modo Avançado</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Controle total sobre o processo de geração com opções personalizáveis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-purple-500"></div>
                      <span className="text-sm">Seleção manual de agentes especializados</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-purple-500"></div>
                      <span className="text-sm">Parâmetros de IA ajustáveis</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-purple-500"></div>
                      <span className="text-sm">Para casos complexos e específicos</span>
                    </div>
                  </div>
                  
                  <Button className="w-full h-12 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 font-semibold">
                    <Settings className="mr-2 size-4" />
                    Usar Modo Avançado
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-muted-foreground">
              💡 Você pode trocar o modo a qualquer momento nas configurações
            </p>
          </motion.div>
        </div>
        
        {/* Legal Disclaimer */}
        <div className="mt-8">
          <LegalDisclaimer />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <LegalDisclaimer />
      <GenerationWizard mode={selectedMode} />
    </div>
  );
}
