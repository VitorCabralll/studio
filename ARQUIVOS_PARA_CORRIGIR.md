# 🔧 Arquivos Específicos para Corrigir

## 1. **src/app/generate/components/wizard.tsx**

### Problemas Encontrados:
- Funções de IA comentadas (usando mocks)
- Falta integração com orquestrador
- Processamento de arquivos incompleto

### Correções Necessárias:
```typescript
// LINHA 15-20: Descomentar imports reais
import { generateDocumentOutline, GenerateDocumentOutlineInput } from '@/ai/flows/generate-document-outline';
import { contextualDocumentGeneration, ContextualDocumentGenerationInput } from '@/ai/flows/contextual-document-generation';

// LINHA 150-170: Substituir mocks por chamadas reais
const handleGenerate = async () => {
  // ... código existente ...
  
  try {
    let result;
    
    if (files.length > 0) {
      const attachmentDataUris = await Promise.all(files.map(fileToDataUri));
      const input: ContextualDocumentGenerationInput = {
        instructions: enhancedInstructions,
        attachmentDataUris,
      };
      result = await contextualDocumentGeneration(input); // DESCOMENTAR
    } else {
      const input: GenerateDocumentOutlineInput = {
        instructions: enhancedInstructions,
        format: generationMode,
      };
      result = await generateDocumentOutline(input); // DESCOMENTAR
    }
    
    // REMOVER linhas de mock:
    // result = { document: `Documento gerado...` };
  }
};
```

---

## 2. **src/lib/firebase.ts**

### Problemas Encontrados:
- Fallbacks inseguros para configuração
- Validação inadequada
- Possível exposição de dados sensíveis

### Correções Necessárias:
```typescript
// SUBSTITUIR todo o arquivo:
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";

// Validação rigorosa de configuração
const validateEnvVar = (name: string, value: string | undefined): string => {
  if (!value || value.startsWith('your-')) {
    throw new Error(`❌ Variável de ambiente ${name} não configurada corretamente`);
  }
  return value;
};

const firebaseConfig = {
  apiKey: validateEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY', process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: validateEnvVar('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: validateEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = true; // Se chegou aqui, está configurado

// Initialize Firebase
export const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics apenas em produção
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  getAnalytics(firebaseApp);
}
```

---

## 3. **src/ai/orchestrator/router.ts**

### Problema:
- Arquivo existe mas está vazio/incompleto

### Correção Necessária:
```typescript
// CRIAR conteúdo completo:
import { LLMConfig, RoutingDecision, ProcessingInput, RoutingCriteria } from './types';

export class LLMRouter {
  private llmConfigs: LLMConfig[];

  constructor(configs: LLMConfig[]) {
    this.llmConfigs = configs;
  }

  async selectLLM(input: ProcessingInput): Promise<RoutingDecision> {
    const criteria = this.buildRoutingCriteria(input);
    const candidates = this.filterCandidates(criteria);
    const selected = this.scoreAndSelect(candidates, criteria);
    
    return {
      selectedLLM: selected,
      reasoning: this.buildReasoning(selected, criteria),
      confidence: this.calculateConfidence(selected, criteria),
      alternatives: candidates.filter(c => c !== selected),
      estimatedCost: this.estimateCost(selected, input),
      estimatedLatency: selected.performance.averageLatency
    };
  }

  private buildRoutingCriteria(input: ProcessingInput): RoutingCriteria {
    // Lógica para determinar critérios baseado no input
    return {
      taskComplexity: this.assessComplexity(input),
      qualityRequirement: this.assessQualityNeeds(input),
      latencyRequirement: 'balanced',
      costBudget: 'medium'
    };
  }

  private filterCandidates(criteria: RoutingCriteria): LLMConfig[] {
    return this.llmConfigs.filter(llm => 
      llm.capabilities.specializations.includes(criteria.specialization || 'document_generation')
    );
  }

  private scoreAndSelect(candidates: LLMConfig[], criteria: RoutingCriteria): LLMConfig {
    // Algoritmo de scoring baseado em critérios
    const scored = candidates.map(llm => ({
      llm,
      score: this.calculateScore(llm, criteria)
    }));

    return scored.sort((a, b) => b.score - a.score)[0].llm;
  }

  private calculateScore(llm: LLMConfig, criteria: RoutingCriteria): number {
    let score = 0;
    
    // Qualidade (40% do peso)
    score += llm.capabilities.qualityRating * 0.4;
    
    // Custo (30% do peso) - inverso
    const costScore = 1 / (llm.costs.inputTokenPrice + llm.costs.outputTokenPrice);
    score += costScore * 0.3;
    
    // Performance (30% do peso)
    const perfScore = 1 / llm.performance.averageLatency * 1000; // Normalizar
    score += perfScore * 0.3;
    
    return score;
  }

  private assessComplexity(input: ProcessingInput): 'low' | 'medium' | 'high' {
    const instructionLength = input.instructions.length;
    const contextSize = input.context.length;
    
    if (instructionLength > 1000 || contextSize > 5) return 'high';
    if (instructionLength > 500 || contextSize > 2) return 'medium';
    return 'low';
  }

  private assessQualityNeeds(input: ProcessingInput): 'draft' | 'standard' | 'premium' {
    // Documentos críticos precisam de qualidade premium
    const criticalTypes = ['petition', 'contract', 'legal_opinion'];
    if (criticalTypes.includes(input.documentType)) return 'premium';
    
    return 'standard';
  }

  private buildReasoning(selected: LLMConfig, criteria: RoutingCriteria): string {
    return `Selecionado ${selected.provider}/${selected.model} para ${criteria.taskComplexity} complexidade, ${criteria.qualityRequirement} qualidade`;
  }

  private calculateConfidence(selected: LLMConfig, criteria: RoutingCriteria): number {
    return selected.performance.reliability;
  }

  private estimateCost(llm: LLMConfig, input: ProcessingInput): number {
    const estimatedTokens = input.instructions.length / 4; // ~4 chars per token
    return estimatedTokens * (llm.costs.inputTokenPrice + llm.costs.outputTokenPrice) / 1000;
  }
}
```

---

## 4. **src/components/file-upload.tsx**

### Problemas Encontrados:
- Import dinâmico sem `ssr: false`
- Pode causar hydration mismatch

### Correção Aplicada:
```typescript
// LINHA 15: Adicionar ssr: false
const OCRProcessor = dynamic(
  () => import('@/components/ocr/ocr-processor').then(mod => ({ default: mod.OCRProcessor })),
  {
    ssr: false, // ✅ ADICIONADO
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-sm text-muted-foreground">Carregando OCR...</div>
      </div>
    ),
  }
);
```

---

## 5. **src/services/user-service.ts**

### Problemas Encontrados:
- Validação de entrada básica
- Tratamento de erro pode ser melhorado
- Falta sanitização de dados

### Correções Necessárias:
```typescript
// ADICIONAR no início do arquivo:
import { z } from 'zod';

// ADICIONAR schemas de validação:
const WorkspaceSchema = z.object({
  name: z.string().min(1, 'Nome do workspace é obrigatório').max(100),
  members: z.number().optional(),
  isOwner: z.boolean().optional()
});

const UserProfileSchema = z.object({
  cargo: z.string().min(1, 'Cargo é obrigatório'),
  areas_atuacao: z.array(z.string()).min(1, 'Selecione pelo menos uma área'),
  primeiro_acesso: z.boolean(),
  initial_setup_complete: z.boolean(),
  data_criacao: z.union([z.date(), z.instanceof(Timestamp)]),
  workspaces: z.array(WorkspaceSchema).optional()
});

// MODIFICAR funções para usar validação:
export async function createUserProfile(
  uid: string,
  data: unknown
): Promise<ServiceResult<UserProfile>> {
  try {
    // Validar entrada
    const validatedData = UserProfileSchema.parse(data);
    
    // ... resto da função
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        data: null,
        error: {
          code: 'validation-error',
          message: 'Dados inválidos',
          details: error.errors.map(e => e.message).join(', ')
        },
        success: false
      };
    }
    // ... resto do tratamento
  }
}
```

---

## 6. **src/hooks/use-auth.tsx**

### Problemas Encontrados:
- Lógica de mock pode confundir em produção
- Falta tratamento de edge cases

### Correções Necessárias:
```typescript
// LINHA 25-30: Melhorar detecção de ambiente
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const USE_MOCK_AUTH = IS_DEVELOPMENT && !isFirebaseConfigured;

// LINHA 50-60: Adicionar logs mais claros
const login = () => {
  if (USE_MOCK_AUTH) {
    console.log('🔧 Usando autenticação mock (desenvolvimento)');
    setLoading(true);
    // ... resto do código mock
  } else {
    console.log('🔐 Usando Firebase Auth (produção)');
    // Implementar login real
  }
};

// ADICIONAR função de cleanup
useEffect(() => {
  return () => {
    // Cleanup subscriptions
    if (typeof window !== 'undefined') {
      // Limpar listeners
    }
  };
}, []);
```

---

## 7. **package.json**

### Melhorias Recomendadas:
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "analyze": "ANALYZE=true npm run build"
  },
  "dependencies": {
    // ADICIONAR:
    "zod": "^3.24.2",
    "@sentry/nextjs": "^8.0.0"
  },
  "devDependencies": {
    // ADICIONAR:
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "jest": "^29.0.0",
    "@next/bundle-analyzer": "^15.0.0"
  }
}
```

---

## 📋 Ordem de Implementação

1. **src/lib/firebase.ts** (crítico)
2. **src/ai/orchestrator/router.ts** (crítico)  
3. **src/app/generate/components/wizard.tsx** (crítico)
4. **src/services/user-service.ts** (importante)
5. **src/hooks/use-auth.tsx** (importante)
6. **package.json** (melhorias)

**Tempo estimado**: 1-2 dias para correções críticas