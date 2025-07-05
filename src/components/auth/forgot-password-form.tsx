"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Scale, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FadeIn } from "@/components/magic-ui";
import { useAuth } from '@/hooks/use-auth';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Por favor, insira seu email");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await resetPassword(email);
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Erro ao enviar email de recuperação:", err);
      
      // Tratar diferentes tipos de erro
      if (err.code === 'auth/user-not-found') {
        setError("Email não encontrado. Verifique se o email está correto.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Email inválido. Por favor, insira um email válido.");
      } else if (err.code === 'auth/too-many-requests') {
        setError("Muitas tentativas. Tente novamente em alguns minutos.");
      } else {
        setError("Erro ao enviar email de recuperação. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <FadeIn className="w-full max-w-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Logo */}
            <div className="mb-8 text-center">
              <Link href="/" className="group inline-flex items-center space-x-2">
                <motion.div 
                  className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-emerald-600"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <CheckCircle className="size-7 text-white" />
                </motion.div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                  LexAI
                </span>
              </Link>
            </div>

            <Card className="border-0 shadow-2xl">
              <CardHeader className="space-y-4 text-center pb-6">
                <CardTitle className="text-2xl font-bold">Email Enviado!</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Enviamos as instruções de recuperação para <strong>{email}</strong>. 
                  Verifique sua caixa de entrada e spam.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <Mail className="h-4 w-4" />
                  <AlertDescription>
                    Se não receber o email em alguns minutos, verifique sua pasta de spam ou tente novamente.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-3">
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/login">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Voltar ao Login
                    </Link>
                  </Button>
                  
                  <Button 
                    onClick={() => setIsSuccess(false)}
                    className="w-full" 
                    variant="ghost"
                  >
                    Tentar Outro Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <FadeIn className="w-full max-w-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="mb-8 text-center">
            <Link href="/" className="group inline-flex items-center space-x-2">
              <motion.div 
                className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Scale className="size-7 text-white" />
              </motion.div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                LexAI
              </span>
            </Link>
          </div>

          <Card className="border-0 shadow-2xl">
            <CardHeader className="space-y-4 text-center pb-6">
              <CardTitle className="text-2xl font-bold">Esqueci a Senha</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Digite seu email para receber as instruções de recuperação de senha
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      className="pl-10 h-12 text-base"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? "Enviando..." : "Enviar Email de Recuperação"}
                  </Button>

                  <Button asChild className="w-full" variant="outline">
                    <Link href="/login">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Voltar ao Login
                    </Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Não tem uma conta?{" "}
              <Link 
                href="/signup" 
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Criar conta gratuita
              </Link>
            </p>
          </div>
        </motion.div>
      </FadeIn>
    </div>
  );
}