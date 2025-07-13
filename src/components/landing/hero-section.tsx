"use client";

import { ArrowRight, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { 
  FadeIn, 
  SlideUp, 
  BlobAnimation, 
  TextAnimate, 
  AnimatedButton, 
  StaggerContainer,
  StaggerItem 
} from "@/components/magic-ui";

export function HeroSection() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/signup');
  };

  const handleDemo = () => {
    // Scroll para a seção de features ou demos
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/60 dark:from-slate-900 dark:via-blue-950/30 dark:to-indigo-950/40">
      {/* Elegant Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <BlobAnimation className="absolute -right-32 -top-40 size-96 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-500/20 blur-3xl" />
        <BlobAnimation className="absolute -bottom-40 -left-32 size-96 rounded-full bg-gradient-to-br from-indigo-400/15 to-purple-500/15 blur-3xl" delay={2} />
        <BlobAnimation className="absolute left-40 top-40 size-80 rounded-full bg-gradient-to-br from-cyan-300/10 to-blue-400/15 blur-3xl" delay={4} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">

        <div className="space-y-8">
          <TextAnimate 
            className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text font-bold text-transparent dark:from-slate-100 dark:via-blue-200 dark:to-indigo-200 text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight tracking-tight"
            delay={0.3}
          >
            Automatize Documentos Jurídicos com IA
          </TextAnimate>

          <SlideUp delay={0.4} className="mx-auto max-w-4xl">
            <p className="text-lg md:text-xl lg:text-2xl font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
              Para advogados, promotores, defensores e todos os operadores do direito. 
              Nossa IA especializada transforma suas ideias em documentos precisos 
              e profissionais em minutos.
            </p>
          </SlideUp>

          <SlideUp delay={0.5} className="flex flex-col items-center justify-center gap-6 sm:flex-row pt-4">
            <AnimatedButton 
              onClick={handleGetStarted}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 focus-ring text-lg px-8 py-4 h-auto" 
              size="lg"
            >
              <span className="relative z-10 flex items-center">
                Começar Gratuitamente
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </AnimatedButton>
            
            <AnimatedButton 
              onClick={handleDemo}
              variant="outline" 
              size="lg" 
              className="group border-2 border-slate-200 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:border-slate-300 shadow-lg hover:shadow-xl transition-all duration-300 focus-ring dark:border-slate-700 dark:bg-slate-800/80 dark:hover:bg-slate-800/90 text-lg px-8 py-4 h-auto"
            >
              <Zap className="mr-2 size-4 text-amber-500 group-hover:text-amber-600 transition-colors" />
              <span className="text-slate-700 dark:text-slate-200">Ver Demo</span>
            </AnimatedButton>
          </SlideUp>

          <FadeIn delay={0.6}>
            <StaggerContainer className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm md:text-base font-medium text-slate-500 dark:text-slate-400">
              <StaggerItem className="flex items-center">
                <div className="mr-3 size-3 rounded-full bg-emerald-500 shadow-sm"></div>
                Teste gratuito
              </StaggerItem>
              <StaggerItem className="flex items-center">
                <div className="mr-3 size-3 rounded-full bg-blue-500 shadow-sm"></div>
                Setup em 2 minutos
              </StaggerItem>
              <StaggerItem className="flex items-center">
                <div className="mr-3 size-3 rounded-full bg-purple-500 shadow-sm"></div>
                Suporte especializado
              </StaggerItem>
            </StaggerContainer>
          </FadeIn>
        </div>

        <SlideUp delay={0.7} className="mt-20">
          <div className="relative max-w-5xl mx-auto">
            {/* Simplified Card Esquerda - Petição */}
            <div className="absolute left-8 top-8 h-36 w-52 rounded-xl border border-white/20 bg-white/80 backdrop-blur-md p-5 shadow-2xl dark:border-slate-700/50 dark:bg-slate-800/80 transform -rotate-3 hover:-rotate-1 hover:scale-102 transition-transform duration-300">
              <div className="mb-3 size-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 shadow-sm"></div>
              <div className="space-y-2.5">
                <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700"></div>
                <div className="h-2 w-1/2 rounded-full bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700"></div>
                <div className="h-2 w-5/6 rounded-full bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700"></div>
              </div>
              <div className="absolute bottom-3 right-3 text-xs font-medium text-slate-500 dark:text-slate-400">Petição</div>
            </div>

            {/* Simplified Card Direita - Contrato */}
            <div className="absolute right-8 top-8 h-36 w-52 rounded-xl border border-white/20 bg-white/80 backdrop-blur-md p-5 shadow-2xl dark:border-slate-700/50 dark:bg-slate-800/80 transform rotate-3 hover:rotate-1 hover:scale-102 transition-transform duration-300">
              <div className="mb-3 size-3 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 shadow-sm"></div>
              <div className="space-y-2.5">
                <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700"></div>
                <div className="h-2 w-4/5 rounded-full bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700"></div>
                <div className="h-2 w-1/2 rounded-full bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700"></div>
              </div>
              <div className="absolute bottom-3 right-3 text-xs font-medium text-slate-500 dark:text-slate-400">Contrato</div>
            </div>

            {/* Simplified Card Central - Dashboard */}
            <div className="mx-auto h-44 w-80 rounded-xl border border-white/20 bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-lg p-6 shadow-2xl dark:border-slate-700/50 dark:from-slate-800/90 dark:to-slate-900/80 hover:-translate-y-3 hover:scale-105 transition-transform duration-300">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent dark:from-slate-200 dark:to-slate-100">LexAI Dashboard</span>
                <div className="size-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 shadow-sm animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-400">Documentos gerados hoje</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-400">Tempo médio</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">2.3 min</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200/50 dark:bg-slate-700/50 overflow-hidden">
                  <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </SlideUp>
      </div>
    </section>
  );
}