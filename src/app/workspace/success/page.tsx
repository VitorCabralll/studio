
'use client';

import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Bot, Sparkles, Target } from "lucide-react";
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function WorkspaceSuccessPage() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-gradient-to-br from-background via-background to-blue-50/30 p-4 dark:to-blue-950/20 md:p-8">
      {/* Background Pattern */}
      <div className="bg-grid-slate-200/20 dark:bg-grid-slate-700/20 pointer-events-none absolute inset-0" />
      
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl"
      >
        <Card className="border-blue-200/50 text-center shadow-2xl dark:border-blue-800/50">
          <CardHeader className="space-y-8 pb-8">
            {/* Success Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
              className="relative mx-auto flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600"
            >
              <CheckCircle className="size-10 text-white" />
              
              {/* Sparkles animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="absolute -right-2 -top-2"
              >
                <Sparkles className="size-6 text-blue-400" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                className="absolute -bottom-2 -left-2"
              >
                <Sparkles className="size-4 text-blue-300" />
              </motion.div>
            </motion.div>
            
            {/* Success Message */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-headline text-4xl font-bold text-blue-600 dark:text-blue-400"
              >
                Workspace Criado! 🎆
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl font-semibold"
              >
                Seu ambiente de trabalho está pronto!
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mx-auto max-w-lg text-lg leading-relaxed text-muted-foreground"
              >
                Agora vamos criar seu primeiro agente inteligente. Ele será responsável por gerar documentos com IA, baseando-se nos seus modelos e especialidade.
              </motion.p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-6"
            >
              <div className="grid gap-4 text-sm md:grid-cols-3">
                <div className="flex flex-col items-center space-y-2 p-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                    <span className="font-bold text-blue-600 dark:text-blue-400">1</span>
                  </div>
                  <p className="font-medium">Criar Agente</p>
                  <p className="text-center text-muted-foreground">Defina especialidade e treine com seus documentos</p>
                </div>
                <div className="flex flex-col items-center space-y-2 p-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                    <span className="font-bold text-green-600 dark:text-green-400">2</span>
                  </div>
                  <p className="font-medium">Gerar Documentos</p>
                  <p className="text-center text-muted-foreground">Use IA para criar textos jurídicos personalizados</p>
                </div>
                <div className="flex flex-col items-center space-y-2 p-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                    <span className="font-bold text-purple-600 dark:text-purple-400">3</span>
                  </div>
                  <p className="font-medium">Colaborar</p>
                  <p className="text-center text-muted-foreground">Convide colegas para trabalhar juntos</p>
                </div>
              </div>
            </motion.div>
            
            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/90 px-8 py-6 text-lg hover:from-primary/90 hover:to-primary">
                <Link href="/agente/criar">
                  <Bot className="mr-3 size-5" />
                  Criar meu primeiro agente
                  <ArrowRight className="ml-3 size-5" />
                </Link>
              </Button>
            </motion.div>
            
            {/* Alternative Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="border-t pt-6"
            >
              <p className="mb-4 text-sm text-muted-foreground">
                Ou explore outras opções:
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/generate">
                    <Target className="mr-2 size-4" />
                    Gerar Documento
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/">
                    Dashboard
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
