# 🚀 Melhorias Prioritárias - LexAI

## 🔥 CRÍTICO - Implementar Agora

### 1. **Integrar Orquestrador ao Wizard**
```typescript
// src/app/generate/components/wizard.tsx
// SUBSTITUIR as funções mock pelas reais

import { generateDocument, ProcessingInput } from '@/ai/orchestrator';

const handleGenerate = async () => {
  // ... código existente ...
  
  // REMOVER:
  // result = { document: `Mock response` };
  
  // ADICIONAR:
  if (files.length > 0) {
    const attachmentDataUris = await Promise.all(files.map(fileToDataUri));
    const input: ProcessingInput = {
      taskType: 'document_generation',
      documentType: generationMode === 'outline' ? 'brief' : 'petition',
      legalArea: 'civil',
      instructions: enhancedInstructions,
      context: attachmentDataUris.map(uri => ({
        type: 'file_content',
        content: uri,
        source: 'user_upload'
      }))
    };
    
    const result = await generateDocument(input);
    setGeneratedDocument(result.result?.content || 'Erro na geração');
  }
};
```

### 2. **Corrigir Configuração Firebase**
```typescript
// src/lib/firebase.ts
// ADICIONAR validação rigorosa

const validateFirebaseConfig = () => {
  const required = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn(`⚠️ Firebase config incomplete: ${missing.join(', ')}`);
    return false;
  }
  
  return true;
};

export const isFirebaseConfigured = validateFirebaseConfig();
```

### 3. **Implementar LLM Clients Reais**
```typescript
// src/ai/orchestrator/clients/
// Criar clientes reais para cada LLM

// openai-client.ts
import OpenAI from 'openai';

export class OpenAIClient {
  private client: OpenAI;
  
  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }
  
  async generate(prompt: string, options: any) {
    const response = await this.client.chat.completions.create({
      model: options.model || 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: options.maxTokens || 2000
    });
    
    return {
      content: response.choices[0]?.message?.content || '',
      usage: response.usage
    };
  }
}
```

---

## ⚡ IMPORTANTE - Próxima Sprint

### 4. **Adicionar Validação com Zod**
```bash
npm install zod
```

```typescript
// src/lib/validations.ts
import { z } from 'zod';

export const AgentSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  legalArea: z.string().min(1, 'Área jurídica é obrigatória'),
  files: z.array(z.instanceof(File)).optional()
});

export const DocumentGenerationSchema = z.object({
  instructions: z.string().min(10, 'Instruções muito curtas'),
  documentType: z.enum(['petition', 'contract', 'legal_opinion']),
  attachments: z.array(z.string()).optional()
});
```

### 5. **Implementar Error Tracking**
```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV
});
```

### 6. **Otimizar Bundle Size**
```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion']
  },
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    };
    return config;
  }
};
```

---

## 📈 MÉDIO - Melhorias Graduais

### 7. **Implementar Cache Inteligente**
```typescript
// src/lib/cache.ts
class DocumentCache {
  private cache = new Map<string, any>();
  private ttl = 5 * 60 * 1000; // 5 minutos
  
  set(key: string, value: any) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }
  
  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
}
```

### 8. **Adicionar Analytics**
```typescript
// src/lib/analytics.ts
export const trackEvent = (event: string, properties?: any) => {
  if (typeof window !== 'undefined') {
    // Google Analytics 4
    gtag('event', event, properties);
    
    // Mixpanel (opcional)
    if (window.mixpanel) {
      window.mixpanel.track(event, properties);
    }
  }
};

// Usar em componentes:
trackEvent('agent_created', { 
  legalArea: materia, 
  hasFiles: files.length > 0 
});
```

### 9. **Implementar PWA**
```bash
npm install next-pwa
```

```typescript
// next.config.ts
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development'
});

module.exports = withPWA(nextConfig);
```

---

## 🧪 BAIXO - Testes e Qualidade

### 10. **Adicionar Testes**
```bash
npm install -D @testing-library/react @testing-library/jest-dom jest
```

```typescript
// src/__tests__/components/wizard.test.tsx
import { render, screen } from '@testing-library/react';
import { GenerationWizard } from '@/app/generate/components/wizard';

describe('GenerationWizard', () => {
  it('should render all steps', () => {
    render(<GenerationWizard />);
    
    expect(screen.getByText('Modo de Geração')).toBeInTheDocument();
    expect(screen.getByText('Seleção de Agente')).toBeInTheDocument();
    expect(screen.getByText('Instruções')).toBeInTheDocument();
    expect(screen.getByText('Anexos')).toBeInTheDocument();
  });
});
```

### 11. **Adicionar Linting Avançado**
```bash
npm install -D eslint-plugin-security eslint-plugin-a11y
```

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:security/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  "rules": {
    "security/detect-object-injection": "error",
    "jsx-a11y/alt-text": "error"
  }
}
```

---

## 📋 Checklist de Implementação

### **Esta Semana**
- [ ] Integrar orquestrador ao wizard
- [ ] Corrigir configuração Firebase  
- [ ] Implementar clientes LLM reais
- [ ] Adicionar validação Zod

### **Próxima Semana**
- [ ] Implementar error tracking
- [ ] Otimizar bundle size
- [ ] Adicionar cache inteligente
- [ ] Implementar analytics básico

### **Próximo Mês**
- [ ] Adicionar PWA
- [ ] Implementar testes
- [ ] Melhorar linting
- [ ] Documentação completa

---

## 🎯 Resultado Esperado

Após implementar essas melhorias:

1. **Performance**: 40% mais rápido
2. **Confiabilidade**: 95% uptime
3. **UX**: Fluxo 100% funcional
4. **Manutenibilidade**: Código mais limpo
5. **Escalabilidade**: Pronto para 1000+ usuários

**Tempo estimado total**: 2-3 semanas
**Prioridade**: Implementar na ordem listada