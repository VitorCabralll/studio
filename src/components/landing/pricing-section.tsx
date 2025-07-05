"use client";

import { motion } from "framer-motion";
import { 
  Check, 
  Zap, 
  Crown, 
  Building,
  ArrowRight
} from "lucide-react";
import { FadeIn } from "@/components/magic-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Starter",
    description: "Recupere suas primeiras 10 horas/semana",
    price: "97",
    originalPrice: "297",
    period: "/mês",
    icon: Zap,
    color: "border-gray-200 dark:border-gray-700",
    buttonStyle: "bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900",
    valueProps: [
      "10+ horas recuperadas por semana",
      "Retorno sobre investimento comprovado",
      "Suporte especializado em produto"
    ],
    features: [
      "50 documentos por mês",
      "Tipos básicos (petições, contratos)",
      "OCR até 10MB por arquivo",
      "Suporte por email especializado",
      "Templates padrão",
      "Export PDF/DOCX"
    ],
    limitations: []
  },
  {
    name: "Professional",
    description: "Para quem quer recuperar 20+ horas/semana",
    price: "197",
    originalPrice: "597",
    period: "/mês",
    icon: Crown,
    color: "border-emerald-500 dark:border-emerald-400",
    popular: true,
    buttonStyle: "bg-emerald-600 hover:bg-emerald-700 text-white",
    valueProps: [
      "20+ horas recuperadas por semana",
      "Investimento com retorno garantido",
      "Suporte técnico especializado"
    ],
    features: [
      "200 documentos por mês",
      "Todos os tipos de documento",
      "OCR até 50MB por arquivo",
      "Suporte prioritário (não call center)",
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
    description: "Consultoria dedicada + horas ilimitadas",
    price: "497",
    originalPrice: "1497",
    period: "/mês",
    icon: Building,
    color: "border-purple-500 dark:border-purple-400",
    buttonStyle: "bg-purple-600 hover:bg-purple-700 text-white",
    valueProps: [
      "Horas ilimitadas recuperadas",
      "Transformação comprovada do negócio",
      "Suporte dedicado 24/7"
    ],
    features: [
      "Documentos ilimitados",
      "Todos os recursos Premium",
      "OCR ilimitado",
      "Suporte dedicado 24/7 (prioritário)",
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
    <section id="pricing" className="bg-white py-24 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-16 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Investimento que se paga
          </span>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Quanto vale recuperar
            <span className="block text-emerald-600 dark:text-emerald-400">15 horas da sua semana?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            <strong>Suporte especializado incluso em todos os planos.</strong> Teste 14 dias grátis, sem cartão obrigatório.
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
                      <Crown className="mr-1 size-3" />
                      Recomendado
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
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-lg text-gray-400 line-through">
                        R${plan.originalPrice}
                      </span>
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        R${plan.price}
                      </span>
                    </div>
                    <span className="text-gray-600 dark:text-gray-300">
                      {plan.period}
                    </span>
                  </div>
                  
                  {/* Value Props */}
                  <div className="mt-4 space-y-1">
                    {plan.valueProps.map((prop, index) => (
                      <div key={index} className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        ✓ {prop}
                      </div>
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <Button className={`mb-6 w-full ${plan.buttonStyle}`}>
                    <span className="flex items-center">
                      Otimizar Minha Prática
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
                        Precisa de suporte customizado?{" "}
                        <button className="font-medium text-purple-600 hover:underline dark:text-purple-400">
                          Fale com nossa equipe
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
                  question: "Qual a diferença entre suporte básico e especializado?",
                  answer: "Suporte básico resolve problemas técnicos. Suporte especializado inclui orientação sobre otimização de workflow e uso avançado da plataforma."
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