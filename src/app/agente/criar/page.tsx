
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/file-upload";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { updateUserProfile } from '@/services/user-service';

const materiasDireito = [
  'Direito Penal', 'Direito Tributário', 'Direito Civil', 'Direito Ambiental',
  'Direito Constitucional', 'Direito Administrativo', 'Direito do Trabalho',
  'Direito Previdenciário', 'Direito Empresarial', 'Direito Imobiliário',
  'Direito Eleitoral', 'Direito do Consumidor', 'Direito Internacional',
  'Direito Digital', 'Direito Processual Civil', 'Direito Processual Penal',
  'Propriedade Intelectual'
];

export default function CreateAgentPage() {
  const router = useRouter();
  const { user, updateUserProfileState } = useAuth();
  const [agentName, setAgentName] = useState('');
  const [materia, setMateria] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const canSubmit = agentName.trim() !== '' && materia !== '';

  const handleCreateAgent = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || !user) return;

    setIsCreating(true);
    try {
      // Simulate agent creation
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update user profile to mark the end of the initial setup flow
      const newWorkspace = { name: "Workspace Pessoal" };
      await updateUserProfile(user.uid, { workspaces: [newWorkspace] });
      updateUserProfileState({ workspaces: [newWorkspace] });
      
      console.log("Agente criado com sucesso!", { agentName, materia, files: files.map(f => f.name) });
      router.push('/'); // Redirect to dashboard
    } catch (error) {
      console.error("Failed to create agent or update profile", error);
      // You could show a toast message here
      setIsCreating(false);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <form onSubmit={handleCreateAgent}>
          <CardHeader>
            <CardTitle className="font-headline">Criar Novo Agente de IA</CardTitle>
            <CardDescription>Crie um agente personalizado para tarefas específicas, treinando-o com seus próprios documentos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="agent-name">Nome do Agente</Label>
              <Input 
                id="agent-name" 
                placeholder="Ex: Agente de Análise de Contratos de Locação" 
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="materia-direito">Matéria do Direito</Label>
               <Select required value={materia} onValueChange={setMateria}>
                  <SelectTrigger id="materia-direito">
                    <SelectValue placeholder="Selecione a matéria..." />
                  </SelectTrigger>
                  <SelectContent>
                    {materiasDireito.map(item => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
              <Label>Modelo de Treinamento (.docx)</Label>
              <FileUpload onFilesChange={setFiles} />
              <p className="text-xs text-muted-foreground">
                Esse modelo será processado localmente, sem ser armazenado.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" asChild>
                  <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Painel</Link>
              </Button>
              <Button type="submit" disabled={!canSubmit || isCreating} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700">
                  {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Criar Agente
              </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
