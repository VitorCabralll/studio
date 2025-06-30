"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Scale } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/magic-ui";
import { useAuth } from '@/hooks/use-auth';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginWithGoogle, loading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    await login(email, password);
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };

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

          <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-900/80">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Bem-vindo de volta
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Entre em sua conta para continuar
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                  <button 
                    onClick={clearError}
                    className="ml-2 text-red-800 hover:text-red-600 dark:text-red-300 dark:hover:text-red-200"
                  >
                    ×
                  </button>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-gray-200 bg-white/50 pl-10 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800/50 dark:focus:border-blue-400"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-gray-200 bg-white/50 px-10 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800/50 dark:focus:border-blue-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <Link 
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-medium text-white shadow-lg hover:from-blue-700 hover:to-purple-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Entrando...</span>
                      </div>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500 dark:bg-gray-900">ou</span>
                </div>
              </div>

              {/* Google Login */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="w-full border-gray-200 bg-white/50 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <svg className="mr-2 size-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continuar com Google
                </Button>
              </motion.div>

              {/* Sign Up Link */}
              <div className="text-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Não tem uma conta?{" "}
                  <Link 
                    href="/signup" 
                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Cadastre-se
                  </Link>
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </FadeIn>
    </div>
  );
}