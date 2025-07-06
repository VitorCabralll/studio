import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ArrowLeft, User, Shield, Gavel, AlertTriangle, CreditCard, Globe } from 'lucide-react';

export default function TermsPage() {
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
                <FileText className="size-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Termos de Uso
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
                Estes termos regem o uso da plataforma LexAI. Ao usar nossos serviços, você concorda com estes termos.
              </p>
            </CardContent>
          </Card>

          {/* Aceitação dos Termos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5 text-blue-600" />
                1. Aceitação dos Termos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Ao acessar e usar a plataforma LexAI, você declara que:
              </p>
              
              <ul className="space-y-2 pl-6">
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <span className="mt-1 size-2 rounded-full bg-blue-600 flex-shrink-0"></span>
                  É um profissional do direito regularmente inscrito na OAB
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <span className="mt-1 size-2 rounded-full bg-blue-600 flex-shrink-0"></span>
                  Tem capacidade legal para celebrar contratos
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <span className="mt-1 size-2 rounded-full bg-blue-600 flex-shrink-0"></span>
                  Aceita integralmente estes termos e nossa política de privacidade
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <span className="mt-1 size-2 rounded-full bg-blue-600 flex-shrink-0"></span>
                  Usará a plataforma de acordo com a legislação vigente
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Descrição do Serviço */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="size-5 text-blue-600" />
                2. Descrição do Serviço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                A LexAI é uma plataforma de inteligência artificial que oferece:
              </p>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                  <h4 className="font-semibold text-green-800 dark:text-green-300">✅ Funcionalidades</h4>
                  <ul className="mt-2 space-y-1 text-sm text-green-700 dark:text-green-400">
                    <li>• Geração automatizada de documentos jurídicos</li>
                    <li>• Análise e revisão de contratos</li>
                    <li>• Assistência em pesquisas jurisprudenciais</li>
                    <li>• Criação de peças processuais</li>
                    <li>• Workspace colaborativo para equipes</li>
                  </ul>
                </div>
                
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300">⚖️ Limitações</h4>
                  <ul className="mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-400">
                    <li>• IA é uma ferramenta de apoio, não substitui o advogado</li>
                    <li>• Sempre revise e valide o conteúdo gerado</li>
                    <li>• Adeque às especificidades de cada caso</li>
                    <li>• Mantenha responsabilidade profissional</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Responsabilidades do Usuário */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="size-5 text-blue-600" />
                3. Responsabilidades do Usuário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    3.1. Uso Responsável
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Você se compromete a usar a plataforma apenas para fins legítimos e profissionais, 
                    respeitando os códigos de ética da advocacia.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    3.2. Confidencialidade
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Manter sigilo profissional sobre todas as informações processadas na plataforma, 
                    conforme determina o Estatuto da Advocacia.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    3.3. Revisão Obrigatória
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Todo conteúdo gerado pela IA deve ser revisado, validado e adequado pelo profissional 
                    antes de ser utilizado em qualquer contexto jurídico.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Propriedade Intelectual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5 text-blue-600" />
                4. Propriedade Intelectual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    🏢 Propriedade da LexAI
                  </h4>
                  <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li>• Plataforma e tecnologia</li>
                    <li>• Algoritmos de IA</li>
                    <li>• Interface e design</li>
                    <li>• Marca e logo</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    👤 Propriedade do Usuário
                  </h4>
                  <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li>• Documentos carregados</li>
                    <li>• Conteúdo criado com a IA</li>
                    <li>• Dados profissionais</li>
                    <li>• Informações de clientes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Limitações e Isenções */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="size-5 text-amber-600" />
                5. Limitações e Isenções
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                <h4 className="font-semibold text-amber-800 dark:text-amber-300">
                  ⚠️ Importante: Limitação de Responsabilidade
                </h4>
                <ul className="mt-2 space-y-1 text-sm text-amber-700 dark:text-amber-400">
                  <li>• A LexAI não se responsabiliza por decisões baseadas no conteúdo gerado pela IA</li>
                  <li>• Não garantimos precisão jurídica absoluta do conteúdo</li>
                  <li>• O usuário mantém total responsabilidade profissional</li>
                  <li>• Não assumimos responsabilidade por prejuízos decorrentes do uso inadequado</li>
                </ul>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                A responsabilidade da LexAI limita-se ao valor pago pelo serviço no período de 12 meses.
              </p>
            </CardContent>
          </Card>

          {/* Pagamento e Cancelamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="size-5 text-blue-600" />
                6. Pagamento e Cancelamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    💳 Pagamento
                  </h4>
                  <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li>• Cobrança mensal antecipada</li>
                    <li>• Cartão de crédito ou boleto</li>
                    <li>• Renovação automática</li>
                    <li>• Preços em reais (BRL)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    🚫 Cancelamento
                  </h4>
                  <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li>• Cancelamento a qualquer momento</li>
                    <li>• Sem multas ou taxas</li>
                    <li>• Acesso até o fim do período pago</li>
                    <li>• 7 dias para reembolso</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modificações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="size-5 text-blue-600" />
                7. Modificações dos Termos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                Alterações significativas serão comunicadas com antecedência mínima de 30 dias 
                por email e através da plataforma.
              </p>
              
              <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Continuidade do Uso:</strong> O uso continuado da plataforma após as modificações 
                  constitui aceitação dos novos termos.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Lei Aplicável */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="size-5 text-blue-600" />
                8. Lei Aplicável e Foro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">
                Estes termos são regidos pela legislação brasileira. Qualquer controvérsia será 
                resolvida no foro da comarca de <strong>São Paulo/SP</strong>, com exclusão de qualquer outro.
              </p>
              
              <div className="mt-4 space-y-2 text-sm">
                <p><strong>Legislação aplicável:</strong> Código Civil, Código de Defesa do Consumidor, Marco Civil da Internet, LGPD</p>
                <p><strong>Órgãos reguladores:</strong> OAB, PROCON, ANPD</p>
              </div>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="size-5 text-blue-600" />
                Contato e Suporte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">
                Para dúvidas sobre estes termos ou suporte técnico:
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-sm">
                  <strong>Email:</strong> legal@lexai.com.br
                </p>
                <p className="text-sm">
                  <strong>Suporte:</strong> suporte@lexai.com.br
                </p>
                <p className="text-sm">
                  <strong>Telefone:</strong> (11) 4000-0000
                </p>
                <p className="text-sm">
                  <strong>Horário:</strong> Segunda a sexta, 9h às 18h
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer da página */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Estes termos estão em conformidade com o Código de Ética e Disciplina da OAB, 
              Estatuto da Advocacia e demais normas aplicáveis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}