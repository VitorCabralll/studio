
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List, Grip, FileText, PlusCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const useCases = [
  { title: "Criar uma petição inicial", description: "Elabore uma petição inicial completa a partir de fatos e fundamentos.", icon: FileText, href: "/generate" },
  { title: "Analisar contrato", description: "Identifique cláusulas de risco e pontos de melhoria em segundos.", icon: FileText, href: "/generate" },
  { title: "Gerar notificação extrajudicial", description: "Crie notificações com base em modelos pré-definidos ou instruções.", icon: FileText, href: "/generate" },
  { title: "Resumir processo", description: "Obtenha um resumo dos principais pontos de um processo extenso.", icon: FileText, href: "/generate" },
];

const readyTemplates = [
  { title: "Contrato de Aluguel Residencial", href: "/generate" },
  { title: "Procuração Ad Judicia", href: "/generate" },
  { title: "Acordo de Confidencialidade (NDA)", href: "/generate" },
];

const customTemplates = [
  { title: "Modelo de Ação de Alimentos", href: "/generate" },
  { title: "Template para Recurso de Apelação Cível", href: "/generate" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Seja bem-vindo ao LexAI</h1>
        <p className="text-muted-foreground">Comece escolhendo um dos cenários abaixo ou um de seus modelos.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cenários de Uso</CardTitle>
          <CardDescription>Selecione um caso de uso para iniciar a geração de documentos com IA.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {useCases.map((useCase, index) => (
            <Card key={index} className="flex flex-col justify-between hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <useCase.icon className="w-8 h-8 text-primary" />
                  <CardTitle className="text-lg font-headline">{useCase.title}</CardTitle>
                </div>
                <CardDescription className="pt-2">{useCase.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={useCase.href}>
                    Iniciar <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Modelos Prontos</CardTitle>
              <CardDescription>Templates validados para acelerar seu trabalho.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon"><Grip className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><List className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {readyTemplates.map((template, index) => (
                <li key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                  <span className="font-medium">{template.title}</span>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={template.href}>Usar</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Modelos Personalizados</CardTitle>
              <CardDescription>Seus modelos e agentes de IA criados.</CardDescription>
            </div>
             <div className="flex items-center gap-2">
              <Button variant="outline" size="icon"><Grip className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><List className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {customTemplates.map((template, index) => (
                <li key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                  <span className="font-medium">{template.title}</span>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={template.href}>Usar</Link>
                  </Button>
                </li>
              ))}
               <li className="mt-4">
                <Button variant="outline" className="w-full border-dashed" asChild>
                  <Link href="/agente/criar">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Criar novo agente
                  </Link>
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
