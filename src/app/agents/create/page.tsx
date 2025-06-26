import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/file-upload";
import { ArrowLeft } from "lucide-react";
import Link from 'next/link';

export default function CreateAgentPage() {
  return (
    <div className="flex-1 p-4 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="font-headline">Criar Novo Agente de IA</CardTitle>
          <CardDescription>Crie um agente personalizado para tarefas específicas, treinando-o com seus próprios documentos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="agent-name">Nome do Agente</Label>
            <Input id="agent-name" placeholder="Ex: Agente de Análise de Contratos de Locação" />
          </div>
          <div className="space-y-2">
            <Label>Documento de Treinamento (.docx)</Label>
            <FileUpload onFilesChange={() => {}} />
            <p className="text-xs text-muted-foreground">
              Forneça um documento .docx com exemplos, instruções ou o conhecimento base para o seu agente.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
                <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Cancelar</Link>
            </Button>
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700">
                Criar Agente
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
