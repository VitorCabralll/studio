"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { FadeIn } from "@/components/magic-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export function ContactSection() {
  return (
    <section id="contact" className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 py-24 dark:from-slate-900 dark:via-blue-950/20 dark:to-indigo-950/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-16 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Contato
          </span>
          <h2 className="mt-4 text-headline-large">
            Vamos conversar sobre
            <span className="block text-primary">como podemos te ajudar</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-body-large">
            Entre em contato conosco e descubra como o LexAI pode transformar sua prática jurídica
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Informações de Contato */}
          <FadeIn delay={0.2}>
            <div className="space-y-8">
              <div>
                <h3 className="mb-6 text-headline">
                  Fale conosco
                </h3>
                <p className="mb-8 text-body">
                  Nossa equipe está pronta para esclarecer suas dúvidas e ajudar você a começar com o LexAI.
                </p>
              </div>

              <div className="space-y-6">
                {/* Email */}
                <motion.div
                  className="flex items-center space-x-4"
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50">
                    <Mail className="size-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <a href="mailto:contato@lexai.com.br" className="text-body hover:text-primary transition-colors">
                      contato@lexai.com.br
                    </a>
                  </div>
                </motion.div>

                {/* WhatsApp */}
                <motion.div
                  className="flex items-center space-x-4"
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50">
                    <MessageCircle className="size-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">WhatsApp</p>
                    <a href="https://wa.me/5565999999999" className="text-body hover:text-primary transition-colors">
                      (65) 99999-9999
                    </a>
                  </div>
                </motion.div>

                {/* Localização */}
                <motion.div
                  className="flex items-center space-x-4"
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/50 dark:to-violet-900/50">
                    <MapPin className="size-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Localização</p>
                    <p className="text-body">Cuiabá - MT, Brasil</p>
                  </div>
                </motion.div>
              </div>

              {/* Horário de Atendimento */}
              <Card className="border border-border bg-white/80 backdrop-blur-sm shadow-medium dark:bg-slate-800/80">
                <CardContent className="p-6">
                  <h4 className="mb-4 font-semibold text-foreground">Horário de Atendimento</h4>
                  <div className="space-y-2 text-body">
                    <div className="flex justify-between">
                      <span>Segunda a Sexta</span>
                      <span>8h00 - 18h00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sábado</span>
                      <span>8h00 - 12h00</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Domingo</span>
                      <span>Fechado</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </FadeIn>

          {/* Formulário de Contato */}
          <FadeIn delay={0.4}>
            <Card className="border border-border bg-white/90 backdrop-blur-md shadow-large dark:bg-slate-800/90">
              <CardContent className="p-8">
                <h3 className="mb-6 text-headline">
                  Envie uma mensagem
                </h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
                        Nome
                      </label>
                      <Input
                        id="name"
                        placeholder="Seu nome completo"
                        className="border-border bg-background/50 focus:border-primary/50 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        className="border-border bg-background/50 focus:border-primary/50 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="mb-2 block text-sm font-medium text-foreground">
                      Assunto
                    </label>
                    <Input
                      id="subject"
                      placeholder="Como podemos ajudar?"
                      className="border-border bg-background/50 focus:border-primary/50 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground">
                      Mensagem
                    </label>
                    <Textarea
                      id="message"
                      rows={5}
                      placeholder="Conte-nos mais sobre suas necessidades..."
                      className="border-border bg-background/50 focus:border-primary/50 focus:ring-primary/20"
                    />
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-primary/90 py-3 font-semibold shadow-medium hover:shadow-large focus-ring"
                    >
                      <Send className="mr-2 size-4" />
                      Enviar Mensagem
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}