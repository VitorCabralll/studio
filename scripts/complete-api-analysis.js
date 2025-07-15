#!/usr/bin/env node

/**
 * Análise Completa de TODAS as APIs Ativas - LexAI
 * Baseado na lista real do Google Cloud Console
 */

console.log('🔍 ANÁLISE COMPLETA DE TODAS AS APIs ATIVAS - LEXAI\n');

// APIs com atividade (requests e erros reais do console)
const activeAPIs = [
  {
    name: 'Firebase App Hosting API',
    requests: 1125,
    errors: 0,
    quota: 268,
    other: 499,
    category: 'Firebase Core',
    critical: true,
    configured: true,
    documented: true,
    purpose: 'Hospedagem da aplicação web',
    cost_impact: 'Alto',
    status: 'Funcionando perfeitamente'
  },
  {
    name: 'Cloud Logging API',
    requests: 812,
    errors: 0,
    quota: 90,
    other: 130,
    category: 'Monitoring',
    critical: false,
    configured: true,
    documented: false,
    purpose: 'Logs do sistema e debugging',
    cost_impact: 'Médio',
    status: 'Funcionando - não documentado'
  },
  {
    name: 'Cloud Build API',
    requests: 494,
    errors: 0,
    quota: 27,
    other: 64,
    category: 'CI/CD',
    critical: false,
    configured: true,
    documented: false,
    purpose: 'Build automático da aplicação',
    cost_impact: 'Médio',
    status: 'Funcionando - configuração no firebase.json'
  },
  {
    name: 'Secret Manager API',
    requests: 285,
    errors: 0,
    quota: 47,
    other: 65,
    category: 'Security',
    critical: false,
    configured: true,
    documented: false,
    purpose: 'Gerenciamento de secrets/credenciais',
    cost_impact: 'Baixo',
    status: 'Usando para env vars seguras'
  },
  {
    name: 'Cloud Run Admin API',
    requests: 157,
    errors: 0,
    quota: 58,
    other: 217,
    category: 'Compute',
    critical: false,
    configured: false,
    documented: false,
    purpose: 'Containers serverless (não usado ativamente)',
    cost_impact: 'Baixo',
    status: 'Habilitado mas não necessário'
  },
  {
    name: 'Cloud Firestore API',
    requests: 130,
    errors: 0,
    quota: 66,
    other: 561,
    category: 'Database',
    critical: true,
    configured: true,
    documented: true,
    purpose: 'Banco de dados principal',
    cost_impact: 'Alto',
    status: 'Funcionando perfeitamente'
  },
  {
    name: 'Identity Toolkit API',
    requests: 104,
    errors: 27,
    quota: 49,
    other: 433,
    category: 'Authentication',
    critical: true,
    configured: true,
    documented: true,
    purpose: 'Firebase Authentication',
    cost_impact: 'Médio',
    status: 'PROBLEMA: 26% erro rate (App Check)'
  },
  {
    name: 'Artifact Registry API',
    requests: 77,
    errors: 0,
    quota: 84,
    other: 137,
    category: 'Storage',
    critical: false,
    configured: false,
    documented: false,
    purpose: 'Registry de containers/artefatos',
    cost_impact: 'Baixo',
    status: 'Usado pelo Cloud Build'
  },
  {
    name: 'Cloud Functions API',
    requests: 75,
    errors: 0,
    quota: 468,
    other: 980,
    category: 'Compute',
    critical: true,
    configured: true,
    documented: true,
    purpose: 'Funções serverless',
    cost_impact: 'Médio',
    status: 'Funcionando - functions/ directory'
  },
  {
    name: 'Cloud Pub/Sub API',
    requests: 45,
    errors: 100,
    quota: 48,
    other: 63,
    category: 'Messaging',
    critical: false,
    configured: false,
    documented: false,
    purpose: 'Messaging entre serviços',
    cost_impact: 'Baixo',
    status: 'PROBLEMA: 100% erro rate - não configurado'
  },
  {
    name: 'Identity and Access Management (IAM) API',
    requests: 30,
    errors: 0,
    quota: 52,
    other: 122,
    category: 'Security',
    critical: false,
    configured: true,
    documented: false,
    purpose: 'Gerenciamento de permissões',
    cost_impact: 'Baixo',
    status: 'Usado automaticamente pelo Firebase'
  },
  {
    name: 'Developer Connect API',
    requests: 21,
    errors: 0,
    quota: 64,
    other: 478,
    category: 'Development',
    critical: false,
    configured: false,
    documented: false,
    purpose: 'Integração com ferramentas dev',
    cost_impact: 'Baixo',
    status: 'Funcionalidade desconhecida'
  },
  {
    name: 'Cloud Runtime Configuration API',
    requests: 20,
    errors: 0,
    quota: 100,
    other: 131,
    category: 'Configuration',
    critical: false,
    configured: false,
    documented: false,
    purpose: 'Configuração runtime',
    cost_impact: 'Baixo',
    status: 'Usado pelo App Engine (legacy)'
  },
  {
    name: 'Cloud Storage for Firebase API',
    requests: 19,
    errors: 0,
    quota: 204,
    other: 399,
    category: 'Storage',
    critical: false,
    configured: true,
    documented: false,
    purpose: 'Storage de arquivos',
    cost_impact: 'Baixo',
    status: 'Configurado mas pouco usado'
  },
  {
    name: 'Token Service API',
    requests: 14,
    errors: 14,
    quota: 18,
    other: 31,
    category: 'Authentication',
    critical: false,
    configured: true,
    documented: false,
    purpose: 'Gerenciamento de tokens OAuth',
    cost_impact: 'Baixo',
    status: 'PROBLEMA: 100% erro rate'
  },
  {
    name: 'Gemini for Google Cloud API',
    requests: 12,
    errors: 100,
    quota: 52,
    other: 111,
    category: 'AI/ML',
    critical: false,
    configured: true,
    documented: false,
    purpose: 'Google AI/Gemini integration',
    cost_impact: 'Variável',
    status: 'PROBLEMA: 100% erro rate - configuração incorreta'
  },
  {
    name: 'Cloud Scheduler API',
    requests: 9,
    errors: 88,
    quota: 3145,
    other: 7444,
    category: 'Automation',
    critical: false,
    configured: false,
    documented: false,
    purpose: 'Agendamento de tarefas',
    cost_impact: 'Baixo',
    status: 'PROBLEMA: 98% erro rate'
  },
  {
    name: 'Compute Engine API',
    requests: 7,
    errors: 0,
    quota: 196,
    other: 255,
    category: 'Compute',
    critical: false,
    configured: false,
    documented: false,
    purpose: 'VMs (não usado no projeto)',
    cost_impact: 'Alto se usado',
    status: 'Habilitado mas desnecessário'
  },
  {
    name: 'Firebase Extensions API',
    requests: 6,
    errors: 0,
    quota: 114,
    other: 242,
    category: 'Firebase',
    critical: false,
    configured: false,
    documented: false,
    purpose: 'Extensões Firebase',
    cost_impact: 'Variável',
    status: 'Poucas requests'
  }
];

// APIs sem atividade (habilitadas mas zero requests)
const inactiveAPIs = [
  'Analytics Hub API',
  'App Engine Admin API',
  'BigQuery API',
  'BigQuery Connection API',
  'BigQuery Data Policy API',
  'BigQuery Migration API',
  'BigQuery Reservation API',
  'BigQuery Storage API',
  'Cloud Dataplex API',
  'Cloud Datastore API',
  'Cloud Deployment Manager V2 API',
  'Cloud Monitoring API',
  'Cloud OS Login API',
  'Cloud Resource Manager API',
  'Cloud SQL',
  'Cloud SQL Admin API',
  'Cloud Storage',
  'Cloud Storage API',
  'Cloud Testing API',
  'Cloud Trace API',
  'Container Registry API',
  'Dataform API',
  'Eventarc API',
  'FCM Registration API',
  'Firebase App Check API',
  'Firebase App Distribution API',
  'Firebase Cloud Messaging API',
  'Firebase Data Connect API',
  'Firebase Installations API',
  'Firebase Management API',
  'Firebase Remote Config API'
];

console.log('🚨 ANÁLISE DE APIs COM PROBLEMAS:\n');

const problematicAPIs = activeAPIs.filter(api => api.errors > 0);
problematicAPIs.forEach(api => {
  const errorRate = Math.round((api.errors / api.requests) * 100);
  console.log(`❌ ${api.name}`);
  console.log(`   📊 Requests: ${api.requests} | Errors: ${api.errors} (${errorRate}%)`);
  console.log(`   🎯 Status: ${api.status}`);
  console.log(`   🔧 Configurado: ${api.configured ? 'Sim' : 'Não'}`);
  console.log(`   📚 Documentado: ${api.documented ? 'Sim' : 'Não'}`);
  console.log(`   💰 Impacto custo: ${api.cost_impact}`);
  console.log('');
});

console.log('✅ ANÁLISE DE APIs FUNCIONANDO PERFEITAMENTE:\n');

const workingAPIs = activeAPIs.filter(api => api.errors === 0);
workingAPIs.forEach(api => {
  console.log(`✅ ${api.name} (${api.requests} requests)`);
  console.log(`   🎯 ${api.purpose}`);
  console.log(`   📚 Documentado: ${api.documented ? 'Sim' : 'NÃO'}`);
  console.log('');
});

console.log('⚪ APIs INATIVAS (Habilitadas sem uso):\n');
inactiveAPIs.forEach(api => {
  console.log(`   • ${api}`);
});

console.log('\n' + '='.repeat(80));
console.log('📊 ESTATÍSTICAS CONSOLIDADAS');
console.log('='.repeat(80));

const totalAPIs = activeAPIs.length + inactiveAPIs.length;
const totalRequests = activeAPIs.reduce((sum, api) => sum + api.requests, 0);
const totalErrors = activeAPIs.reduce((sum, api) => sum + api.errors, 0);
const errorRate = ((totalErrors / totalRequests) * 100).toFixed(2);
const criticalAPIs = activeAPIs.filter(api => api.critical);
const unconfiguredAPIs = activeAPIs.filter(api => !api.configured);
const undocumentedAPIs = activeAPIs.filter(api => !api.documented);

console.log(`\n📈 OVERVIEW GERAL:`);
console.log(`   Total de APIs habilitadas: ${totalAPIs}`);
console.log(`   APIs com atividade: ${activeAPIs.length}`);
console.log(`   APIs inativas: ${inactiveAPIs.length}`);
console.log(`   Total de requests: ${totalRequests.toLocaleString()}`);
console.log(`   Total de erros: ${totalErrors}`);
console.log(`   Taxa de erro geral: ${errorRate}%`);

console.log(`\n🎯 APIS CRÍTICAS:`);
criticalAPIs.forEach(api => {
  const symbol = api.errors > 0 ? '🚨' : '✅';
  console.log(`   ${symbol} ${api.name} (${api.errors} erros)`);
});

console.log(`\n⚠️ PROBLEMAS DE CONFIGURAÇÃO:`);
console.log(`   APIs não configuradas: ${unconfiguredAPIs.length}`);
unconfiguredAPIs.forEach(api => {
  console.log(`     • ${api.name}`);
});

console.log(`\n📚 PROBLEMAS DE DOCUMENTAÇÃO:`);
console.log(`   APIs não documentadas: ${undocumentedAPIs.length}`);
undocumentedAPIs.forEach(api => {
  console.log(`     • ${api.name}`);
});

console.log('\n' + '='.repeat(80));
console.log('🔧 PLANO DE AÇÃO ESPECÍFICO');
console.log('='.repeat(80));

console.log('\n🚨 AÇÃO IMEDIATA (APIs com erros):');

console.log('\n1. IDENTITY TOOLKIT API (26% erro):');
console.log('   Causa: App Check mal configurado');
console.log('   Solução: ✅ Já implementada (sistema App Check)');
console.log('   Próximo: Configurar reCAPTCHA + debug tokens');

console.log('\n2. CLOUD PUB/SUB API (100% erro):');
console.log('   Causa: API habilitada mas não configurada');
console.log('   Recomendação: Desabilitar se não necessária');
console.log('   Ação: Investigar se é usada pelo projeto');

console.log('\n3. TOKEN SERVICE API (100% erro):');
console.log('   Causa: Problemas de OAuth/tokens');
console.log('   Impacto: Baixo (poucos requests)');
console.log('   Ação: Monitorar, pode ser transitório');

console.log('\n4. GEMINI API (100% erro):');
console.log('   Causa: Configuração incorreta da API key');
console.log('   Solução: Verificar GOOGLE_AI_API_KEY no .env.local');
console.log('   Impacto: Médio (funcionalidade IA)');

console.log('\n5. CLOUD SCHEDULER API (98% erro):');
console.log('   Causa: Agendamentos não configurados');
console.log('   Recomendação: Desabilitar se não necessária');
console.log('   Ação: Verificar se há cron jobs configurados');

console.log('\n📚 DOCUMENTAÇÃO NECESSÁRIA:');
undocumentedAPIs.forEach(api => {
  console.log(`\n• ${api.name}:`);
  console.log(`  Propósito: ${api.purpose}`);
  console.log(`  Configuração necessária: ${api.configured ? 'Verificar' : 'Implementar'}`);
  console.log(`  Impacto custo: ${api.cost_impact}`);
});

console.log('\n💰 OTIMIZAÇÃO DE CUSTOS:');
console.log('\nAPIs candidatas para desabilitação:');

const unnecessaryAPIs = [
  'Cloud Run Admin API (157 requests) - Não usado ativamente',
  'Compute Engine API (7 requests) - VMs não necessárias', 
  'Cloud Runtime Configuration API (20 requests) - Legacy',
  'Analytics Hub API (0 requests) - Sem uso',
  'BigQuery APIs (0 requests) - Não usadas',
  'Cloud SQL APIs (0 requests) - Firestore usado no lugar'
];

unnecessaryAPIs.forEach(api => {
  console.log(`   • ${api}`);
});

console.log('\n' + '='.repeat(80));
console.log('🎯 RESUMO EXECUTIVO');
console.log('='.repeat(80));

console.log('\n✅ FUNCIONANDO BEM:');
console.log('   • Firebase App Hosting (1,125 requests - core)');
console.log('   • Cloud Firestore (130 requests - database)');
console.log('   • Cloud Functions (75 requests - serverless)');
console.log('   • Cloud Build (494 requests - CI/CD)');

console.log('\n🚨 REQUER ATENÇÃO:');
console.log('   • Identity Toolkit - App Check (✅ solução implementada)');
console.log('   • Pub/Sub - 100% erro (investigar necessidade)');
console.log('   • Gemini API - configuração incorreta');
console.log('   • Cloud Scheduler - agendamentos falhando');

console.log('\n📚 NECESSITA DOCUMENTAÇÃO:');
console.log(`   • ${undocumentedAPIs.length} APIs sem documentação`);
console.log('   • Impacto especialmente em Secret Manager e Cloud Logging');

console.log('\n💰 OTIMIZAÇÃO POSSÍVEL:');
console.log('   • 20+ APIs inativas podem ser desabilitadas');
console.log('   • Compute Engine/Cloud Run desnecessários');
console.log('   • BigQuery suite não utilizada');

console.log('\n🏆 PRÓXIMOS PASSOS:');
console.log('1. ✅ Completar configuração App Check (já 90% feito)');
console.log('2. 🔧 Corrigir Gemini API key');
console.log('3. 🔍 Investigar Pub/Sub e Scheduler necessidade');
console.log('4. 📚 Documentar APIs não documentadas');
console.log('5. 💰 Desabilitar APIs desnecessárias');
console.log('6. 📊 Estabelecer monitoramento contínuo');

console.log('\n' + '='.repeat(80));
console.log('✨ Análise completa de TODAS as APIs concluída!');
console.log(`Projeto tem ${totalAPIs} APIs habilitadas, ${activeAPIs.length} ativas.`);
console.log('Prioridade: Resolver 5 APIs com problemas identificadas.');
console.log('='.repeat(80));