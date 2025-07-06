/**
 * Configurações específicas para ambiente de staging
 * Implementa namespace para separar dados de teste dos dados de produção
 */

/**
 * Obter prefixo do namespace baseado no ambiente
 */
export function getNamespacePrefix(): string {
  // ✅ COM PROJETOS SEPARADOS: Namespaces não são mais necessários
  // Cada ambiente usa um projeto Firebase diferente:
  // - development: lexai-development  
  // - production: lexai-ef0ab
  
  const env = process.env.NEXT_PUBLIC_APP_ENV;
  const namespace = process.env.NEXT_PUBLIC_APP_NAMESPACE;
  
  // Staging: usa namespace customizado se definido (para casos especiais)
  if (env === 'staging' && namespace) {
    return namespace;
  }
  
  // NOVO PADRÃO: Sem namespaces - projetos separados garantem isolamento
  return '';
}

/**
 * Adicionar namespace a uma collection/path do Firestore
 */
export function addNamespace(path: string): string {
  const prefix = getNamespacePrefix();
  return prefix ? `${prefix}${path}` : path;
}

/**
 * Configurações de limite para staging
 */
export const STAGING_LIMITS = {
  maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '5242880'), // 5MB
  maxDocumentsPerUser: parseInt(process.env.NEXT_PUBLIC_MAX_DOCUMENTS_PER_USER || '10'),
  maxRequestsPerHour: parseInt(process.env.NEXT_PUBLIC_MAX_REQUESTS_PER_HOUR || '50'),
  maxProcessingTime: 120000, // 2 minutos
  maxTokensPerRequest: 4000
};

/**
 * Verificar se estamos em modo staging
 */
export function isStagingMode(): boolean {
  return process.env.NEXT_PUBLIC_APP_ENV === 'staging';
}

/**
 * Configurações específicas do staging
 */
export const STAGING_CONFIG = {
  // Reduzir timeouts para testes mais rápidos
  requestTimeout: 30000, // 30s
  retryAttempts: 2,
  
  // Logging mais detalhado
  enableDebugLogs: true,
  enablePerformanceLogs: true,
  
  // Limitações de custo
  maxCostPerRequest: 0.10, // $0.10 por request
  maxDailyCost: 5.00, // $5.00 por dia
  
  // Configurações de UI para identificar staging
  showStagingBanner: true,
  stagingBannerColor: '#FF6B35'
};

/**
 * Gerar ID único para documentos de teste
 */
export function generateTestId(prefix: string = 'test'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const namespace = getNamespacePrefix();
  
  return `${namespace}${prefix}_${timestamp}_${random}`;
}

/**
 * Verificar se um documento é de teste (baseado no ID)
 */
export function isTestDocument(id: string): boolean {
  const prefix = getNamespacePrefix();
  return prefix ? id.startsWith(prefix) : false;
}

/**
 * Configurações de cleanup para dados de teste
 */
export const CLEANUP_CONFIG = {
  // Remover documentos de teste após 7 dias
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias em ms
  
  // Executar cleanup diariamente
  cleanupInterval: 24 * 60 * 60 * 1000, // 24h em ms
  
  // Manter no máximo 100 documentos de teste por usuário
  maxTestDocuments: 100
};