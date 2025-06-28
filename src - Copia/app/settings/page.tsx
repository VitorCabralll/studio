'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { User, Palette, Building, AlertTriangle, Settings2, Save } from "lucide-react";
import { motion } from 'framer-motion';

export default function SettingsPage() {
  return (
    <div className="flex-1 p-4 md:p-8 bg-gradient-to-br from-background via-background to-primary/5 min-h-screen">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-200/20 dark:bg-grid-slate-700/20 pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 space-y-4"
        >
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
              className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center"
            >
              <Settings2 className="w-6 h-6 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold tracking-tight font-headline">Configurações</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Personalize sua experiência no LexAI e gerencie as configurações do seu workspace.
          </p>
        </motion.div>

        {/* Settings Cards */}
        <div className="space-y-8">
          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="shadow-lg border-primary/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="font-headline text-xl">Informações Pessoais</CardTitle>
                    <CardDescription>Gerencie seus dados pessoais e preferências de conta.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="full-name" className="text-sm font-medium flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      Nome Completo
                    </Label>
                    <Input 
                      id="full-name" 
                      defaultValue="Advogado Teste" 
                      className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      Email
                    </Label>
                    <Input 
                      id="email" 
                      type="email" 
                      defaultValue="advogado@lexai.com" 
                      disabled 
                      className="h-11 bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Para alterar seu email, entre em contato com o suporte
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6 flex justify-end">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Appearance Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="shadow-lg border-primary/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="font-headline text-xl">Aparência</CardTitle>
                    <CardDescription>Personalize o tema e a aparência da interface do LexAI.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Tema da Interface</Label>
                  <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <p className="text-sm text-muted-foreground">
                      Escolha entre modo claro, escuro ou automático baseado no sistema
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    🎨 Em breve: Personalização de cores, fontes e layout da interface
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Workspace Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="shadow-lg border-primary/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="font-headline text-xl">Workspace Atual</CardTitle>
                    <CardDescription>Configure e gerencie seu ambiente de trabalho.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="workspace-name" className="text-sm font-medium flex items-center gap-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    Nome do Workspace
                  </Label>
                  <Input 
                    id="workspace-name" 
                    defaultValue="Workspace Pessoal" 
                    className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="text-xs text-muted-foreground">
                    Este nome será visível para todos os membros do workspace
                  </p>
                </div>
                
                <Separator />
                
                {/* Danger Zone */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    <h4 className="font-semibold text-destructive">Zona de Perigo</h4>
                  </div>
                  <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-4">
                      A exclusão do workspace removerá permanentemente todos os dados, agentes e documentos associados. 
                      <strong className="text-destructive">Esta ação não pode ser desfeita.</strong>
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button variant="destructive" className="hover:bg-destructive/90">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Excluir Workspace Permanentemente
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
