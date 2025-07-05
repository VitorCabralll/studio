'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Server, CheckCircle, ArrowRight, Download, Globe } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const securityFeatures = [
  {
    icon: Lock,
    title: 'Seus Dados São Protegidos',
    description: 'Usamos as mesmas medidas de segurança dos bancos para proteger suas informações.',
    status: 'Ativo',
    color: 'green'
  },
  {
    icon: Server,
    title: 'Processamento Local',
    description: 'Seus documentos são processados no seu próprio computador. Não enviamos arquivos para servidores externos.',
    status: 'Ativo', 
    color: 'green'
  },
  {
    icon: Eye,
    title: 'Não Guardamos Seus Documentos',
    description: 'Não fazemos cópias nem armazenamos seus documentos. Após o processamento, tudo é descartado.',
    status: 'Garantido',
    color: 'green'
  },
  {
    icon: Globe,
    title: 'Seguimos a LGPD',
    description: 'Cumprimos todas as exigências da Lei Geral de Proteção de Dados brasileira.',
    status: 'Conforme',
    color: 'blue'
  }
];

const architectureSteps = [
  {
    step: '1',
    title: 'Você Carrega o Documento',
    description: 'O arquivo fica apenas no seu computador durante todo o processo',
    icon: Shield
  },
  {
    step: '2', 
    title: 'Extraímos o Texto',
    description: 'Lemos apenas o texto do documento, sem salvar o arquivo original',
    icon: Server
  },
  {
    step: '3',
    title: 'Processamos o Conteúdo',
    description: 'Enviamos apenas o texto (sem dados pessoais) para gerar o documento',
    icon: Lock
  },
  {
    step: '4',
    title: 'Apagamos Tudo',
    description: 'Após criar seu documento, descartamos todas as informações temporárias',
    icon: CheckCircle
  }
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12">
      <div className="mx-auto max-w-6xl px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
            className="shadow-apple-lg mx-auto mb-8 flex size-24 items-center justify-center rounded-3xl bg-gradient-to-br from-green-500 via-green-600 to-emerald-600"
          >
            <Shield className="size-12 text-white" />
          </motion.div>
          <h1 className="text-display mb-6">Segurança e Privacidade</h1>
          <p className="text-body-large mx-auto max-w-3xl leading-relaxed text-muted-foreground">
            Seus documentos jurídicos são processados com foco na proteção de dados. 
            <span className="font-semibold text-primary">Transparência e compliance</span>.
          </p>
        </motion.div>

        {/* Security Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid gap-8 md:grid-cols-2 mb-16"
        >
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Card className="surface-elevated shadow-apple-lg hover:shadow-apple-lg h-full border-2 border-border/50 transition-all duration-500 hover:border-green-300/50">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`shadow-apple-sm flex size-14 items-center justify-center rounded-2xl ${
                      feature.color === 'green' 
                        ? 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900' 
                        : 'bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900'
                    }`}>
                      <feature.icon className={`size-7 ${
                        feature.color === 'green' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-blue-600 dark:text-blue-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-headline text-xl">{feature.title}</CardTitle>
                      <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                        feature.color === 'green' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      }`}>
                        <CheckCircle className="size-3" />
                        {feature.status}
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Architecture Flow */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-display mb-4">Como Protegemos Seus Dados</h2>
            <p className="text-body-large mx-auto max-w-2xl text-muted-foreground">
              Arquitetura projetada para <span className="font-semibold text-green-600">minimizar riscos</span> e proteger seus dados
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {architectureSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1 + index * 0.15, duration: 0.6 }}
                className="relative text-center"
              >
                {/* Connection Line */}
                {index < architectureSteps.length - 1 && (
                  <div className="absolute left-1/2 top-16 hidden h-0.5 w-full bg-gradient-to-r from-primary to-primary/30 lg:block transform translate-x-8 z-0" />
                )}
                
                <Card className="surface-elevated shadow-apple-md hover:shadow-apple-lg relative z-10 border-2 border-border/50 transition-all duration-500 hover:border-primary/30 hover:scale-105">
                  <CardContent className="pt-8 pb-6">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
                      <step.icon className="size-8 text-primary" />
                    </div>
                    <div className="mx-auto mb-3 flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {step.step}
                    </div>
                    <h3 className="text-headline mb-3">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Compliance Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mb-16"
        >
          <Card className="surface-elevated shadow-apple-lg border-2 border-green-200/50 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:border-green-800/50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardContent className="p-12 text-center">
              <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600">
                <CheckCircle className="size-10 text-white" />
              </div>
              <h2 className="text-headline mb-4 text-2xl">Conformidade Total LGPD</h2>
              <p className="text-body-large mx-auto mb-8 max-w-2xl leading-relaxed text-muted-foreground">
                Auditoria completa por especialistas em proteção de dados. Certificação ISO 27001 em andamento.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  variant="outline" 
                  className="hover:shadow-apple-sm border-green-200 bg-white/80 text-green-700 hover:bg-green-50 dark:border-green-800 dark:bg-green-950/50 dark:text-green-300"
                >
                  <Download className="mr-2 size-4" />
                  Download Relatório de Segurança
                </Button>
                <Button 
                  variant="outline"
                  className="hover:shadow-apple-sm border-green-200 bg-white/80 text-green-700 hover:bg-green-50 dark:border-green-800 dark:bg-green-950/50 dark:text-green-300"
                >
                  <Eye className="mr-2 size-4" />
                  Ver Política de Privacidade
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="text-center"
        >
          <div className="mx-auto max-w-2xl space-y-6">
            <h2 className="text-headline">Pronto para experimentar?</h2>
            <p className="text-body-large text-muted-foreground">
              Comece a usar o LexAI hoje mesmo com a <span className="font-semibold text-primary">tranquilidade total</span> sobre a segurança dos seus dados.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg" 
                className="shadow-apple-lg hover:shadow-apple-lg h-14 bg-gradient-to-r from-primary to-primary/90 px-8 text-lg font-semibold transition-all duration-500 hover:scale-105 hover:from-primary/90 hover:to-primary/80"
              >
                <Link href="/generate">
                  <Shield className="mr-3 size-5" />
                  Gerar Documento Seguro
                  <ArrowRight className="ml-3 size-5" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="hover:shadow-apple-sm h-14 px-8 text-lg font-semibold transition-all duration-300"
              >
                <Link href="/workspace">
                  Criar Workspace
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}