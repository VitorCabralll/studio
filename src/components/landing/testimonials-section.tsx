"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/magic-ui";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  {
    title: "Economia de Tempo",
    description: "Reduza em até 80% o tempo gasto na elaboração de documentos jurídicos repetitivos",
    icon: "⏱️"
  },
  {
    title: "Precisão Jurídica",
    description: "IA treinada especificamente no direito brasileiro garante conformidade legal",
    icon: "⚖️"
  },
  {
    title: "Segurança Total",
    description: "Dados protegidos com criptografia de ponta e conformidade LGPD",
    icon: "🔒"
  },
  {
    title: "Suporte Especializado",
    description: "Equipe técnica com conhecimento jurídico para apoiar seu workflow",
    icon: "🎯"
  }
];

const stats = [
  { label: "Tipos de Documento", value: "50+" },
  { label: "Disponibilidade", value: "24/7" },
  { label: "Conformidade", value: "LGPD" },
  { label: "Segurança", value: "A+" },
];

export function TestimonialsSection() {
  return (
    <section id="security" className="bg-secondary/30 py-24 dark:bg-secondary/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-16 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Confiança e Segurança
          </span>
          <h2 className="mt-4 text-headline-large">
            Tecnologia pensada para
            <span className="block text-primary">operadores do direito</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-body-large">
            Desenvolvido com foco na produtividade e segurança do seu trabalho jurídico
          </p>
        </FadeIn>

        {/* Stats */}
        <FadeIn delay={0.2} className="mb-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5, ease: "easeOut" }}
                  className="mb-2 text-3xl font-bold text-primary md:text-4xl"
                >
                  {stat.value}
                </motion.div>
                <p className="text-caption">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Benefits */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <FadeIn key={benefit.title} delay={index * 0.2}>
              <Card className="h-full border border-border bg-card shadow-subtle transition-all duration-300 hover:shadow-medium">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 text-4xl">
                    {benefit.icon}
                  </div>
                  
                  <h3 className="mb-3 text-headline font-semibold">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-body">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        {/* CTA */}
        <FadeIn delay={0.8} className="mt-16 text-center">
          <div className="rounded-lg border border-border bg-surface-elevated p-8 shadow-medium">
            <h3 className="mb-4 text-headline-large">
              Pronto para otimizar seu workflow?
            </h3>
            <p className="mx-auto mb-6 max-w-2xl text-body-large">
              Comece a usar o LexAI hoje e transforme a forma como você produz documentos jurídicos
            </p>
            <motion.button
              className="rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground shadow-subtle transition-all hover:bg-primary/90 hover:shadow-medium focus-ring"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              Começar Agora
            </motion.button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}