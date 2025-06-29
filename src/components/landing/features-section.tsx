"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/magic-ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Funcionalidades
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Tudo que você precisa para
            <span className="block text-blue-600 dark:text-blue-400">automatizar sua prática jurídica</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Funcionalidades desenvolvidas especificamente para advogados brasileiros
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FadeIn key={feature.title} delay={index * 0.1}>
              <Card className="group h-full hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
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
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Pronto para revolucionar sua prática jurídica?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Junte-se a centenas de advogados que já economizam horas semanais com LexAI
            </p>
            <motion.button
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Começar Teste Gratuito
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}