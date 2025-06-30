"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextAnimate, FadeIn } from "@/components/magic-ui";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -right-32 -top-40 size-80 rounded-full bg-purple-300 opacity-20 mix-blend-multiply blur-xl"></div>
        <div className="animate-blob animation-delay-2000 absolute -bottom-40 -left-32 size-80 rounded-full bg-blue-300 opacity-20 mix-blend-multiply blur-xl"></div>
        <div className="animate-blob animation-delay-4000 absolute left-40 top-40 size-80 rounded-full bg-pink-300 opacity-20 mix-blend-multiply blur-xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <FadeIn delay={0.2}>
          <div className="mb-6 flex items-center justify-center">
            <div className="flex items-center space-x-2 rounded-full border border-gray-200 bg-white/80 px-4 py-2 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
              <Sparkles className="size-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Powered by AI
              </span>
            </div>
          </div>
        </FadeIn>

        <div className="space-y-6">
          <TextAnimate
            animation="slideUp"
            delay={0.3}
            className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-4xl font-bold leading-tight text-transparent dark:from-white dark:via-blue-100 dark:to-purple-100 sm:text-6xl lg:text-7xl"
          >
            Automatize Documentos Jurídicos com IA
          </TextAnimate>

          <FadeIn delay={0.6} className="mx-auto max-w-3xl">
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 sm:text-xl">
              Gere petições, contratos e pareceres profissionais em minutos. 
              Nossa IA especializada em direito brasileiro transforma suas ideias 
              em documentos juridicamente precisos.
            </p>
          </FadeIn>

          <FadeIn delay={0.9} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="group relative overflow-hidden bg-blue-600 text-white hover:bg-blue-700">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative flex items-center">
                Começar Gratuitamente
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
            
            <Button variant="outline" size="lg" className="group">
              <Zap className="mr-2 size-4 transition-colors group-hover:text-yellow-500" />
              Ver Demo
            </Button>
          </FadeIn>

          <FadeIn delay={1.2}>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <div className="mr-2 size-2 rounded-full bg-green-500"></div>
                Sem cartão de crédito
              </div>
              <div className="flex items-center">
                <div className="mr-2 size-2 rounded-full bg-blue-500"></div>
                Setup em 2 minutos
              </div>
              <div className="flex items-center">
                <div className="mr-2 size-2 rounded-full bg-purple-500"></div>
                Suporte 24/7
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Floating cards preview */}
        <FadeIn delay={1.5} className="mt-16">
          <div className="relative">
            <motion.div
              className="absolute left-10 top-10 h-40 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800"
              initial={{ opacity: 0, y: 20, rotate: -5 }}
              animate={{ opacity: 1, y: 0, rotate: -5 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              <div className="mb-2 size-3 rounded-full bg-red-500"></div>
              <div className="space-y-2">
                <div className="h-2 w-3/4 rounded bg-gray-200 dark:bg-gray-600"></div>
                <div className="h-2 w-1/2 rounded bg-gray-200 dark:bg-gray-600"></div>
                <div className="h-2 w-5/6 rounded bg-gray-200 dark:bg-gray-600"></div>
              </div>
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">Petição</div>
            </motion.div>

            <motion.div
              className="absolute right-10 top-10 h-40 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800"
              initial={{ opacity: 0, y: 20, rotate: 5 }}
              animate={{ opacity: 1, y: 0, rotate: 5 }}
              transition={{ delay: 1.7, duration: 0.8 }}
            >
              <div className="mb-2 size-3 rounded-full bg-green-500"></div>
              <div className="space-y-2">
                <div className="h-2 w-2/3 rounded bg-gray-200 dark:bg-gray-600"></div>
                <div className="h-2 w-4/5 rounded bg-gray-200 dark:bg-gray-600"></div>
                <div className="h-2 w-1/2 rounded bg-gray-200 dark:bg-gray-600"></div>
              </div>
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">Contrato</div>
            </motion.div>

            <motion.div
              className="mx-auto h-48 w-80 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9, duration: 0.8 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium">LexAI Dashboard</span>
                <div className="size-2 animate-pulse rounded-full bg-green-400"></div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-80">Documentos gerados hoje</span>
                  <span className="font-bold">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-80">Tempo médio</span>
                  <span className="font-bold">2.3 min</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/20">
                  <motion.div
                    className="h-2 rounded-full bg-white"
                    initial={{ width: "0%" }}
                    animate={{ width: "78%" }}
                    transition={{ delay: 2.2, duration: 1 }}
                  ></motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}