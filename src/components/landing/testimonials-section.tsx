"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { FadeIn } from "@/components/magic-ui";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Advogado Beta Tester",
    role: "Advogado",
    company: "Teste Interno",
    content: "Durante os testes, a ferramenta mostrou potencial para automatizar documentos repetitivos e economizar tempo significativo na elaboração de petições.",
    rating: 4,
    avatar: "/avatars/default-lawyer.jpg",
    initials: "BT"
  },
  {
    name: "Usuário de Testes",
    role: "Desenvolvedor",
    company: "Equipe LexAI",
    content: "O sistema está em desenvolvimento ativo. Os primeiros resultados mostram capacidade de gerar documentos estruturados com base em templates.",
    rating: 4,
    avatar: "/avatars/default-lawyer.jpg", 
    initials: "UT"
  }
];

const stats = [
  { label: "Documentos de teste", value: "120+" },
  { label: "Versão atual", value: "Beta" },
  { label: "Em desenvolvimento", value: "2024" },
  { label: "Localização", value: "MT" },
];

export function TestimonialsSection() {
  return (
    <section className="bg-gray-50 py-24 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-16 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Em Desenvolvimento
          </span>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Feedback inicial dos
            <span className="block text-blue-600 dark:text-blue-400">primeiros testes</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Resultados preliminares do desenvolvimento do LexAI
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
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                  className="mb-2 text-3xl font-bold text-blue-600 dark:text-blue-400 md:text-4xl"
                >
                  {stat.value}
                </motion.div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Testimonials */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <FadeIn key={testimonial.name} delay={index * 0.2}>
              <Card className="h-full border-0 bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-gray-900">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center">
                    <Quote className="size-8 text-blue-600 opacity-50 dark:text-blue-400" />
                    <div className="ml-auto flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="size-4 fill-current text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  
                  <blockquote className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300">
                    &ldquo;{testimonial.content}&rdquo;
                  </blockquote>
                  
                  <div className="flex items-center">
                    <Avatar className="mr-4 size-12">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback className="bg-blue-100 font-semibold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        {/* CTA */}
        <FadeIn delay={0.8} className="mt-16 text-center">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-900">
            <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Pronto para se juntar a eles?
            </h3>
            <p className="mx-auto mb-6 max-w-2xl text-gray-600 dark:text-gray-300">
              Comece seu teste gratuito hoje e veja como o LexAI pode transformar sua prática jurídica
            </p>
            <motion.button
              className="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white shadow-lg transition-colors hover:bg-blue-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Começar Teste Gratuito
            </motion.button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}