"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/magic-ui";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Dr. Carlos Mendes",
    role: "Sócio-Fundador, Mendes & Associados",
    content: "Recuperei 20 horas por semana. Agora posso focar na estratégia dos casos ao invés de ficar perdendo tempo com petições repetitivas.",
    avatar: "CM",
    highlight: "20h/semana recuperadas",
    gradient: "from-emerald-500 to-teal-600"
  },
  {
    name: "Dra. Ana Silva",
    role: "Promotora de Justiça, MPSP",
    content: "O que levava 3 horas para redigir, agora faço em 10 minutos. A precisão técnica é impecável e a segurança total.",
    avatar: "AS",
    highlight: "3h → 10 min",
    gradient: "from-blue-500 to-indigo-600"
  },
  {
    name: "Dr. Pedro Costa",
    role: "Defensor Público, DPE-RJ",
    content: "Consegui dobrar o número de casos atendidos sem aumentar a equipe. O impacto social foi imenso.",
    avatar: "PC",
    highlight: "2x mais casos",
    gradient: "from-purple-500 to-pink-600"
  },
  {
    name: "Dra. Lúcia Ferreira",
    role: "Advogada Trabalhista, LF Advocacia",
    content: "Minha produtividade disparou. O que mais me impressiona é o suporte - são verdadeiros especialistas em produtividade.",
    avatar: "LF",
    highlight: "Suporte especializado",
    gradient: "from-amber-500 to-orange-600"
  }
];

const stats = [
  { label: "Tempo Recuperado", value: "Significativo", color: "text-emerald-600" },
  { label: "Redução de Tempo", value: "90%", color: "text-blue-600" },
  { label: "Satisfação", value: "98%", color: "text-purple-600" },
  { label: "Suporte Técnico", value: "24/7", color: "text-amber-600" },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-secondary/30 py-24 dark:bg-secondary/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-16 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Resultados Reais
          </span>
          <h2 className="mt-4 text-headline-large">
            Profissionais que já <span className="text-emerald-600">otimizaram</span>
            <span className="block text-primary">sua produtividade</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-body-large">
            Veja como o LexAI está transformando a rotina de advogados, promotores e defensores em todo o país
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
                  className={`mb-2 text-3xl font-bold md:text-4xl ${stat.color}`}
                >
                  {stat.value}
                </motion.div>
                <p className="text-caption font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Testimonials */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <FadeIn key={testimonial.name} delay={index * 0.2}>
              <Card className="h-full border border-border bg-card shadow-subtle transition-all duration-300 hover:shadow-medium hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center space-x-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.gradient} text-white font-bold text-sm`}>
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {testimonial.role}
                      </p>
                    </div>
                    <div className={`rounded-full px-3 py-1 bg-gradient-to-r ${testimonial.gradient} text-white text-xs font-bold`}>
                      {testimonial.highlight}
                    </div>
                  </div>
                  
                  <blockquote className="text-slate-700 dark:text-slate-300 italic leading-relaxed">
                    &ldquo;{testimonial.content}&rdquo;
                  </blockquote>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        {/* CTA */}
        <FadeIn delay={0.8} className="mt-16 text-center">
          <div className="rounded-lg border border-border bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-950/30 p-8 shadow-medium">
            <h3 className="mb-4 text-headline-large">
              Pronto para <span className="text-emerald-600">começar</span>?
            </h3>
            <p className="mx-auto mb-6 max-w-2xl text-body-large">
              Junte-se aos centenas de profissionais que já automatizam seus documentos. 
              <strong className="text-slate-800 dark:text-slate-200">Suporte especializado incluso.</strong>
            </p>
            <motion.button
              className="rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3 font-medium text-white shadow-subtle transition-all hover:from-emerald-700 hover:to-teal-700 hover:shadow-medium focus-ring"
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