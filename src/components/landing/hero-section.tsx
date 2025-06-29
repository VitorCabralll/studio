"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TextAnimate, FadeIn } from "@/components/magic-ui";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn delay={0.2}>
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200 dark:border-gray-700">
              <Sparkles className="w-4 h-4 text-purple-600" />
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
            className="text-4xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent leading-tight"
          >
            Automatize Documentos Jurídicos com IA
          </TextAnimate>

          <FadeIn delay={0.6} className="max-w-3xl mx-auto">
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Gere petições, contratos e pareceres profissionais em minutos. 
              Nossa IA especializada em direito brasileiro transforma suas ideias 
              em documentos juridicamente precisos.
            </p>
          </FadeIn>

          <FadeIn delay={0.9} className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button size="lg" className="group relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative flex items-center">
                Começar Gratuitamente
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            
            <Button variant="outline" size="lg" className="group">
              <Zap className="mr-2 w-4 h-4 group-hover:text-yellow-500 transition-colors" />
              Ver Demo
            </Button>
          </FadeIn>

          <FadeIn delay={1.2}>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Sem cartão de crédito
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Setup em 2 minutos
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Suporte 24/7
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Floating cards preview */}
        <FadeIn delay={1.5} className="mt-16">
          <div className="relative">
            <motion.div
              className="absolute left-10 top-10 w-64 h-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4"
              initial={{ opacity: 0, y: 20, rotate: -5 }}
              animate={{ opacity: 1, y: 0, rotate: -5 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              <div className="h-3 w-3 bg-red-500 rounded-full mb-2"></div>
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
              </div>
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">Petição</div>
            </motion.div>

            <motion.div
              className="absolute right-10 top-10 w-64 h-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4"
              initial={{ opacity: 0, y: 20, rotate: 5 }}
              animate={{ opacity: 1, y: 0, rotate: 5 }}
              transition={{ delay: 1.7, duration: 0.8 }}
            >
              <div className="h-3 w-3 bg-green-500 rounded-full mb-2"></div>
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-4/5"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">Contrato</div>
            </motion.div>

            <motion.div
              className="mx-auto w-80 h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-2xl p-6 text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9, duration: 0.8 }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">LexAI Dashboard</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-80">Documentos gerados hoje</span>
                  <span className="font-bold">47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-80">Tempo médio</span>
                  <span className="font-bold">2.3 min</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <motion.div
                    className="bg-white rounded-full h-2"
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