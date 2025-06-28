
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, Grip, FileText, PlusCircle, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const useCases = [
  { title: "Criar uma petição inicial", description: "Elabore uma petição inicial completa a partir de fatos e fundamentos.", icon: FileText, href: "/generate" },
  { title: "Analisar contrato", description: "Identifique cláusulas de risco e pontos de melhoria em segundos.", icon: FileText, href: "/generate" },
  { title: "Gerar notificação extrajudicial", description: "Crie notificações com base em modelos pré-definidos ou instruções.", icon: FileText, href: "/generate" },
  { title: "Resumir processo", description: "Obtenha um resumo dos principais pontos de um processo extenso.", icon: FileText, href: "/generate" },
];

const readyTemplates = [
  { title: "Contrato de Aluguel Residencial", href: "/generate" },
  { title: "Procuração Ad Judicia", href: "/generate" },
  { title: "Acordo de Confidencialidade (NDA)", href: "/generate" },
];

const customTemplates = [
  { title: "Modelo de Ação de Alimentos", href: "/generate" },
  { title: "Template para Recurso de Apelação Cível", href: "/generate" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-12 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Hero Section com melhor hierarquia visual */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-4 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">Seja bem-vindo ao LexAI</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Inteligência artificial para o direito. Crie documentos jurídicos profissionais em minutos.</p>
      </motion.div>

      {/* Ação Principal - Ponto focal destacado */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-6"
      >
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-headline">Comece por aqui</CardTitle>
            <CardDescription className="text-base">A forma mais rápida de criar documentos jurídicos profissionais com IA</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button size="lg" className="w-full md:w-auto mx-auto block text-lg py-6 px-8" asChild>
              <Link href="/generate">
                <FileText className="mr-3 h-5 w-5" />
                Criar Documento
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Cenários de Uso reorganizados */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Casos de uso populares</CardTitle>
            <CardDescription>Exemplos do que você pode criar com o LexAI</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <Card className="h-full hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <useCase.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                      <CardTitle className="text-base font-headline">{useCase.title}</CardTitle>
                    </div>
                    <CardDescription className="text-sm leading-relaxed">{useCase.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button variant="ghost" size="sm" className="w-full justify-between group-hover:bg-primary/5" asChild>
                      <Link href={useCase.href}>
                        Usar template
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Modelos unificados com Tabs - reduzindo carga cognitiva */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Seus Modelos e Templates</CardTitle>
            <CardDescription>Acesse templates prontos ou seus agentes personalizados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="ready" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ready" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Templates Prontos
                </TabsTrigger>
                <TabsTrigger value="custom" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Seus Agentes
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="ready" className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Templates validados para acelerar seu trabalho</p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" aria-label="Visualizar em grade">
                      <Grip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Visualizar em lista">
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-3">
                  {readyTemplates.map((template, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="font-medium group-hover:text-primary transition-colors">{template.title}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="group-hover:bg-primary/10" asChild>
                        <Link href={template.href}>
                          Usar
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="custom" className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Seus modelos e agentes de IA personalizados</p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" aria-label="Visualizar em grade">
                      <Grip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Visualizar em lista">
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-3">
                  {customTemplates.map((template, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="font-medium group-hover:text-primary transition-colors">{template.title}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="group-hover:bg-primary/10" asChild>
                        <Link href={template.href}>
                          Usar
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="pt-4 border-t mt-6"
                  >
                    <Button variant="outline" className="w-full border-dashed hover:border-primary hover:bg-primary/5 transition-all" asChild>
                      <Link href="/agente/criar">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Criar novo agente personalizado
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
