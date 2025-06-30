"use client";

import { motion } from "framer-motion";
import { 
  Upload, 
  Settings, 
  Sparkles, 
  Download,
  ArrowRight,
  FileText,
  Bot
} from "lucide-react";
import { FadeIn } from "@/components/magic-ui";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload dos Documentos",
    description: "Faça upload dos documentos do processo, contratos ou qualquer material relevante. Nossa IA processa PDFs, imagens e textos.",
    details: ["OCR automático", "Múltiplos formatos", "Processamento seguro"],
    color: "from-blue-500 to-blue-600"
  },
  {
    number: "02", 
    icon: Settings,
    title: "Configure Instruções",
    description: "Informe o tipo de documento desejado, instruções específicas e qualquer orientação particular para o seu caso.",
    details: ["Templates inteligentes", "Personalização total", "Instruções em português"],
    color: "from-purple-500 to-purple-600"
  },
  {
    number: "03",
    icon: Bot,
    title: "IA Processa",
    description: "Nossa IA especializada analisa tudo, identifica pontos relevantes e estrutura o documento seguindo as melhores práticas jurídicas.",
    details: ["Análise jurídica", "Fundamentação automática", "Revisão inteligente"],
    color: "from-green-500 to-green-600"
  },
  {
    number: "04",
    icon: Download,
    title: "Documento Pronto",
    description: "Receba seu documento profissional, formatado e fundamentado, pronto para uso ou para revisão final.",
    details: ["Formato profissional", "Export DOCX/PDF", "Revisão incluída"],
    color: "from-orange-500 to-orange-600"
  }
];

export function HowItWorksSection() {
  return (
    <section className="bg-gray-50 py-24 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-16 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Como Funciona
          </span>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            De documentos simples a
            <span className="block text-blue-600 dark:text-blue-400">documentos profissionais em 4 passos</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Processo simples e intuitivo que qualquer advogado pode usar
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <FadeIn key={step.number} delay={index * 0.2}>
                <div className="group flex items-start space-x-4">
                  <div className="shrink-0">
                    <div className={`size-16 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center text-lg font-bold text-white transition-transform duration-300 group-hover:scale-110`}>
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center">
                      <step.icon className="mr-2 size-5 text-gray-500 dark:text-gray-400" />
                      <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                        {step.title}
                      </h3>
                    </div>
                    <p className="mb-3 leading-relaxed text-gray-600 dark:text-gray-300">
                      {step.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {step.details.map((detail, detailIndex) => (
                        <span
                          key={detailIndex}
                          className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        >
                          {detail}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Visual Flow */}
          <div className="lg:pl-8">
            <FadeIn delay={0.3}>
              <div className="relative">
                {/* Main Flow Card */}
                <Card className="overflow-hidden border-0 bg-white shadow-xl dark:bg-gray-900">
                  <CardContent className="p-8">
                    <div className="mb-6 text-center">
                      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                        <Sparkles className="size-8 text-white" />
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                        Pipeline LexAI
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Processamento inteligente em tempo real
                      </p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { label: "Análise OCR", progress: 100, color: "bg-blue-500" },
                        { label: "Sumarização", progress: 100, color: "bg-purple-500" },
                        { label: "Estruturação", progress: 85, color: "bg-green-500" },
                        { label: "Geração", progress: 65, color: "bg-orange-500" },
                        { label: "Revisão", progress: 30, color: "bg-red-500" },
                      ].map((item, index) => (
                        <div key={item.label}>
                          <div className="mb-1 flex justify-between text-sm">
                            <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                            <span className="text-gray-500 dark:text-gray-400">{item.progress}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                            <motion.div
                              className={`h-2 rounded-full ${item.color}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${item.progress}%` }}
                              transition={{ delay: index * 0.2 + 0.5, duration: 1 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-green-600 dark:text-green-400">
                          <div className="mr-2 size-2 animate-pulse rounded-full bg-green-500"></div>
                          Processando...
                        </div>
                        <span className="text-gray-500 dark:text-gray-400">ETA: 2min 34s</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Floating Documents */}
                <motion.div
                  className="absolute -right-4 -top-4 flex h-16 w-12 items-center justify-center rounded border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
                  initial={{ opacity: 0, rotate: -10 }}
                  animate={{ opacity: 1, rotate: -10 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <FileText className="size-6 text-blue-500" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 flex h-16 w-12 items-center justify-center rounded border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
                  initial={{ opacity: 0, rotate: 10 }}
                  animate={{ opacity: 1, rotate: 10 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <FileText className="size-6 text-green-500" />
                </motion.div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Bottom CTA */}
        <FadeIn delay={1} className="mt-16 text-center">
          <div className="inline-flex items-center space-x-4 text-gray-600 dark:text-gray-300">
            <span>Veja o LexAI em ação</span>
            <ArrowRight className="size-4" />
            <motion.button
              className="font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              whileHover={{ scale: 1.05 }}
            >
              Assistir Demo de 3 minutos
            </motion.button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}