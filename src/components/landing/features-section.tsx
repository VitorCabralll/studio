"use client";

import { motion } from "framer-motion";
import { 
  Zap, 
  Shield, 
  Clock, 
  Brain, 
  FileText, 
  Scale,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { FadeIn } from "@/components/magic-ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "IA Especializada em Direito",
    description: "Nossa IA foi treinada especificamente com legislação brasileira, jurisprudência e práticas jurídicas.",
    details: ["CNJ compliance", "LGPD adequado", "Precedentes atualizados"],
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/20"
  },
  {
    icon: Zap,
    title: "Geração Ultra-Rápida",
    description: "Documentos completos em minutos, não horas. Pipeline otimizado para máxima eficiência.",
    details: ["2-5 minutos", "Multi-threading", "Cache inteligente"],
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20"
  },
  {
    icon: Shield,
    title: "Máxima Segurança",
    description: "Criptografia end-to-end, compliance LGPD e auditoria completa de todas as operações.",
    details: ["Criptografia AES-256", "Logs auditáveis", "Isolamento de dados"],
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20"
  },
  {
    icon: FileText,
    title: "Múltiplos Formatos",
    description: "Petições, contratos, pareceres, notificações e muito mais. Todos formatados profissionalmente.",
    details: ["15+ tipos de documento", "Templates customizáveis", "Export DOCX/PDF"],
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20"
  },
  {
    icon: Scale,
    title: "Fundamentação Jurídica",
    description: "Citações automáticas de leis, artigos e precedentes relevantes ao seu caso.",
    details: ["Base jurídica atualizada", "Citações precisas", "Argumentação sólida"],
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20"
  },
  {
    icon: Clock,
    title: "Histórico Completo",
    description: "Versioning automático, backup seguro e acesso total ao histórico de documentos.",
    details: ["Backup automático", "Controle de versão", "Restauração fácil"],
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/20"
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-24 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-16 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Funcionalidades
          </span>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Tudo que você precisa para
            <span className="block text-blue-600 dark:text-blue-400">automatizar sua prática jurídica</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Funcionalidades desenvolvidas especificamente para operadores do direito brasileiro
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FadeIn key={feature.title} delay={index * 0.1}>
              <Card className="group h-full border-0 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <CardHeader className="pb-4">
                  <div className={`size-12 rounded-lg ${feature.bgColor} mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                    <feature.icon className={`size-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </CardDescription>
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <CheckCircle className="mr-2 size-4 shrink-0 text-green-500" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        {/* CTA Section */}
        <FadeIn delay={0.8} className="mt-16 text-center">
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50 p-8 dark:border-blue-800 dark:from-blue-950/20 dark:to-purple-950/20">
            <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Pronto para revolucionar sua prática jurídica?
            </h3>
            <p className="mx-auto mb-6 max-w-2xl text-gray-600 dark:text-gray-300">
              Junte-se a centenas de advogados que já economizam horas semanais com LexAI
            </p>
            <motion.button
              className="group inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Começar Teste Gratuito
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}