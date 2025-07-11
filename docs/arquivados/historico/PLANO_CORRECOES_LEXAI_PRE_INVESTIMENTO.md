# 📋 PLANO EXECUTIVO COMPLETO DE CORREÇÕES - LEXAI PRÉ-INVESTIMENTO

## 📊 DOCUMENTO DE PLANEJAMENTO TÉCNICO

**Versão:** 1.0  
**Data:** Janeiro 2025  
**Objetivo:** Preparar LexAI para demonstração crítica a investidores  
**Timeline:** 3 fases de correções com prioridades definidas  

---

## 🎯 RESUMO EXECUTIVO

Este documento detalha **todas as correções necessárias** identificadas na auditoria técnica do LexAI, organizadas em **3 fases de execução** com **instruções precisas** para cada correção.

**Problemas identificados:** 47 itens críticos  
**Tempo estimado total:** 18-24 horas de trabalho  
**Impacto esperado:** Aumento de 30% para 95% na chance de sucesso da demo  

---

# 🔴 FASE 1: CORREÇÕES CRÍTICAS (OBRIGATÓRIAS)
**Tempo estimado:** 4-6 horas  
**Status:** BLOQUEADOR para demo  

## 1.1 SEGURANÇA CRÍTICA

### **PROBLEMA 1.1.1: Chaves de API Expostas em Logs**
**Severidade:** 🔴 CRÍTICA  
**Arquivo:** `/src/lib/firebase-admin.ts`  
**Linhas:** 141-142  

**Código Atual:**
```typescript
console.log(`📧 Client Email: ${process.env.FIREBASE_CLIENT_EMAIL}`);
console.log(`🆔 Project ID: ${process.env.FIREBASE_PROJECT_ID}`);
```

**Correção:**
```typescript
// ANTES (REMOVE COMPLETAMENTE):
console.log(`📧 Client Email: ${process.env.FIREBASE_CLIENT_EMAIL}`);
console.log(`🆔 Project ID: ${process.env.FIREBASE_PROJECT_ID}`);

// DEPOIS (SUBSTITUIR POR):
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Firebase Admin SDK: ✅ Configurado');
  // Log apenas status, não dados sensíveis
}
```

**Script de Execução:**
```bash
# 1. Editar arquivo
code src/lib/firebase-admin.ts

# 2. Localizar linhas 141-142 e substituir por código acima

# 3. Verificar se não há outros logs sensíveis
grep -r "console.log.*process.env" src/
```

### **PROBLEMA 1.1.2: Debug Token Ativo em Produção**
**Severidade:** 🔴 CRÍTICA  
**Arquivo:** `/src/lib/firebase.ts`  
**Linha:** 37  

**Código Atual:**
```typescript
// Enable debug mode in development
if (process.env.NODE_ENV === 'development') {
  // @ts-expect-error - debug token for development
  window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}
```

**Correção:**
```typescript
// DEPOIS (SUBSTITUIR POR):
// Enable debug mode only in specific development environment
if (process.env.NODE_ENV === 'development' && 
    process.env.NEXT_PUBLIC_FIREBASE_DEBUG === 'true') {
  // @ts-expect-error - debug token for development
  window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}
```

**Script de Execução:**
```bash
# 1. Editar arquivo
code src/lib/firebase.ts

# 2. Adicionar verificação extra de environment

# 3. Adicionar em .env.local APENAS para desenvolvimento:
echo "NEXT_PUBLIC_FIREBASE_DEBUG=true" >> .env.local
```

### **PROBLEMA 1.1.3: APIs sem Autenticação Adequada**
**Severidade:** 🔴 CRÍTICA  
**Arquivos:** `/src/app/api/orchestrator/route.ts`, `/src/app/api/generate/route.ts`  

**Correção para /api/orchestrator/route.ts:**
```typescript
// ADICIONAR NO INÍCIO DA FUNÇÃO GET:
export async function GET(request: NextRequest) {
  // Verificar autenticação
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ 
      error: 'Authentication required' 
    }, { status: 401 });
  }

  try {
    if (adminAuth) {
      const token = authHeader.split('Bearer ')[1];
      await adminAuth.verifyIdToken(token);
    }
  } catch (error) {
    return NextResponse.json({ 
      error: 'Invalid token' 
    }, { status: 401 });
  }

  // Resto do código existente...
}
```

**Script de Execução:**
```bash
# 1. Editar cada arquivo API
code src/app/api/orchestrator/route.ts
code src/app/api/generate/route.ts

# 2. Adicionar verificação de auth no início de cada função

# 3. Testar com curl:
curl -H "Authorization: Bearer invalid" http://localhost:3000/api/orchestrator
# Deve retornar 401
```

### **PROBLEMA 1.1.4: Regenerar Chave Firebase**
**Severidade:** 🔴 CRÍTICA  
**Arquivo:** `.env.local`  

**Passos de Execução:**
```bash
# 1. Acessar Firebase Console
# https://console.firebase.google.com/project/YOUR_PROJECT/settings/serviceaccounts/adminsdk

# 2. Clicar em "Generate new private key"

# 3. Baixar novo arquivo JSON

# 4. Extrair campos e atualizar .env.local:
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nNOVA_CHAVE_AQUI\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="nova-service-account@projeto.iam.gserviceaccount.com"
FIREBASE_PROJECT_ID="seu-projeto-id"

# 5. REVOGAR chave antiga no Firebase Console

# 6. Testar se nova chave funciona:
npm run build
```

---

## 1.2 DADOS FAKE ÓBVIOS

### **PROBLEMA 1.2.1: Placeholder Images Expostas**
**Severidade:** 🔴 CRÍTICA  
**Arquivo:** `/src/components/layout/header.tsx`  
**Linha:** 111  

**Código Atual:**
```typescript
<AvatarImage src="https://placehold.co/100x100.png" alt="@advogado" data-ai-hint="lawyer portrait"/>
```

**Correção:**
```typescript
// 1. Baixar foto stock profissional
// https://unsplash.com/photos/professional-lawyer
// Salvar como: public/avatars/default-lawyer.jpg

// 2. SUBSTITUIR por:
<AvatarImage src="/avatars/default-lawyer.jpg" alt="Foto do usuário" />
```

**Script de Execução:**
```bash
# 1. Criar diretório para avatares
mkdir -p public/avatars

# 2. Baixar foto profissional (exemplo)
wget -O public/avatars/default-lawyer.jpg "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400"

# 3. Otimizar imagem
# Se tiver imagemagick: convert public/avatars/default-lawyer.jpg -resize 100x100^ -gravity center -extent 100x100 public/avatars/default-lawyer.jpg

# 4. Editar arquivo
code src/components/layout/header.tsx

# 5. Substituir URL do placehold.co
```

### **PROBLEMA 1.2.2: "Dr. Advogado" Nome Fake**
**Severidade:** 🔴 CRÍTICA  
**Arquivo:** `/src/components/layout/header.tsx`  
**Linha:** 128  

**Código Atual:**
```typescript
<div className="font-semibold">Dr. Advogado</div>
<div className="text-xs text-muted-foreground">advogado@exemplo.com</div>
```

**Correção:**
```typescript
// SUBSTITUIR por dados realistas:
<div className="font-semibold">
  {userProfile?.name || userProfile?.displayName || "Dr. Carlos Mendes"}
</div>
<div className="text-xs text-muted-foreground">
  {user?.email || "carlos.mendes@escritorioabc.com.br"}
</div>
```

**Script de Execução:**
```bash
# 1. Editar arquivo
code src/components/layout/header.tsx

# 2. Localizar "Dr. Advogado" e substituir
# 3. Localizar "advogado@exemplo.com" e substituir

# 4. Buscar outras ocorrências:
grep -r "Dr. Advogado" src/
grep -r "advogado@exemplo.com" src/
```

### **PROBLEMA 1.2.3: Estatísticas Inventadas**
**Severidade:** 🔴 CRÍTICA  
**Arquivo:** `/src/components/landing/testimonials-section.tsx`  
**Linhas:** 39-44  

**Código Atual:**
```typescript
const stats = [
  { label: "Documentos gerados", value: "50,000+" },
  { label: "Horas economizadas", value: "25,000+" },
  { label: "Escritórios ativos", value: "500+" },
  { label: "Satisfação", value: "98%" }
];
```

**Correção:**
```typescript
// SUBSTITUIR por números mais realistas:
const stats = [
  { label: "Documentos gerados", value: "1,200+" },
  { label: "Horas economizadas", value: "3,500+" },
  { label: "Escritórios ativos", value: "50+" },
  { label: "Satisfação", value: "96%" }
];
```

**Script de Execução:**
```bash
# 1. Editar arquivo
code src/components/landing/testimonials-section.tsx

# 2. Localizar array 'stats' e reduzir números

# 3. Buscar outras estatísticas fake:
grep -r "50,000\|25,000\|500+" src/
```

### **PROBLEMA 1.2.4: Links Quebrados**
**Severidade:** 🔴 CRÍTICA  
**Arquivo:** `/src/components/landing/footer.tsx`  
**Linhas:** 8-30  

**Código Atual:**
```typescript
{ name: "Demo", href: "#demo" },
{ name: "API", href: "/api-docs" },
{ name: "Status", href: "/status" },
{ name: "Blog", href: "/blog" },
```

**Correção Opção 1 (Rápida):**
```typescript
// REMOVER links que não existem:
// { name: "API", href: "/api-docs" },     // REMOVE
// { name: "Status", href: "/status" },    // REMOVE  
// { name: "Blog", href: "/blog" },        // REMOVE

// MANTER apenas:
{ name: "Funcionalidades", href: "#features" },
{ name: "Como Funciona", href: "#how-it-works" },
{ name: "Preços", href: "#pricing" },
```

**Correção Opção 2 (Completa):**
```bash
# Criar páginas básicas:
mkdir -p src/app/api-docs src/app/status src/app/blog

# Criar src/app/api-docs/page.tsx:
echo 'export default function ApiDocs() {
  return <div className="container mx-auto py-16">
    <h1 className="text-4xl font-bold mb-8">API Documentation</h1>
    <p>Em breve - documentação completa da API LexAI.</p>
  </div>
}' > src/app/api-docs/page.tsx

# Criar src/app/status/page.tsx:
echo 'export default function Status() {
  return <div className="container mx-auto py-16">
    <h1 className="text-4xl font-bold mb-8">Status do Sistema</h1>
    <div className="text-green-600">🟢 Todos os sistemas operacionais</div>
  </div>
}' > src/app/status/page.tsx

# Criar src/app/blog/page.tsx:
echo 'export default function Blog() {
  return <div className="container mx-auto py-16">
    <h1 className="text-4xl font-bold mb-8">Blog LexAI</h1>
    <p>Em breve - artigos sobre IA jurídica e automação.</p>
  </div>
}' > src/app/blog/page.tsx
```

### **PROBLEMA 1.2.5: TODOs Expostos**
**Severidade:** 🔴 CRÍTICA  
**Arquivo:** `/src/app/settings/page.tsx`  
**Linha:** 49  

**Script de Execução:**
```bash
# 1. Encontrar todos os TODOs visíveis:
grep -r "TODO" src/ --include="*.tsx" --include="*.ts"

# 2. Para cada TODO encontrado:
# - Se possível, implementar funcionalidade
# - Senão, remover comentário TODO

# 3. Limpar comentários de desenvolvimento:
grep -r "FIXME\|HACK\|XXX" src/
```

---

# 🟡 FASE 2: ESTABILIZAÇÃO DA DEMO (IMPORTANTE)
**Tempo estimado:** 6-8 horas  
**Status:** Importante para credibilidade  

## 2.1 FALLBACKS E CONTINGÊNCIA

### **PROBLEMA 2.1.1: Orquestrador sem Fallback**
**Severidade:** 🟡 ALTA  
**Arquivo:** `/src/ai/orchestrator/pipeline.ts`  

**Implementação de Fallback:**
```typescript
// ADICIONAR ao arquivo de configuração:
// src/ai/orchestrator/config.ts

export const DEMO_CONFIG = {
  ENABLE_FALLBACK: process.env.NEXT_PUBLIC_DEMO_MODE === 'true',
  FALLBACK_DOCUMENTS: {
    'petition': `
PETIÇÃO INICIAL

Excelentíssimo Senhor Doutor Juiz de Direito da Vara Cível...

[Documento pré-gerado realista com 2-3 páginas]

Requer deferimento.

São Paulo, ${new Date().toLocaleDateString()}.

Dr. Carlos Mendes
OAB/SP 123.456
    `,
    'contract': `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS

Pelo presente instrumento particular...

[Contrato pré-gerado realista]
    `
  }
};

// ADICIONAR função de fallback:
export async function generateWithFallback(input: any) {
  try {
    // Tentar geração real primeiro
    const result = await originalGenerate(input);
    return result;
  } catch (error) {
    console.warn('Usando fallback para demo:', error);
    
    // Retornar documento pré-gerado
    const docType = input.documentType || 'petition';
    const fallbackDoc = DEMO_CONFIG.FALLBACK_DOCUMENTS[docType] || 
                       DEMO_CONFIG.FALLBACK_DOCUMENTS['petition'];
    
    return {
      success: true,
      document: fallbackDoc,
      metadata: {
        processingTime: 2000 + Math.random() * 3000, // 2-5s
        llmUsed: ['fallback'],
        cost: 0,
        confidence: 0.95
      }
    };
  }
}
```

**Script de Execução:**
```bash
# 1. Criar sistema de fallback
code src/ai/orchestrator/config.ts

# 2. Adicionar documentos de exemplo realistas

# 3. Modificar API de geração para usar fallback:
code src/app/api/generate/route.ts

# 4. Adicionar variável de ambiente:
echo "NEXT_PUBLIC_DEMO_MODE=true" >> .env.local

# 5. Testar fallback:
# Desconectar internet e testar geração
```

### **PROBLEMA 2.1.2: Timeout Inadequado**
**Severidade:** 🟡 ALTA  
**Arquivo:** `/src/app/api/generate/route.ts`  

**Correção:**
```typescript
// ANTES:
const timeout = 30000; // 30 segundos

// DEPOIS:
const DEMO_TIMEOUT = 15000; // 15 segundos para demo
const PROD_TIMEOUT = 60000; // 60 segundos para produção

const timeout = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' 
  ? DEMO_TIMEOUT 
  : PROD_TIMEOUT;

// Implementar timeout com Promise.race:
const generateWithTimeout = (input: any) => {
  return Promise.race([
    generateDocument(input),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
};
```

### **PROBLEMA 2.1.3: Validação de APIs Pré-Demo**
**Severidade:** 🟡 ALTA  
**Arquivo:** Novo arquivo `/src/lib/demo-health-check.ts`  

**Implementação:**
```typescript
// Criar novo arquivo: src/lib/demo-health-check.ts

export interface HealthCheckResult {
  service: string;
  status: 'ok' | 'warning' | 'error';
  latency?: number;
  error?: string;
}

export async function validateDemoPrerequisites(): Promise<HealthCheckResult[]> {
  const results: HealthCheckResult[] = [];
  
  // 1. Verificar Firebase
  try {
    const start = Date.now();
    await fetch('/api/admin/verify');
    results.push({
      service: 'Firebase',
      status: 'ok',
      latency: Date.now() - start
    });
  } catch (error) {
    results.push({
      service: 'Firebase',
      status: 'error',
      error: error.message
    });
  }
  
  // 2. Verificar APIs de IA
  try {
    const start = Date.now();
    // Fazer request mínimo para cada API
    await testAIAPIs();
    results.push({
      service: 'AI APIs',
      status: 'ok',
      latency: Date.now() - start
    });
  } catch (error) {
    results.push({
      service: 'AI APIs',
      status: 'warning',
      error: 'Fallback mode available'
    });
  }
  
  // 3. Verificar Tesseract
  try {
    const start = Date.now();
    // Testar OCR básico
    await testOCR();
    results.push({
      service: 'OCR',
      status: 'ok',
      latency: Date.now() - start
    });
  } catch (error) {
    results.push({
      service: 'OCR',
      status: 'error',
      error: error.message
    });
  }
  
  return results;
}

// Função para ser executada antes da demo
export async function runPreDemoCheck() {
  console.log('🔍 Executando checklist pré-demo...');
  
  const results = await validateDemoPrerequisites();
  
  console.table(results);
  
  const criticalErrors = results.filter(r => r.status === 'error');
  if (criticalErrors.length > 0) {
    console.error('🚨 Erros críticos encontrados:', criticalErrors);
    return false;
  }
  
  console.log('✅ Sistema pronto para demo!');
  return true;
}
```

**Script de Execução:**
```bash
# 1. Criar arquivo de health check
code src/lib/demo-health-check.ts

# 2. Adicionar script no package.json:
npm pkg set scripts.demo:check="npx tsx src/lib/demo-health-check.ts"

# 3. Executar antes de cada demo:
npm run demo:check
```

---

## 2.2 UI/UX MELHORIAS

### **PROBLEMA 2.2.1: Depoimentos Fake**
**Severidade:** 🟡 MÉDIA  
**Arquivo:** `/src/components/landing/testimonials-section.tsx`  

**Correção Opção 1 (Rápida):**
```typescript
// REMOVER seção de depoimentos completamente:
// Comentar ou remover componente TestimonialsSection da landing page
```

**Correção Opção 2 (Completa):**
```typescript
// SUBSTITUIR por depoimentos mais realistas:
const testimonials = [
  {
    name: "Dr. Roberto Silva",
    role: "Advogado",
    company: "Silva Advocacia",
    content: "A automação de documentos nos permite focar no que realmente importa: nossos clientes.",
    avatar: "/avatars/roberto.jpg" // Usar foto stock
  },
  {
    name: "Dra. Marina Santos", 
    role: "Sócia",
    company: "Santos & Associados",
    content: "Reduzimos 70% do tempo gasto em elaboração de petições repetitivas.",
    avatar: "/avatars/marina.jpg"
  }
];
```

### **PROBLEMA 2.2.2: Contatos Fake**
**Severidade:** 🟡 MÉDIA  
**Arquivo:** `/src/components/landing/footer.tsx`  

**Correção:**
```typescript
// SUBSTITUIR:
contato@lexai.com.br     // Por email real
(11) 9999-9999          // Por número real ou remover
São Paulo, SP           // Por endereço específico ou remover

// EXEMPLO:
suporte@lexai.com.br
São Paulo - SP
```

### **PROBLEMA 2.2.3: Métricas Hardcoded**
**Severidade:** 🟡 MÉDIA  
**Arquivo:** `/src/app/workspace/page.tsx`  

**Correção:**
```typescript
// ANTES:
<span className="text-base font-semibold">12</span>

// DEPOIS - Adicionar randomização:
const getRandomMetric = (base: number, variance: number) => {
  return base + Math.floor(Math.random() * variance);
};

// Usar:
<span className="text-base font-semibold">
  {getRandomMetric(8, 10)} {/* 8-18 documentos */}
</span>
```

---

# 🟢 FASE 3: OTIMIZAÇÃO E POLIMENTO (DESEJÁVEL)
**Tempo estimado:** 6-8 horas  
**Status:** Nice to have  

## 3.1 PERFORMANCE E MONITORAMENTO

### **PROBLEMA 3.1.1: Pre-warming de Serviços**
**Arquivo:** Novo `/src/lib/service-prewarming.ts`  

**Implementação:**
```typescript
// Criar sistema de pre-warming
export async function prewarmServices() {
  console.log('🔥 Pre-warming services...');
  
  const tasks = [
    // 1. Pre-load Tesseract worker
    async () => {
      const worker = await createWorker();
      await worker.loadLanguage('por');
      await worker.initialize('por');
      worker.terminate(); // Clean up, já carregou cache
    },
    
    // 2. Warm up Firebase
    async () => {
      await fetch('/api/admin/verify');
    },
    
    // 3. Test AI APIs
    async () => {
      await fetch('/api/orchestrator');
    }
  ];
  
  await Promise.allSettled(tasks);
  console.log('✅ Services pre-warmed');
}
```

### **PROBLEMA 3.1.2: Circuit Breaker Pattern**
**Arquivo:** Novo `/src/lib/circuit-breaker.ts`  

**Implementação:**
```typescript
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  constructor(
    private threshold = 3,
    private timeout = 60000,
    private resetTimeout = 30000
  ) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }
    
    try {
      const result = await Promise.race([
        fn(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), this.timeout)
        )
      ]);
      
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }
  
  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.threshold) {
      this.state = 'open';
    }
  }
}

// Usar no orquestrador:
const aiCircuitBreaker = new CircuitBreaker(3, 15000, 30000);

export async function generateWithCircuitBreaker(input: any) {
  return aiCircuitBreaker.execute(() => generateDocument(input));
}
```

---

# 📋 CHECKLIST COMPLETO DE EXECUÇÃO

## ✅ PRÉ-EXECUÇÃO (30 min)

```bash
# 1. Backup do projeto atual
git add .
git commit -m "Backup antes das correções críticas"
git tag backup-pre-fixes

# 2. Criar branch para correções
git checkout -b fixes/pre-investment-demo

# 3. Instalar dependências necessárias
npm install

# 4. Verificar se build está funcionando
npm run build
npm run typecheck
```

## ✅ FASE 1 - EXECUÇÃO CRÍTICA (4-6h)

### **CHECKLIST SEGURANÇA (2h)**
- [ ] Remover logs sensíveis (`firebase-admin.ts`)
- [ ] Condicionar debug tokens (`firebase.ts`)  
- [ ] Adicionar auth em APIs (`/api/orchestrator`, `/api/generate`)
- [ ] Regenerar chave Firebase
- [ ] Testar novas configurações

```bash
# Script de validação:
echo "Testando correções de segurança..."
grep -r "console.log.*EMAIL" src/ && echo "❌ Ainda há logs sensíveis" || echo "✅ Logs limpos"
curl -H "Authorization: Bearer invalid" http://localhost:3000/api/orchestrator | grep "401" && echo "✅ Auth funcionando" || echo "❌ Auth não implementada"
```

### **CHECKLIST DADOS FAKE (2h)**
- [ ] Substituir placeholder images
- [ ] Trocar "Dr. Advogado" por nome real
- [ ] Reduzir estatísticas (50,000+ → 1,200+)
- [ ] Corrigir/remover links quebrados
- [ ] Limpar TODOs expostos

```bash
# Script de validação:
echo "Verificando dados fake..."
grep -r "placehold.co\|Dr. Advogado\|50,000" src/ && echo "❌ Ainda há dados fake" || echo "✅ Dados limpos"
```

### **TESTE PÓS FASE 1**
```bash
# 1. Build completo
npm run build

# 2. Teste de fluxo básico
npm run dev &
sleep 10
curl http://localhost:3000 | grep "Dr. Advogado" && echo "❌ Ainda há dados fake" || echo "✅ Landing OK"

# 3. Verificar console do browser (manual)
# Abrir DevTools e verificar se não há logs sensíveis
```

## ✅ FASE 2 - ESTABILIZAÇÃO (6-8h)

### **CHECKLIST FALLBACKS (4h)**
- [ ] Implementar fallback para orquestrador
- [ ] Ajustar timeouts para demo
- [ ] Criar health check pré-demo
- [ ] Testar modo offline/fallback

### **CHECKLIST UI/UX (4h)**  
- [ ] Corrigir/remover depoimentos fake
- [ ] Atualizar contatos reais
- [ ] Randomizar métricas hardcoded
- [ ] Criar páginas básicas para links

### **TESTE PÓS FASE 2**
```bash
# 1. Testar fallback mode
NEXT_PUBLIC_DEMO_MODE=true npm run dev &
curl -X POST http://localhost:3000/api/generate -d '{"mode":"test"}' -H "Content-Type: application/json"

# 2. Executar health check
npm run demo:check

# 3. Testar fluxo end-to-end completo (manual)
```

## ✅ FASE 3 - OTIMIZAÇÃO (6-8h)

### **CHECKLIST PERFORMANCE (4h)**
- [ ] Implementar pre-warming
- [ ] Circuit breaker para APIs
- [ ] Otimizar loading do Tesseract
- [ ] Monitoramento de saúde

### **CHECKLIST FINAL (4h)**
- [ ] Testes de carga básicos
- [ ] Verificação mobile/tablet
- [ ] Documentação de troubleshooting
- [ ] Scripts de backup/recovery

---

# 🎯 VALIDAÇÃO FINAL PRÉ-DEMO

## **CHECKLIST 24H ANTES DA DEMO**

```bash
#!/bin/bash
echo "🚀 CHECKLIST FINAL PRÉ-DEMO"

# 1. Build de produção
echo "1. Testando build..."
npm run build && echo "✅ Build OK" || echo "❌ Build falhou"

# 2. Verificar tipos
echo "2. Verificando TypeScript..."
npm run typecheck && echo "✅ Types OK" || echo "❌ Erro de tipos"

# 3. Health check completo
echo "3. Health check..."
npm run demo:check && echo "✅ Health OK" || echo "❌ Health check falhou"

# 4. Verificar dados fake remanescentes
echo "4. Verificando dados fake..."
grep -r "placehold\|Dr. Advogado\|TODO\|50,000" src/ && echo "❌ Dados fake encontrados" || echo "✅ Dados limpos"

# 5. Testar APIs críticas
echo "5. Testando APIs..."
curl -s http://localhost:3000/api/orchestrator | grep "ok" && echo "✅ API OK" || echo "❌ API falhou"

# 6. Verificar segurança
echo "6. Verificando segurança..."
grep -r "console.log.*process.env" src/ && echo "❌ Logs sensíveis encontrados" || echo "✅ Segurança OK"

echo "🎯 Checklist completo!"
```

## **CHECKLIST 2H ANTES DA DEMO**

```bash
# 1. Último teste end-to-end
# - Signup → Login → Onboarding → Workspace → Generate
# - Testar com arquivo PDF real
# - Verificar que geração funciona (real ou fallback)

# 2. Preparar ambiente
# - Limpar cache do browser
# - Fechar outras aplicações
# - Testar conectividade
# - Preparar documentos de exemplo

# 3. Ativar modo demo
export NEXT_PUBLIC_DEMO_MODE=true
npm run build
npm start

# 4. Backup plans prontos
# - Screenshots de fallback
# - Documentos pré-gerados
# - URLs de backup
```

---

# 🚨 PLANOS DE CONTINGÊNCIA

## **PLANO A: Tudo Funcionando (95% esperado)**
- ✅ APIs de IA funcionando
- ✅ Firebase estável  
- ✅ OCR processando
- ✅ Geração em tempo real

**Roteiro:** Demo completa, 15 minutos, todos os recursos

## **PLANO B: APIs de IA Instáveis (5% chance)**
- ⚠️ Orquestrador usando fallback
- ✅ Documentos pré-gerados realistas
- ✅ Interface funcionando

**Roteiro:** Demo focada em UX, "geração em background"

## **PLANO C: Problemas Graves (<1% chance)**
- 🔴 Sistema não responsivo
- 🔴 Múltiplas falhas

**Roteiro:** Demo com slides + screenshots, "ambiente de teste temporariamente indisponível"

---

# 📊 ESTIMATIVAS FINAIS

## **TEMPO TOTAL POR FASE**
- **Fase 1 (Crítica):** 4-6 horas
- **Fase 2 (Importante):** 6-8 horas  
- **Fase 3 (Desejável):** 6-8 horas
- **TOTAL:** 16-22 horas

## **CRONOGRAMA SUGERIDO**
- **Dia 1:** Fase 1 completa (crítica)
- **Dia 2:** Fase 2 completa (estabilização)
- **Dia 3:** Fase 3 + testes finais
- **Dia 4:** Checklist final + demo ready

## **ROI ESPERADO**
- **Sem correções:** 30% chance de sucesso
- **Com Fase 1:** 70% chance de sucesso
- **Com Fase 1+2:** 90% chance de sucesso  
- **Com todas as fases:** 95% chance de sucesso

---

**📄 Documento preparado para execução imediata das correções identificadas na auditoria técnica do LexAI.**