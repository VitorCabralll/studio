# 🚀 Plano de Integração - LexAI

## 📊 **Situação Atual Identificada**

### ✅ **O QUE JÁ EXISTE**
- **Frontend completo**: Wizard de geração implementado (`wizard.tsx`)
- **Orquestrador completo**: Pipeline multi-LLM implementado (`src/ai/orchestrator/`)
- **APIs funcionais**: Google AI + OpenAI configuradas e testadas
- **Firebase configurado**: Emulators e infraestrutura prontos

### ❌ **O QUE ESTÁ FALTANDO**
- **API Routes**: Nenhuma rota Next.js para conectar frontend ao orquestrador
- **Integração**: Frontend usa dados mock em vez do orquestrador real

### 🔍 **Evidência do Problema**
```typescript
// wizard.tsx linhas 138-139, 145-146
// result = await contextualDocumentGeneration(input);
result = { document: `Documento gerado com anexos para: ${input.instructions}` };
```
**Chamadas reais comentadas, usando mock data!**

---

## 🎯 **Plano de Ação Prioritizado**

### **ETAPA 1: Criar API Routes** (CRÍTICO)
**Objetivo**: Criar ponte entre frontend e orquestrador sem alterar lógica existente

**Implementação**:
```
src/app/api/
├── generate/
│   └── route.ts          # POST /api/generate
├── orchestrator/
│   ├── route.ts          # GET /api/orchestrator (status)
│   └── test/route.ts     # POST /api/orchestrator/test
└── agents/
    └── route.ts          # GET /api/agents (lista agentes)
```

**API Principal**: `POST /api/generate`
- Recebe: `{ instructions, attachments, agent, mode }`
- Processa: Via orquestrador existente
- Retorna: `{ document, metadata, cost }`

### **ETAPA 2: Conectar Frontend** (CRÍTICO)
**Objetivo**: Substituir mocks por chamadas reais

**Alterações no `wizard.tsx`**:
- Substituir mock data por `fetch('/api/generate')`
- Manter toda UI e lógica existente
- Apenas trocar fonte dos dados

### **ETAPA 3: Teste End-to-End** (VALIDAÇÃO)
**Objetivo**: Validar fluxo completo funcional

**Teste**:
1. Frontend → API Route → Orquestrador → IA → Response
2. Verificar documentos gerados
3. Confirmar métricas e custos

---

## 🔧 **Especificações Técnicas**

### **API Route Principal**
```typescript
// src/app/api/generate/route.ts
POST /api/generate
{
  "instructions": string,
  "attachments"?: File[],
  "agent": "geral" | "civil" | "stj",
  "mode": "outline" | "full"
}

Response:
{
  "success": boolean,
  "document": string,
  "metadata": {
    "processingTime": number,
    "cost": number,
    "confidence": number
  }
}
```

### **Integração com Orquestrador**
```typescript
import { generateDocument } from '@/ai/orchestrator';

const input = {
  taskType: 'document_generation',
  documentType: mode === 'outline' ? 'brief' : 'petition',
  instructions,
  context: processedAttachments
};

const result = await generateDocument(input);
```

---

## ⚠️ **Princípios de Implementação**

### **NÃO ALTERAR**
- ❌ Lógica do orquestrador
- ❌ Configurações das APIs
- ❌ UI/UX do frontend
- ❌ Estrutura de dados existente

### **APENAS CRIAR**
- ✅ API routes como interface
- ✅ Adaptadores de dados
- ✅ Error handling
- ✅ Logs de integração

---

## 📈 **Resultado Esperado**

Após implementação:
- **Frontend funcional**: Wizard gera documentos reais
- **Orquestrador ativo**: Pipeline processando via APIs
- **Sistema integrado**: End-to-end funcional
- **Zero breaking changes**: Nada quebra, apenas conecta

---

## 🚀 **Próximo Passo**

**IMPLEMENTAR**: API Routes para conectar frontend ao orquestrador
- Começar com `src/app/api/generate/route.ts`
- Testar com dados simples
- Evoluir gradualmente