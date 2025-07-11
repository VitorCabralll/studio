name: "LexAI Feature Implementation"
description: |

## Purpose
Template específico para implementação de features no LexAI, otimizado para coordenação Gemini CLI + Claude Code.

## Core Principles
1. **Context is King**: Incluir TODA documentação necessária do LexAI
2. **Validation Loops**: Comandos executáveis para validação contínua
3. **LexAI Patterns**: Usar padrões estabelecidos no projeto
4. **Progressive Success**: Implementação incremental com validação

---

## Goal
[Descrever o objetivo específico da feature]

## Why
- **Business value**: [Valor de negócio]
- **Integration**: [Como se integra com LexAI existente]
- **Problems solved**: [Problemas que resolve]

## What
[Descrição detalhada da implementação]

### Success Criteria
- [ ] [Critério 1]
- [ ] [Critério 2]
- [ ] [Critério 3]
- [ ] Todos os testes passam
- [ ] Build de produção funciona
- [ ] Integração com orquestrador mantida

## All Needed Context

### LexAI Architecture Context
```yaml
# MUST READ - Arquitetura do LexAI
- file: src/ai/orchestrator/types.ts
  why: Tipos e interfaces do orquestrador multi-LLM
  
- file: src/ai/orchestrator/orchestrator-lazy.ts
  why: Implementação lazy do orquestrador
  
- file: src/lib/firebase.ts
  why: Configuração Firebase e padrões de autenticação
  
- file: src/app/layout.tsx
  why: Layout principal e providers
  
- file: package.json
  why: Dependências e scripts disponíveis
  
- file: tailwind.config.ts
  why: Configuração de design system
```

### Current Codebase Context
```bash
# Estrutura principal do LexAI
src/
├── ai/orchestrator/          # Sistema multi-LLM
├── app/                      # Next.js 15 App Router
├── components/               # Componentes React
│   ├── ui/                  # shadcn/ui components
│   ├── auth/                # Componentes de autenticação
│   └── landing/             # Landing page
├── hooks/                   # Hooks customizados
├── lib/                     # Utilitários e configurações
└── services/                # Lógica de negócio
```

### LexAI Patterns & Conventions
```typescript
// CRITICAL: Padrões estabelecidos no LexAI

// 1. Orquestrador Multi-LLM
import { generateDocument } from '@/ai/orchestrator/orchestrator-lazy';

// 2. Firebase Integration
import { auth, db } from '@/lib/firebase';

// 3. Component Pattern
import { Button } from '@/components/ui/button';

// 4. Hook Pattern
import { useAuth } from '@/hooks/use-auth';

// 5. API Route Pattern (Next.js 15)
export async function POST(request: Request) {
  // Implementation
}

// 6. Type Safety
import type { ProcessingInput, ProcessingOutput } from '@/ai/orchestrator/types';
```

### Known Gotchas & LexAI Quirks
```typescript
// CRITICAL: LexAI specific considerations

// 1. Orquestrador é lazy-loaded para performance
const orchestrator = await import('@/ai/orchestrator/orchestrator-lazy');

// 2. Firebase Auth deve usar o contexto existente
const { user } = useAuth(); // Não criar nova instância

// 3. Componentes UI seguem shadcn/ui pattern
// Sempre usar os componentes de @/components/ui/

// 4. TypeScript strict mode ativo
// Todos os tipos devem ser explícitos

// 5. Next.js 15 App Router
// Server Components por padrão, use 'use client' quando necessário
```

### List of tasks to be completed
```yaml
Task 1: [Nome da tarefa]
PATTERN: [Padrão a seguir do LexAI]
IMPLEMENTATION:
  - [Passo específico]
  - [Outro passo]
VALIDATION:
  - [Como validar]

Task 2: [Próxima tarefa]
# ... continuar
```

### Per task implementation details
```typescript
// Task 1: Exemplo de implementação
// PATTERN: Seguir padrão de [componente/hook/service] existente

// Estrutura esperada:
export interface [InterfaceName] {
  // Definir interface seguindo padrões do types.ts
}

export function [ComponentName]() {
  // PATTERN: Usar hooks existentes do LexAI
  const { user } = useAuth();
  
  // PATTERN: Integrar com orquestrador se necessário
  const handleProcess = async () => {
    const result = await generateDocument(input);
  };
  
  return (
    // PATTERN: Usar componentes UI existentes
    <div className="...">
      <Button onClick={handleProcess}>
        Processar
      </Button>
    </div>
  );
}
```

## Validation Loop

### Level 1: LexAI Standards
```bash
# MUST PASS - Padrões do LexAI
npm run typecheck          # TypeScript strict mode
npm run lint              # ESLint + regras do projeto
npm run build             # Build Next.js 15

# Expected: No errors. Se houver erros, corrigir antes de prosseguir.
```

### Level 2: Integration Tests
```typescript
// Testes específicos para integração com LexAI

// 1. Teste de integração com orquestrador
async function testOrchestratorIntegration() {
  const input: ProcessingInput = {
    taskType: 'document_generation',
    documentType: 'petition',
    instructions: 'Test',
    context: []
  };
  
  const result = await generateDocument(input);
  assert(result.success);
}

// 2. Teste de autenticação Firebase
function testFirebaseAuth() {
  const { user } = useAuth();
  assert(user !== null);
}

// 3. Teste de componentes UI
function testUIComponents() {
  render(<YourComponent />);
  // Verificar renderização correta
}
```

### Level 3: LexAI Feature Test
```bash
# Teste da feature no contexto do LexAI
npm run dev

# Verificar:
# 1. Feature funciona na interface
# 2. Integração com orquestrador OK
# 3. Autenticação mantida
# 4. Performance adequada
# 5. Responsividade mobile
```

## Final Validation Checklist
- [ ] TypeScript: `npm run typecheck` passa
- [ ] Linting: `npm run lint` passa  
- [ ] Build: `npm run build` passa
- [ ] Feature funciona conforme especificado
- [ ] Integração com orquestrador mantida
- [ ] Autenticação Firebase funciona
- [ ] Componentes UI seguem design system
- [ ] Responsivo em mobile
- [ ] Performance adequada
- [ ] Documentação atualizada se necessário

---

## Anti-Patterns to Avoid
- ❌ Não quebrar integração com orquestrador existente
- ❌ Não criar nova instância de Firebase Auth
- ❌ Não ignorar TypeScript strict mode
- ❌ Não usar componentes UI fora do design system
- ❌ Não implementar sem considerar mobile
- ❌ Não esquecer de lazy loading quando apropriado

## Confidence Score: [X]/10

[Justificativa do score baseado na complexidade e contexto fornecido]