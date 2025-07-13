/**
 * Premium Design System Showcase
 * Demonstra os refinamentos implementados para a filosofia "Apple"
 */

"use client"

import { ArrowRight, Shield, Zap, Sparkles, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AnimatedButton, AnimatedCard, FadeIn, SlideUp, StaggerContainer, StaggerItem } from "@/components/ui/motion"

export function PremiumShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/60 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Section */}
        <FadeIn className="text-center space-y-6">
          <h1 className="text-display bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
            LexAI Design System
          </h1>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            Demonstração dos refinamentos premium implementados para elevar a percepção de valor e qualidade.
          </p>
        </FadeIn>

        {/* Premium Buttons Section */}
        <SlideUp className="space-y-6">
          <h2 className="text-headline-large">Botões Premium</h2>
          <div className="flex flex-wrap gap-4 items-center">
            
            {/* Botão padrão */}
            <Button variant="default">
              Botão Padrão
            </Button>
            
            {/* Botão premium com gradiente e animações */}
            <Button variant="premium" className="group">
              <Sparkles className="w-4 h-4" />
              Botão Premium
              <ArrowRight className="w-4 h-4" />
            </Button>
            
            {/* Botão animado com Framer Motion */}
            <AnimatedButton variant="premium">
              <Zap className="w-4 h-4" />
              Animado Premium
              <ArrowRight className="w-4 h-4" />
            </AnimatedButton>
            
          </div>
        </SlideUp>

        {/* Premium Cards Section */}
        <SlideUp className="space-y-6" delay={0.2}>
          <h2 className="text-headline-large">Cards Premium</h2>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card padrão */}
            <StaggerItem>
              <Card className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-headline">Card Padrão</h3>
                </div>
                <p className="text-body text-muted-foreground">
                  Design básico com estilo padrão do shadcn/ui.
                </p>
              </Card>
            </StaggerItem>
            
            {/* Card premium */}
            <StaggerItem>
              <Card variant="premium" className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-headline">Card Premium</h3>
                </div>
                <p className="text-body text-muted-foreground">
                  Glass morphism com gradientes e hover elegante.
                </p>
              </Card>
            </StaggerItem>
            
            {/* Card animado */}
            <StaggerItem>
              <AnimatedCard variant="premium" className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-headline">Card Animado</h3>
                </div>
                <p className="text-body text-muted-foreground">
                  Premium + animações Framer Motion integradas.
                </p>
              </AnimatedCard>
            </StaggerItem>
            
          </StaggerContainer>
        </SlideUp>

        {/* Features Premium Section */}
        <SlideUp className="space-y-6" delay={0.4}>
          <h2 className="text-headline-large">Componentes de Confiança</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Segurança Percebida */}
            <AnimatedCard variant="elevated" className="p-8 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-headline">Segurança Máxima</h3>
                  <p className="text-caption text-muted-foreground">
                    Processamento 100% local
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>OCR processado localmente no seu dispositivo</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Criptografia ponta-a-ponta</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Compliance total com LGPD</span>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 font-medium">
                  🔒 Seus documentos nunca saem do seu computador
                </p>
              </div>
            </AnimatedCard>
            
            {/* Performance Premium */}
            <AnimatedCard variant="elevated" className="p-8 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-headline">IA Orquestrada</h3>
                  <p className="text-caption text-muted-foreground">
                    Múltiplos LLMs trabalhando em conjunto
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Velocidade de processamento</span>
                  <span className="text-sm font-semibold text-blue-600">3x mais rápido</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full w-3/4"></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Precisão jurídica</span>
                  <span className="text-sm font-semibold text-blue-600">98%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full w-[98%]"></div>
                </div>
              </div>
              
              <AnimatedButton variant="premium" className="w-full">
                <Sparkles className="w-4 h-4" />
                Experimentar Agora
                <ArrowRight className="w-4 h-4" />
              </AnimatedButton>
            </AnimatedCard>
            
          </div>
        </SlideUp>

        {/* Design System Info */}
        <SlideUp className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl p-8" delay={0.6}>
          <div className="text-center space-y-4">
            <h3 className="text-headline">Design System Premium</h3>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Implementação completa da filosofia &ldquo;Apple&rdquo; com microinterações elegantes, 
              componentes glass morphism, gradientes profissionais e animações Framer Motion.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                Aesthetic-Usability Effect
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                Premium Microinteractions
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Glass Morphism
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                Framer Motion
              </span>
            </div>
          </div>
        </SlideUp>

      </div>
    </div>
  )
}