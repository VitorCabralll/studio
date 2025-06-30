"use client";

import { motion } from "framer-motion";
import { 
  Check, 
  Zap, 
  Crown, 
  Building,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { FadeIn } from "@/components/magic-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Starter",
    description: "Perfeito para advogados autônomos",
    price: "97",
    period: "/mês",
    icon: Zap,
    color: "border-gray-200 dark:border-gray-700",
    buttonStyle: "bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900",
    features: [
      "50 documentos por mês",
      "Tipos básicos (petições, contratos)",
      "OCR até 10MB por arquivo",
      "Suporte por email",
      "Templates padrão",
      "Export PDF/DOCX"
    ],
    limitations: []
  },
  {
    name: "Professional",
    description: "Para escritórios em crescimento",
    price: "197",
    period: "/mês",
    icon: Crown,
    color: "border-blue-500 dark:border-blue-400",
    popular: true,
    buttonStyle: "bg-blue-600 hover:bg-blue-700 text-white",
    features: [
      "200 documentos por mês",
      "Todos os tipos de documento",
      "OCR até 50MB por arquivo",
      "Suporte prioritário",
      "Templates customizáveis",
      "API access",
      "Revisão jurídica IA",
      "Análise de precedentes",
      "Workspace colaborativo"
    ],
    limitations: []
  },
  {
    name: "Enterprise",
    description: "Para grandes escritórios",
    price: "497",
    period: "/mês",
    icon: Building,
    color: "border-purple-500 dark:border-purple-400",
    buttonStyle: "bg-purple-600 hover:bg-purple-700 text-white",
    features: [
      "Documentos ilimitados",
      "Todos os recursos Premium",
      "OCR ilimitado",
      "Suporte dedicado 24/7",
      "Templates personalizados",
      "Integrações customizadas",
      "White-label disponível",
      "Compliance personalizado",
      "Treinamento da equipe",
      "SLA garantido"
    ],
    limitations: []
  }
];

export function PricingSection() {
  return (
    <section className="bg-white py-24 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-16 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Preços
          </span>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Planos que crescem
            <span className="block text-blue-600 dark:text-blue-400">com seu escritório</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Todos os planos incluem 14 dias de teste gratuito. Sem taxa de setup, cancele quando quiser.
          </p>
        </FadeIn>

        {/* Pricing Toggle */}
        <FadeIn delay={0.2} className="mb-12 flex justify-center">
          <div className="rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
            <div className="grid grid-cols-2 gap-1">
              <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white">
                Mensal
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                Anual (20% off)
              </button>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <FadeIn key={plan.name} delay={index * 0.1}>
              <Card className={`relative h-full ${plan.color} ${plan.popular ? 'scale-105 shadow-2xl' : 'shadow-lg'} transition-all duration-300 hover:shadow-xl`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-600 px-4 py-1 text-white">
                      <Sparkles className="mr-1 size-3" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-6 text-center">
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <plan.icon className="size-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    {plan.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {plan.description}
                  </p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      R${plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {plan.period}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <Button className={`mb-6 w-full ${plan.buttonStyle}`}>
                    <span className="flex items-center">
                      Começar Teste Gratuito
                      <ArrowRight className="ml-2 size-4" />
                    </span>
                  </Button>

                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + featureIndex * 0.05 }}
                      >
                        <Check className="mr-3 mt-0.5 size-5 shrink-0 text-green-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  {plan.name === "Enterprise" && (
                    <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
                      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Precisa de algo específico?{" "}
                        <button className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                          Fale conosco
                        </button>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        {/* FAQ Section */}
        <FadeIn delay={0.8} className="mt-16">
          <div className="rounded-2xl bg-gray-50 p-8 dark:bg-gray-800">
            <h3 className="mb-6 text-center text-xl font-bold text-gray-900 dark:text-white">
              Perguntas Frequentes
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[
                {
                  question: "Posso cancelar a qualquer momento?",
                  answer: "Sim, você pode cancelar sua assinatura a qualquer momento sem multas ou taxas."
                },
                {
                  question: "Os documentos são seguros?",
                  answer: "Sim, utilizamos criptografia de ponta a ponta e compliance total com LGPD."
                },
                {
                  question: "Há integração com outros sistemas?",
                  answer: "Sim, oferecemos API e integrações com principais sistemas jurídicos."
                },
                {
                  question: "Suporte técnico está incluído?",
                  answer: "Todos os planos incluem suporte. Professional e Enterprise têm suporte prioritário."
                }
              ].map((faq, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {faq.question}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Trust indicators */}
        <FadeIn delay={1} className="mt-12 text-center">
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <div className="mr-2 size-2 rounded-full bg-green-500"></div>
              14 dias grátis
            </div>
            <div className="flex items-center">
              <div className="mr-2 size-2 rounded-full bg-blue-500"></div>
              Sem cartão obrigatório
            </div>
            <div className="flex items-center">
              <div className="mr-2 size-2 rounded-full bg-purple-500"></div>
              Cancele quando quiser
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}