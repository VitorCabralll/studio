'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function OnboardingSuccessPage() {
  return (
    <div className="flex-1 p-4 md:p-8 flex items-center justify-center bg-background">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="flex flex-col items-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <CardTitle className="text-3xl font-bold text-green-600">
            Perfil concluído com sucesso!
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Pronto! Agora você pode criar um workspace ou começar direto criando seu primeiro agente.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/workspace">
              Criar Workspace
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700">
            <Link href="/agente/criar">
              Criar Agente
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}