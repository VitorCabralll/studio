'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowRight, Scale, CheckCircle, User, Briefcase, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAuth, UserProfile } from '@/hooks/use-auth';
import { useFocusManagement } from '@/hooks/use-focus-management';
import { roles, legalAreas } from '@/lib/legal-constants';
import { updateUserProfile } from '@/services/user-service';


const profileSchema = z.object({
  cargo: z.string({ required_error: 'Por favor, selecione um cargo.' }),
  areas_atuacao: z.array(z.string()).min(1, 'Selecione pelo menos uma área de atuação.'),
});

// Animation variants for future use
// const stepVariants = {
//   enter: { opacity: 0, x: 50 },
//   center: { opacity: 1, x: 0 },
//   exit: { opacity: 0, x: -50 }
// };

type ProfileFormValues = z.infer<typeof profileSchema>;


// --- Step Components ---

function WelcomeStep({ onNext }: { onNext: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-3xl text-center"
        >
            {/* Logo animado */}
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                className="shadow-apple-lg mx-auto mb-12 flex size-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80"
            >
                <Scale className="size-10 text-white" />
            </motion.div>
            
            {/* Hero text */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-16 space-y-8"
            >
                <h1 className="text-display">
                    Olá! Bem-vindo(a) ao <span className="text-primary">LexAI</span>
                </h1>
                <p className="text-body-large mx-auto max-w-2xl leading-relaxed text-muted-foreground">
                    Sua assistente jurídica inteligente está quase pronta. Vamos personalizar sua experiência em apenas 2 minutos?
                </p>
            </motion.div>
            
            {/* Features preview */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-16 grid gap-8 md:grid-cols-3"
            >
                <motion.div 
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="surface-elevated shadow-apple-sm hover:shadow-apple-md flex flex-col items-center space-y-4 rounded-2xl border border-border/50 p-6"
                >
                    <div className="shadow-apple-sm flex size-16 items-center justify-center rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-50 to-indigo-100 dark:border-blue-800/50 dark:from-blue-950/50 dark:to-indigo-950/50">
                        <User className="size-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-headline font-semibold">Perfil Personalizado</h3>
                    <p className="text-caption text-center leading-relaxed">Conte-nos sobre sua atuação profissional</p>
                </motion.div>
                <motion.div 
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="surface-elevated shadow-apple-sm hover:shadow-apple-md flex flex-col items-center space-y-4 rounded-2xl border border-border/50 p-6"
                >
                    <div className="shadow-apple-sm flex size-16 items-center justify-center rounded-2xl border border-green-200/50 bg-gradient-to-br from-green-50 to-emerald-100 dark:border-green-800/50 dark:from-green-950/50 dark:to-emerald-950/50">
                        <Briefcase className="size-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-headline font-semibold">Áreas de Atuação</h3>
                    <p className="text-caption text-center leading-relaxed">Selecione suas áreas de especialidade</p>
                </motion.div>
                <motion.div 
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="surface-elevated shadow-apple-sm hover:shadow-apple-md flex flex-col items-center space-y-4 rounded-2xl border border-border/50 p-6"
                >
                    <div className="shadow-apple-sm flex size-16 items-center justify-center rounded-2xl border border-purple-200/50 bg-gradient-to-br from-purple-50 to-violet-100 dark:border-purple-800/50 dark:from-purple-950/50 dark:to-violet-950/50">
                        <Target className="size-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-headline font-semibold">Experiência Otimizada</h3>
                    <p className="text-caption text-center leading-relaxed">IA adaptada ao seu perfil único</p>
                </motion.div>
            </motion.div>
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
            >
                <Button 
                    size="lg" 
                    onClick={onNext} 
                    className="shadow-apple-lg hover:shadow-apple-lg h-16 bg-gradient-to-r from-primary to-primary/90 px-12 text-lg font-semibold transition-all duration-500 hover:scale-105 hover:from-primary/90 hover:to-primary/80"
                >
                    <Scale className="mr-3 size-5" />
                    Começar configuração 
                    <ArrowRight className="ml-3 size-5" />
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
            <Card className="border-primary/10 shadow-xl">
                <CardHeader className="pb-8 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900"
                    >
                        <User className="size-8 text-blue-600 dark:text-blue-400" />
                    </motion.div>
                    <CardTitle id="role-step-title" className="font-headline text-2xl" tabIndex={-1}>
                        Como você atua no sistema de justiça?
                    </CardTitle>
                    <CardDescription className="mt-2 text-base">
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
                                            <SelectItem key={role} value={role} className="py-3 text-base">
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
                        className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950"
                    >
                        <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                            <CheckCircle className="size-4" />
                            <span className="text-sm font-medium">Por que precisamos desta informação?</span>
                        </div>
                        <p className="mt-1 text-sm text-blue-600 dark:text-blue-300">
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
            <Card className="border-primary/10 shadow-xl">
                <CardHeader className="pb-8 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900"
                    >
                        <Briefcase className="size-8 text-green-600 dark:text-green-400" />
                    </motion.div>
                    <CardTitle id="areas-step-title" className="font-headline text-2xl" tabIndex={-1}>
                        Quais são suas áreas de atuação?
                    </CardTitle>
                    <CardDescription className="mt-2 text-base">
                        Selecione uma ou mais áreas para personalizarmos os templates e sugestões de conteúdo.
                    </CardDescription>
                    
                    {selectedAreas.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950"
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
                                                    className="h-auto px-4 py-3 text-sm font-medium transition-all hover:scale-105 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                                                >
                                                    {area}
                                                </ToggleGroupItem>
                                            </motion.div>
                                        ))}
                                    </ToggleGroup>
                                </FormControl>
                                <FormMessage className="pt-2 text-center" />
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
                            className="bg-gradient-to-r from-primary to-primary/90 px-8 py-6 text-lg hover:from-primary/90 hover:to-primary" 
                            disabled={isSubmitting || selectedAreas.length === 0}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 size-5 animate-spin" />
                                    Finalizando...
                                </>
                            ) : (
                                <>
                                    Finalizar Configuração
                                    <ArrowRight className="ml-2 size-5" />
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
    <div className="to-primary/3 flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background p-4">
      {/* Background Pattern */}
      <div className="bg-grid-slate-100/50 dark:bg-grid-slate-800/50 absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      <AnnouncementRegion />
      
      {/* Progress indicator */}
      {step > 1 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed left-1/2 top-8 z-50 -translate-x-1/2"
        >
          <div className="surface-elevated shadow-apple-lg flex items-center gap-4 rounded-full border-2 border-border/50 px-6 py-3 backdrop-blur-sm">
            <div className={`size-3 rounded-full transition-all duration-500 ${
              step >= 2 ? 'shadow-apple-sm bg-primary' : 'bg-muted-foreground/30'
            }`} />
            <div className={`size-3 rounded-full transition-all duration-500 ${
              step >= 3 ? 'shadow-apple-sm bg-primary' : 'bg-muted-foreground/30'
            }`} />
            <span className="text-caption ml-2 font-medium">
              Etapa {step - 1} de 2
            </span>
          </div>
        </motion.div>
      )}
      
      <div className="relative z-10 flex w-full flex-col items-center">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <WelcomeStep key="welcome" onNext={() => handleNextStep(2)} />
          )}
          
          {step > 1 && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full max-w-4xl flex-col items-center">
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
