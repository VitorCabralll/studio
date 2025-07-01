'use client';

import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Sparkles, Briefcase, Users } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function OnboardingSuccessPage() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-gradient-to-br from-background via-background to-green-50/30 p-4 dark:to-green-950/20 md:p-8">
      {/* Background Pattern */}
      <div className="bg-grid-slate-200/20 dark:bg-grid-slate-700/20 pointer-events-none absolute inset-0" />
      
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl"
      >
        <Card className="border-green-200/50 text-center shadow-2xl dark:border-green-800/50">
          <CardHeader className="space-y-8 pb-8">
            {/* Success Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
              className="relative mx-auto flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600"
            >
              <CheckCircle className="size-10 text-white" />
              
              {/* Sparkles animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="absolute -right-2 -top-2"
              >
                <Sparkles className="size-6 text-green-400" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                className="absolute -bottom-2 -left-2"
              >
                <Sparkles className="size-4 text-green-300" />
              </motion.div>
            </motion.div>
            
            {/* Success Message */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-headline text-4xl font-bold text-green-600 dark:text-green-400"
              >
                Parabéns! 🎉
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl font-semibold"
              >
                Seu perfil foi configurado com sucesso!
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mx-auto max-w-lg text-lg leading-relaxed text-muted-foreground"
              >
                Agora você está pronto para começar a criar documentos jurídicos com inteligência artificial. Escolha como gostaria de começar:
              </motion.p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Action Cards */}
            <div className="grid gap-4 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="border-dashed p-4 transition-all duration-300 hover:border-solid hover:border-primary/50 hover:shadow-lg">
                  <div className="space-y-3">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                      <Users className="size-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold">Criar Workspace</h3>
                    <p className="text-sm text-muted-foreground">
                      Organize projetos e colabore com sua equipe
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/workspace">
                        Começar
                        <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-4 transition-all duration-300 hover:shadow-lg">
                  <div className="space-y-3">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
                      <Briefcase className="size-6 text-white" />
                    </div>
                    <h3 className="font-semibold">Criar Primeiro Agente</h3>
                    <p className="text-sm text-muted-foreground">
                      IA personalizada para sua área de atuação
                    </p>
                    <Button asChild className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
                      <Link href="/agente/criar">
                        Criar Agente
                        <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>
            
            {/* Quick Start */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="border-t pt-6"
            >
              <p className="mb-4 text-sm text-muted-foreground">
                Ou pule direto para a criação de documentos:
              </p>
              <Button asChild variant="ghost" className="text-primary hover:text-primary/80">
                <Link href="/generate">
                  <Sparkles className="mr-2 size-4" />
                  Gerar Documento Agora
                </Link>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}