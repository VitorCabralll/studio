
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

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="text-center">
            <Scale className="w-12 h-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl font-headline">Login</CardTitle>
            <CardDescription>
                Entre com seu email e senha para acessar a plataforma
            </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                defaultValue="test@lexai.com"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Senha</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline">
                  Esqueceu sua senha?
                </Link>
              </div>
              <Input id="password" type="password" required defaultValue="password" />
            </div>
            <Button type="button" className="w-full" onClick={login}>
              Login
            </Button>
            <Button variant="outline" className="w-full" asChild>
                <Link href="#">
                    Login com Google
                </Link>
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{" "}
            <Link href="/signup" className="underline">
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
