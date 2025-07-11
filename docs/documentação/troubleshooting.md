# 🔧 Troubleshooting Guide - LexAI

> **Guia centralizado para resolução de problemas comuns no LexAI**

---

## 🎯 **Visão Geral**

Este guia consolida soluções para os problemas mais comuns encontrados no desenvolvimento e produção do LexAI:
- Problemas de build e deployment
- Questões de autenticação
- Erros do Firebase/Firestore
- Problemas de performance
- Questões de integração com IA

---

## 🏗️ **Problemas de Build**

### **Build trava em "Creating optimized production build"**

**Sintomas:**
- Build para em "Collecting page data"
- Timeout após 2+ minutos
- Funciona em desenvolvimento mas falha em produção

**Causa Raiz:**
- Next.js 15.x possui incompatibilidades conhecidas
- Firebase SSR executando durante build
- APIs sem timeout durante coleta de dados

**Solução:**
```bash
# 1. Downgrade Next.js para versão estável
npm install next@14.2.30 @next/bundle-analyzer@14.2.30 eslint-config-next@14.2.30

# 2. Adicionar build guards
```

```typescript
// src/hooks/use-auth.tsx
useEffect(() => {
  // Skip durante build/SSR
  if (typeof window === 'undefined') return;
  
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    // Firebase operations aqui
  });
}, []);
```

```javascript
// next.config.js (converter de .ts para .js)
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Temporário
  },
  eslint: {
    ignoreDuringBuilds: true, // Temporário
  }
};
```

### **Erros de TypeScript durante build**

**Sintomas:**
- Centenas de warnings TypeScript
- Erros de tipos não encontrados
- Build falha com type errors

**Solução:**
```bash
# 1. Verificar configuração TypeScript
npm run typecheck

# 2. Corrigir imports
# Usar imports absolutos: @/components ao invés de ../../../
```

```typescript
// tsconfig.json - verificar paths
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 🔐 **Problemas de Autenticação**

### **"Domain not authorized" - Google OAuth**

**Sintomas:**
```
auth/unauthorized-domain: This domain is not authorized to run this operation
```

**Causa:**
- Domínio não configurado nos authorized domains
- Configuração OAuth incorreta

**Solução:**
1. **Firebase Console:**
   - Authentication → Settings → Authorized domains
   - Adicionar: `lexai-ef0ab.firebaseapp.com`
   - Remover: `localhost` (produção)

2. **Google Cloud Console:**
   - APIs & Services → Credentials
   - OAuth 2.0 Client ID → Authorized origins
   - Adicionar: `https://lexai-ef0ab.firebaseapp.com`

3. **Verificar variáveis:**
```env
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=lexai-ef0ab.firebaseapp.com
# NÃO usar: lexai-ef0ab.web.app
```

### **"Permission denied" - Firestore**

**Sintomas:**
```
FirebaseError: Missing or insufficient permissions
```

**Causas Comuns:**
1. Token não propagado ainda
2. Security rules incorretas
3. Collections com namespace incorreto

**Soluções:**

```typescript
// 1. Implementar delay em produção
if (process.env.NODE_ENV === 'production') {
  await new Promise(resolve => setTimeout(resolve, 2000));
}

// 2. Verificar security rules
// firestore.rules
allow read, write: if request.auth != null && request.auth.uid == userId;

// 3. Collections environment-aware
const collection = process.env.NODE_ENV === 'production' 
  ? 'usuarios' 
  : addNamespace('usuarios');
```

### **Token timing issues**

**Sintomas:**
- "Token ready immediately" em produção
- Acesso negado intermitente
- Auth funciona às vezes

**Solução:**
```typescript
// auth-coordinator.ts
export const waitForAuthReady = async () => {
  if (process.env.NODE_ENV === 'production') {
    console.log('⏳ Waiting for token propagation in production (2s)');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};
```

---

## 🔥 **Problemas do Firebase**

### **Firebase não inicializa**

**Sintomas:**
- "Firebase app not initialized"
- Configuração não carregada

**Solução:**
```typescript
// Verificar variáveis de ambiente
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`${envVar} is required`);
  }
});
```

### **Firestore connection issues**

**Sintomas:**
- Timeout em operações Firestore
- "Failed to get document"

**Solução:**
```typescript
// Implementar retry logic
const retryOperation = async (operation: () => Promise<any>, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

---

## 🤖 **Problemas de IA/Orquestrador**

### **API timeouts**

**Sintomas:**
- Requests para LLMs timeout
- Pipeline para no meio

**Solução:**
```typescript
// Implementar timeouts e retry
const controller = new AbortController();
setTimeout(() => controller.abort(), 30000); // 30s timeout

const response = await fetch(apiUrl, {
  signal: controller.signal,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### **Rate limiting**

**Sintomas:**
- "Rate limit exceeded"
- 429 errors

**Solução:**
```typescript
// Implementar exponential backoff
const exponentialBackoff = async (fn: () => Promise<any>, maxRetries = 5) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s, 8s, 16s
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
};
```

### **Memory issues com documentos grandes**

**Sintomas:**
- "Out of memory" errors
- Processamento lento

**Solução:**
```typescript
// Processar em chunks
const processInChunks = async (content: string, chunkSize = 4000) => {
  const chunks = [];
  for (let i = 0; i < content.length; i += chunkSize) {
    chunks.push(content.slice(i, i + chunkSize));
  }
  
  const results = [];
  for (const chunk of chunks) {
    const result = await processChunk(chunk);
    results.push(result);
    // Pequeno delay para evitar rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results.join('');
};
```

---

## ⚡ **Problemas de Performance**

### **Páginas carregam lentamente**

**Sintomas:**
- First Load > 3 segundos
- LCP > 2.5 segundos

**Soluções:**
```typescript
// 1. Lazy loading de componentes
const OrchestratorLazy = lazy(() => import('@/components/ocr/ocr-processor-lazy'));

// 2. Preload de recursos críticos
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="" />

// 3. Otimizar imagens
import Image from 'next/image';
<Image src="/hero.jpg" alt="Hero" width={800} height={600} priority />
```

### **Bundle size muito grande**

**Sintomas:**
- Bundle > 2MB
- Slow 3G load time > 10s

**Soluções:**
```bash
# 1. Analisar bundle
npm run build
npm run analyze

# 2. Code splitting
# Dividir em chunks menores

# 3. Tree shaking
# Remover imports não utilizados
```

---

## 🔍 **Debugging e Logs**

### **Habilitar logs detalhados**

```typescript
// Debug mode
const DEBUG = process.env.NODE_ENV === 'development';

const logger = {
  debug: (message: string, data?: any) => {
    if (DEBUG) {
      console.log(`🐛 ${message}`, data);
    }
  },
  error: (message: string, error?: any) => {
    console.error(`❌ ${message}`, error);
  },
  info: (message: string, data?: any) => {
    console.log(`ℹ️ ${message}`, data);
  }
};
```

### **Health checks**

```typescript
// API health check
export async function GET() {
  try {
    // Verificar Firebase
    const db = getFirestore();
    await db.collection('health').doc('check').get();
    
    // Verificar APIs de IA
    const openaiHealth = await checkOpenAI();
    
    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        firebase: 'ok',
        openai: openaiHealth ? 'ok' : 'error'
      }
    });
  } catch (error) {
    return Response.json({
      status: 'error',
      error: error.message
    }, { status: 500 });
  }
}
```

---

## 📊 **Monitoramento**

### **Métricas importantes**
- Taxa de sucesso de autenticação
- Tempo de resposta das APIs
- Erros de Firestore
- Performance do orquestrador

### **Alertas recomendados**
- Falhas de auth > 5%
- API response time > 5s
- Error rate > 1%
- Memory usage > 80%

---

## 🚨 **Comandos de Emergência**

### **Reset completo do ambiente**
```bash
# 1. Limpar cache
rm -rf .next node_modules package-lock.json
npm install

# 2. Reset Firebase
firebase logout
firebase login
firebase use lexai-ef0ab

# 3. Verificar configuração
npm run typecheck
npm run lint
```

### **Rollback rápido**
```bash
# 1. Voltar para última versão estável
git checkout main
git pull origin main

# 2. Deploy imediato
npm run build
firebase deploy --only hosting
```

---

## ✅ **Checklist de Troubleshooting**

### **Antes de investigar:**
- [ ] Verificar logs do console
- [ ] Confirmar variáveis de ambiente
- [ ] Testar em ambiente local
- [ ] Verificar status dos serviços externos

### **Durante a investigação:**
- [ ] Reproduzir o problema
- [ ] Isolar a causa raiz
- [ ] Testar soluções em desenvolvimento
- [ ] Documentar a solução

### **Após resolver:**
- [ ] Testar em produção
- [ ] Atualizar documentação
- [ ] Implementar monitoramento
- [ ] Comunicar para a equipe

---

**🔧 Este guia é atualizado continuamente com novos problemas e soluções encontrados no desenvolvimento do LexAI.**