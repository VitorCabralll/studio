
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
import { Scale, User, Mail, Lock, ArrowRight, Shield, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const benefits = [
  { icon: CheckCircle, text: "Documentos jurídicos em minutos" },
  { icon: CheckCircle, text: "IA especializada em direito" },
  { icon: CheckCircle, text: "Templates validados por especialistas" },
];

export default function SignupPage() {
  const { signup } = useAuth();

  const handleSignup = (event: React.FormEvent) => {
    event.preventDefault();
    signup();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-200/20 dark:bg-grid-slate-700/20" />
      
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg mx-4"
      >
        <Card className="shadow-2xl border-primary/10">
          <CardHeader className="text-center space-y-6 pb-8">
            {/* Logo com animação */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
              className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-6"
            >
              <Scale className="w-8 h-8 text-white" />
            </motion.div>
            
            {/* Hero Text */}
            <div className="space-y-3">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold font-headline tracking-tight"
              >
                Junte-se ao LexAI
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground text-base"
              >
                Crie sua conta e transforme a forma como você trabalha com documentos jurídicos
              </motion.p>
            </div>
            
            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <benefit.icon className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{benefit.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </CardHeader>
        <CardContent className="space-y-6">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            onSubmit={handleSignup}
            className="space-y-5"
          >
            {/* Nome Field */}
            <div className="space-y-2">
              <Label htmlFor="full-name" className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                Nome Completo
              </Label>
              <Input 
                id="full-name" 
                placeholder="Como você gostaria de ser chamado?" 
                required 
                className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                Email Profissional
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                required
                className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                Senha Segura
              </Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Mínimo 8 caracteres" 
                required 
                className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Shield className="w-3 h-3" />
                Seus dados estão protegidos com criptografia de ponta
              </p>
            </div>
            
            {/* Terms */}
            <div className="text-xs text-muted-foreground leading-relaxed">
              Ao criar sua conta, você concorda com nossos{" "}
              <Link href="#" className="text-primary hover:underline">
                Termos de Uso
              </Link>
              {" "}e{" "}
              <Link href="#" className="text-primary hover:underline">
                Política de Privacidade
              </Link>
            </div>
            
            {/* Signup Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all"
              >
                Criar minha conta gratuita
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
            
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">ou continue com</span>
              </div>
            </div>
            
            {/* Google Signup */}
            <Button variant="outline" className="w-full h-12 hover:bg-accent transition-all" asChild>
              <Link href="#">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Cadastrar com Google
              </Link>
            </Button>
          </motion.form>
          
          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="pt-6 text-center text-sm border-t"
          >
            <span className="text-muted-foreground">Já tem uma conta? </span>
            <Link 
              href="/login" 
              className="text-primary hover:text-primary/80 transition-colors font-medium underline-offset-4 hover:underline"
            >
              Fazer login
            </Link>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}
