"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/magic-ui";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Ana Silva",
    role: "Advogada Civilista",
    company: "Silva & Associados",
    content: "O LexAI revolucionou minha prática. O que antes levava horas, agora levo minutos. A qualidade dos documentos é impressionante e sempre fundamentada.",
    rating: 5,
    avatar: "/avatars/ana.jpg",
    initials: "AS"
  },
  {
    name: "João Pereira",
    role: "Sócio-fundador",
    company: "Pereira Advocacia",
    content: "Implementamos o LexAI em nosso escritório e a produtividade aumentou 300%. Nossa equipe agora foca no que realmente importa: a estratégia jurídica.",
    rating: 5,
    avatar: "/avatars/joao.jpg",
    initials: "JP"
  },
  {
    name: "Mariana Costa",
    role: "Advogada Trabalhista",
    company: "Costa Legal",
    content: "A IA do LexAI entende perfeitamente as nuances do direito brasileiro. É como ter um estagiário genial que nunca erra.",
    rating: 5,
    avatar: "/avatars/mariana.jpg",
    initials: "MC"
  }
];

const stats = [
  { label: "Documentos gerados", value: "50,000+" },
  { label: "Horas economizadas", value: "25,000+" },
  { label: "Escritórios ativos", value: "500+" },
  { label: "Satisfação", value: "98%" },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Depoimentos
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Advogados que já
            <span className="block text-blue-600 dark:text-blue-400">transformaram sua prática</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Veja como o LexAI está ajudando escritórios de todos os tamanhos
          </p>
        </FadeIn>

        {/* Stats */}
        <FadeIn delay={0.2} className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                  className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2"
                >
                  {stat.value}
                </motion.div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <FadeIn key={testimonial.name} delay={index * 0.2}>
              <Card className="h-full bg-white dark:bg-gray-900 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Quote className="w-8 h-8 text-blue-600 dark:text-blue-400 opacity-50" />
                    <div className="flex ml-auto">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  
                  <blockquote className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>
                  
                  <div className="flex items-center">
                    <Avatar className="w-12 h-12 mr-4">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold">
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
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Pronto para se juntar a eles?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Comece seu teste gratuito hoje e veja como o LexAI pode transformar sua prática jurídica
            </p>
            <motion.button
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg"
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