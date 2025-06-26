
'use client';

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import { Scale } from 'lucide-react'

export default function SignupPage() {
  const { signup } = useAuth();

  const handleSignup = (event: React.FormEvent) => {
    event.preventDefault();
    signup();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="text-center">
            <Scale className="w-12 h-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl font-headline">Criar Conta</CardTitle>
            <CardDescription>
                Crie sua conta para começar a usar o LexAI
            </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full-name">Nome Completo</Label>
                <Input id="full-name" placeholder="Seu nome" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Criar conta
              </Button>
              <Button variant="outline" className="w-full" asChild>
                  <Link href="#">
                      Cadastrar com Google
                  </Link>
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{" "}
            <Link href="/login" className="underline">
              Fazer login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
