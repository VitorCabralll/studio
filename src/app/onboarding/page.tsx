'use client';

import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, UserProfile } from '@/hooks/use-auth';
import { updateUserProfile } from '@/services/user-service';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Loader2, ArrowRight, Scale } from 'lucide-react';

// --- Constants ---
const roles = [
  'Advogado(a)',
  'Promotor(a) de Justiça',
  'Juiz(a)',
  'Procurador(a)',
  'Desembargador(a)',
  'Defensor(a) Público(a)',
  'Delegado(a)',
  'Escrivão(ã)',
  'Analista Jurídico',
  'Assessor(a) Jurídico(a)',
  'Estudante de Direito',
  'Outro'
];

const areas = [
  'Direito Penal', 'Direito Tributário', 'Direito Civil', 'Direito Ambiental',
  'Direito Constitucional', 'Direito Administrativo', 'Direito do Trabalho',
  'Direito Previdenciário', 'Direito Empresarial', 'Direito Imobiliário',
  'Direito Eleitoral', 'Direito do Consumidor', 'Direito Internacional',
  'Direito Digital', 'Direito Processual Civil', 'Direito Processual Penal',
  'Propriedade Intelectual'
];

const profileSchema = z.object({
  cargo: z.string({ required_error: 'Por favor, selecione um cargo.' }),
  areas_atuacao: z.array(z.string()).min(1, 'Selecione pelo menos uma área de atuação.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;


// --- Step Components ---

function WelcomeStep({ onNext }: { onNext: () => void }) {
    return (
        <div className="text-center">
            <Scale className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-3xl font-bold font-headline mb-4">Olá! Bem-vindo(a) ao LexAI</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">Sua assistente jurídica inteligente. Vamos configurar seu perfil para personalizar sua experiência?</p>
            <Button size="lg" onClick={onNext}>
                Começar agora <ArrowRight className="ml-2" />
            </Button>
        </div>
    );
}

function RoleStep({ form, onNext }: { form: UseFormReturn<ProfileFormValues>, onNext: () => void }) {
    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle className="font-headline">Como você atua no sistema de justiça?</CardTitle>
                <CardDescription>Esta informação nos ajuda a personalizar as ferramentas para você.</CardDescription>
            </CardHeader>
            <CardContent>
                <FormField
                    control={form.control}
                    name="cargo"
                    render={({ field }) => (
                        <FormItem>
                            <Select onValueChange={(value) => {
                                field.onChange(value);
                                onNext();
                            }} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione seu cargo ou função..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {roles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    );
}


function AreasStep({ form, isSubmitting }: { form: UseFormReturn<ProfileFormValues>, isSubmitting: boolean }) {
    return (
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <CardTitle className="font-headline">Quais são suas áreas de atuação?</CardTitle>
                <CardDescription>Selecione uma ou mais áreas para focarmos no que é mais importante para você.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
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
                                    {areas.map(area => (
                                        <ToggleGroupItem key={area} value={area} className="h-auto py-2 px-4">
                                            {area}
                                        </ToggleGroupItem>
                                    ))}
                                </ToggleGroup>
                            </FormControl>
                            <FormMessage className="text-center pt-2" />
                        </FormItem>
                    )}
                />
                <Button type="submit" size="lg" className="mt-8" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Finalizar Configuração
                </Button>
            </CardContent>
        </Card>
    );
}


// --- Main Onboarding Page Component ---

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const { user, userProfile, updateUserProfileState } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const profileData: UserProfile = {
        ...userProfile,
        ...data,
        primeiro_acesso: false,
        data_criacao: new Date(),
      };
      
      await updateUserProfile(user.uid, profileData);
      
      updateUserProfileState(profileData);
      
    } catch (error) {
      console.error("Failed to save profile", error);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      {step === 1 && <WelcomeStep onNext={() => setStep(2)} />}
      
      {step > 1 && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-4xl flex flex-col items-center">
            {step === 2 && <RoleStep form={form} onNext={() => setStep(3)} />}
            {step === 3 && <AreasStep form={form} isSubmitting={isSubmitting} />}
          </form>
        </Form>
      )}
    </div>
  );
}
