"use client";

import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function LegalDisclaimer() {
  return (
    <Alert variant="warning" className="bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-700">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <strong>Importante:</strong> A LexAI é uma plataforma de tecnologia que oferece ferramentas de automação e produtividade. 
        Não prestamos serviços jurídicos ou consultoria legal. Todo conteúdo gerado deve ser revisado por um profissional habilitado. 
        A responsabilidade pelo uso e validação dos documentos é exclusivamente do usuário.
      </AlertDescription>
    </Alert>
  );
}