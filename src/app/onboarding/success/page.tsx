'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Sparkles, Briefcase, Users, Scale, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';

export default function OnboardingSuccessPage() {
  const { userProfile } = useAuth();
  const router = useRouter();

  const handleContinue = () => {
    router.push('/workspace');
  };

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      {/* Background Pattern */}
      <div className="bg-grid-slate-200/20 dark:bg-grid-slate-700/20 pointer-events-none absolute inset-0" />
      
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl"
      >
        <Card className="border-green-200/50 text-center shadow-2xl dark:border-green-800/50">
          <CardHeader className="space-y-8 pb-8">
            {/* Success Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
              className="relative mx-auto flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600"
            >
              <CheckCircle2 className="size-10 text-white" />
              
              {/* Sparkles animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="absolute -right-2 -top-2"
              >
                <Sparkles className="size-6 text-green-400" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                className="absolute -bottom-2 -left-2"
              >
                <Sparkles className="size-4 text-green-300" />
              </motion.div>
            </motion.div>
            
            {/* Success Message */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-headline text-4xl font-bold text-green-600 dark:text-green-400"
              >
                🎉 Perfeito! Você está pronto!
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl font-semibold"
              >
                Vamos configurar seu ambiente LexAI para uma produtividade sem precedentes.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mx-auto max-w-lg text-lg leading-relaxed text-muted-foreground"
              >
                Agora vamos ao que realmente importa: <span className="font-semibold text-primary">transformar sua prática jurídica</span> com IA personalizada para {userProfile?.cargo || 'sua função'}.
              </motion.p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Action Cards */}
            <div className="grid gap-4 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="border-dashed p-4 transition-all duration-300 hover:border-solid hover:border-primary/50 hover:shadow-lg">
                  <div className="space-y-3">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                      <Users className="size-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold">Criar Workspace</h3>
                    <p className="text-sm text-muted-foreground">
                      Organize projetos e colabore com sua equipe
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/workspace">
                        Começar
                        <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-4 transition-all duration-300 hover:shadow-lg">
                  <div className="space-y-3">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
                      <Briefcase className="size-6 text-white" />
                    </div>
                    <h3 className="font-semibold">Criar Primeiro Agente</h3>
                    <p className="text-sm text-muted-foreground">
                      IA personalizada para sua área de atuação
                    </p>
                    <Button asChild className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
                      <Link href="/agente/criar">
                        Criar Agente
                        <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>
            
            {/* Security Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mb-4"
            >
              <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center gap-3">
                    <Shield className="size-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                      🔒 Seus dados estão protegidos com criptografia ponta-a-ponta e processamento local
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="border-t pt-6"
            >
              <Button 
                onClick={handleContinue}
                size="lg" 
                className="w-full bg-gradient-to-r from-primary via-primary to-primary/90 shadow-xl hover:shadow-2xl h-14 text-lg font-semibold transition-all duration-500 hover:scale-105"
              >
                <Scale className="mr-3 size-5" />
                Acessar meu Workspace
                <ArrowRight className="ml-3 size-5" />
              </Button>
              
              <p className="mt-4 text-sm text-muted-foreground text-center">
                💡 Dica: Você pode retornar às configurações a qualquer momento
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}