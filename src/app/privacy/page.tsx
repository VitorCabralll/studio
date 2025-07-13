import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ArrowLeft, Eye, Database, Lock, Users, Globe } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ArrowLeft className="size-4" />
              Voltar ao início
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-600">
                <Shield className="size-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Política de Privacidade
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-8">
          
          {/* Última atualização */}
          <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/20">
            <CardContent className="p-6">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
              </p>
              <p className="mt-2 text-blue-600 dark:text-blue-400">
                Esta política descreve como a LexAI coleta, usa e protege suas informações pessoais.
              </p>
            </CardContent>
          </Card>

          {/* Resumo Executivo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="size-5 text-blue-600" />
                Resumo Executivo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                A LexAI é uma plataforma de inteligência artificial para profissionais do direito. 
                Respeitamos sua privacidade e implementamos as melhores práticas de segurança para proteger seus dados.
              </p>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                  <h4 className="font-semibold text-green-800 dark:text-green-300">✅ O que fazemos</h4>
                  <ul className="mt-2 space-y-1 text-sm text-green-700 dark:text-green-400">
                    <li>• Coletamos apenas dados necessários</li>
                    <li>• Protegemos com criptografia</li>
                    <li>• Você controla seus dados</li>
                    <li>• Transparência total</li>
                  </ul>
                </div>
                
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                  <h4 className="font-semibold text-red-800 dark:text-red-300">❌ O que NÃO fazemos</h4>
                  <ul className="mt-2 space-y-1 text-sm text-red-700 dark:text-red-400">
                    <li>• Vendemos seus dados</li>
                    <li>• Compartilhamos sem permissão</li>
                    <li>• Acessamos documentos privados</li>
                    <li>• Usamos para outros fins</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coleta de Dados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="size-5 text-blue-600" />
                Dados que Coletamos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    1. Informações de Conta
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Nome, email, OAB, cargo, áreas de atuação e informações profissionais fornecidas no cadastro.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    2. Documentos e Conteúdo
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Documentos que você carrega para processamento de IA, sempre com seu consentimento explícito.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    3. Dados de Uso
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Informações sobre como você usa a plataforma para melhorar nossos serviços.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Segurança */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="size-5 text-blue-600" />
                Segurança e Proteção
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    🔐 Criptografia
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Todos os dados são criptografados em trânsito e em repouso usando padrões de segurança bancária.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    🏠 Isolamento
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Seus dados são completamente isolados. Nenhum usuário pode acessar dados de outros.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    🔍 Auditoria
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Monitoramos continuamente o acesso aos dados e mantemos logs de auditoria.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    🗑️ Exclusão
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Você pode excluir seus dados a qualquer momento. Exclusão permanente garantida.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seus Direitos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-5 text-blue-600" />
                Seus Direitos (LGPD)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <strong className="text-blue-600">Acesso:</strong>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Visualizar todos os seus dados coletados
                    </p>
                  </div>
                  
                  <div>
                    <strong className="text-blue-600">Correção:</strong>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Corrigir informações incorretas
                    </p>
                  </div>
                  
                  <div>
                    <strong className="text-blue-600">Exclusão:</strong>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Excluir permanentemente seus dados
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <strong className="text-blue-600">Portabilidade:</strong>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Exportar seus dados em formato padrão
                    </p>
                  </div>
                  
                  <div>
                    <strong className="text-blue-600">Oposição:</strong>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Opor-se ao processamento de dados
                    </p>
                  </div>
                  
                  <div>
                    <strong className="text-blue-600">Revogação:</strong>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Revogar consentimento a qualquer momento
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="size-5 text-blue-600" />
                Contato e Dúvidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">
                Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato:
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-sm">
                  <strong>Email:</strong> privacy@lexai.com.br
                </p>
                <p className="text-sm">
                  <strong>DPO (Encarregado):</strong> dpo@lexai.com.br
                </p>
                <p className="text-sm">
                  <strong>Prazo de resposta:</strong> Até 15 dias úteis
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer da página */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Esta política está em conformidade com a Lei Geral de Proteção de Dados (LGPD) e 
              regulamentos internacionais de privacidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}