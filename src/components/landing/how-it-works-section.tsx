"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/magic-ui";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Upload, 
  Settings, 
  Sparkles, 
  Download,
  ArrowRight,
  FileText,
  Bot
} from "lucide-react";

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
    <section className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Como Funciona
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            De documentos simples a
            <span className="block text-blue-600 dark:text-blue-400">documentos profissionais em 4 passos</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Processo simples e intuitivo que qualquer advogado pode usar
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <FadeIn key={step.number} delay={index * 0.2}>
                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300`}>
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <step.icon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                      {step.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {step.details.map((detail, detailIndex) => (
                        <span
                          key={detailIndex}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
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
                <Card className="bg-white dark:bg-gray-900 shadow-xl border-0 overflow-hidden">
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Pipeline LexAI
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
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
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                            <span className="text-gray-500 dark:text-gray-400">{item.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
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

                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-green-600 dark:text-green-400">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                          Processando...
                        </div>
                        <span className="text-gray-500 dark:text-gray-400">ETA: 2min 34s</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Floating Documents */}
                <motion.div
                  className="absolute -top-4 -right-4 w-12 h-16 bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center"
                  initial={{ opacity: 0, rotate: -10 }}
                  animate={{ opacity: 1, rotate: -10 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <FileText className="w-6 h-6 text-blue-500" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 w-12 h-16 bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center"
                  initial={{ opacity: 0, rotate: 10 }}
                  animate={{ opacity: 1, rotate: 10 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <FileText className="w-6 h-6 text-green-500" />
                </motion.div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Bottom CTA */}
        <FadeIn delay={1} className="mt-16 text-center">
          <div className="inline-flex items-center space-x-4 text-gray-600 dark:text-gray-300">
            <span>Veja o LexAI em ação</span>
            <ArrowRight className="w-4 h-4" />
            <motion.button
              className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
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