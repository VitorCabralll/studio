
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from 'next/link';

export default function WorkspaceSuccessPage() {
  return (
    <div className="flex-1 p-4 md:p-8 flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg text-center p-4">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl font-headline">Seu ambiente de trabalho foi criado com sucesso!</CardTitle>
          <CardDescription className="pt-2 text-base max-w-md mx-auto">
            Agora vamos criar seu primeiro agente inteligente. Ele será responsável por gerar documentos com IA, baseando-se em seus modelos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild size="lg" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700">
            <Link href="/agente/criar">
              Criar meu primeiro agente
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
