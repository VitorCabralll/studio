'use client';

import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, UserProfile } from '@/hooks/use-auth';
import { updateUserProfile } from '@/services/user-service';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Loader2, ArrowRight, Scale, CheckCircle, User, Briefcase, Target } from 'lucide-react';
import { roles, legalAreas } from '@/lib/legal-constants';
import { useFocusManagement } from '@/hooks/use-focus-management';
import { motion, AnimatePresence } from 'framer-motion';

const profileSchema = z.object({
  cargo: z.string({ required_error: 'Por favor, selecione um cargo.' }),
  areas_atuacao: z.array(z.string()).min(1, 'Selecione pelo menos uma área de atuação.'),
});

const stepVariants = {
  enter: { opacity: 0, x: 50 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
};

type ProfileFormValues = z.infer<typeof profileSchema>;


// --- Step Components ---

function WelcomeStep({ onNext }: { onNext: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl mx-auto"
        >
            {/* Logo animado */}
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center mb-8"
            >
                <Scale className="w-10 h-10 text-white" />
            </motion.div>
            
            {/* Hero text */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6 mb-12"
            >
                <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">
                    Olá! Bem-vindo(a) ao <span className="text-primary">LexAI</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Sua assistente jurídica inteligente está quase pronta. Vamos personalizar sua experiência em apenas 2 minutos?
                </p>
            </motion.div>
            
            {/* Features preview */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid md:grid-cols-3 gap-6 mb-12"
            >
                <div className="flex flex-col items-center space-y-3 p-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold">Perfil Personalizado</h3>
                    <p className="text-sm text-muted-foreground text-center">Conte-nos sobre sua atuação</p>
                </div>
                <div className="flex flex-col items-center space-y-3 p-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold">Áreas de Atuação</h3>
                    <p className="text-sm text-muted-foreground text-center">Selecione suas especialidades</p>
                </div>
                <div className="flex flex-col items-center space-y-3 p-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold">Experiência Otimizada</h3>
                    <p className="text-sm text-muted-foreground text-center">IA adaptada ao seu perfil</p>
                </div>
            </motion.div>
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Button size="lg" onClick={onNext} className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
                    Começar configuração <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </motion.div>
        </motion.div>
    );
}

function RoleStep({ form, onNext }: { form: UseFormReturn<ProfileFormValues>, onNext: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl"
        >
            <Card className="shadow-xl border-primary/10">
                <CardHeader className="text-center pb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mb-4"
                    >
                        <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </motion.div>
                    <CardTitle id="role-step-title" className="font-headline text-2xl" tabIndex={-1}>
                        Como você atua no sistema de justiça?
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                        Esta informação nos ajuda a personalizar as ferramentas e conteúdo específicos para sua função.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField
                        control={form.control}
                        name="cargo"
                        render={({ field }) => (
                            <FormItem>
                                <Select onValueChange={(value) => {
                                    field.onChange(value);
                                    setTimeout(() => onNext(), 500); // Pequeno delay para melhor UX
                                }} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-14 text-base">
                                            <SelectValue placeholder="Selecione seu cargo ou função..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {roles.map(role => (
                                            <SelectItem key={role} value={role} className="text-base py-3">
                                                {role}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800"
                    >
                        <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                            <CheckCircle className="w-4 h-4" />
                            <span className="font-medium text-sm">Por que precisamos desta informação?</span>
                        </div>
                        <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                            Com base no seu cargo, vamos sugerir templates, modelos de documentos e fluxos de trabalho mais relevantes para sua atuação.
                        </p>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
}


function AreasStep({ form, isSubmitting }: { form: UseFormReturn<ProfileFormValues>, isSubmitting: boolean }) {
    const selectedAreas = form.watch('areas_atuacao') || [];
    
    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl"
        >
            <Card className="shadow-xl border-primary/10">
                <CardHeader className="text-center pb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mb-4"
                    >
                        <Briefcase className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </motion.div>
                    <CardTitle id="areas-step-title" className="font-headline text-2xl" tabIndex={-1}>
                        Quais são suas áreas de atuação?
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                        Selecione uma ou mais áreas para personalizarmos os templates e sugestões de conteúdo.
                    </CardDescription>
                    
                    {selectedAreas.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800"
                        >
                            <p className="text-sm text-green-800 dark:text-green-200">
                                ✓ {selectedAreas.length} área{selectedAreas.length > 1 ? 's' : ''} selecionada{selectedAreas.length > 1 ? 's' : ''}
                            </p>
                        </motion.div>
                    )}
                </CardHeader>
                <CardContent className="space-y-8">
                    <FormField
                        control={form.control}
                        name="areas_atuacao"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <ToggleGroup
                                        type="multiple"
                                        variant="outline"
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        className="flex flex-wrap justify-center gap-3"
                                    >
                                        {legalAreas.map((area, index) => (
                                            <motion.div
                                                key={area}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 * index }}
                                            >
                                                <ToggleGroupItem 
                                                    value={area} 
                                                    className="h-auto py-3 px-4 text-sm font-medium transition-all hover:scale-105 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                                                >
                                                    {area}
                                                </ToggleGroupItem>
                                            </motion.div>
                                        ))}
                                    </ToggleGroup>
                                </FormControl>
                                <FormMessage className="text-center pt-2" />
                            </FormItem>
                        )}
                    />
                    
                    <motion.div
                        className="flex justify-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button 
                            type="submit" 
                            size="lg" 
                            className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary" 
                            disabled={isSubmitting || selectedAreas.length === 0}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Finalizando...
                                </>
                            ) : (
                                <>
                                    Finalizar Configuração
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
}


// --- Main Onboarding Page Component ---

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const { user, userProfile, updateUserProfileState } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { focusHeading, AnnouncementRegion } = useFocusManagement();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      cargo: undefined,
      areas_atuacao: [],
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    if (!user || !userProfile) return;
    setIsSubmitting(true);
    try {
      const profileData: Partial<UserProfile> = {
        ...data,
        primeiro_acesso: false,
        initial_setup_complete: false,
      };
      
      const result = await updateUserProfile(user.uid, profileData);
      if (result.success) {
        updateUserProfileState(profileData);
        router.push('/onboarding/success');
      } else {
        console.error("Erro ao salvar perfil:", result.error);
        // Aqui você poderia mostrar um toast de erro para o usuário
      }
      
    } catch (error) {
      console.error("Erro não tratado ao salvar perfil:", error);
    } finally {
        setIsSubmitting(false);
    }
  }

  const handleNextStep = (nextStep: number) => {
    setStep(nextStep);
    setTimeout(() => {
      if (nextStep === 2) {
        focusHeading('role-step-title', 'Avançado para seleção de cargo');
      } else if (nextStep === 3) {
        focusHeading('areas-step-title', 'Avançado para seleção de áreas de atuação');
      }
    }, 100);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-200/20 dark:bg-grid-slate-700/20" />
      
      <AnnouncementRegion />
      
      {/* Progress indicator */}
      {step > 1 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border rounded-full px-4 py-2 shadow-lg">
            <div className={`w-2 h-2 rounded-full transition-colors ${
              step >= 2 ? 'bg-primary' : 'bg-muted-foreground/30'
            }`} />
            <div className={`w-2 h-2 rounded-full transition-colors ${
              step >= 3 ? 'bg-primary' : 'bg-muted-foreground/30'
            }`} />
            <span className="text-xs text-muted-foreground ml-2">
              Etapa {step - 1} de 2
            </span>
          </div>
        </motion.div>
      )}
      
      <div className="relative z-10 w-full flex flex-col items-center">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <WelcomeStep key="welcome" onNext={() => handleNextStep(2)} />
          )}
          
          {step > 1 && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-4xl flex flex-col items-center">
                {step === 2 && (
                  <RoleStep key="role" form={form} onNext={() => handleNextStep(3)} />
                )}
                {step === 3 && (
                  <AreasStep key="areas" form={form} isSubmitting={isSubmitting} />
                )}
              </form>
            </Form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
