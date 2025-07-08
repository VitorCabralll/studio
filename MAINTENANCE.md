# 🔧 MAINTENANCE - Template para Correções e Otimizações LexAI

## PROBLEMA/OTIMIZAÇÃO:

**Tipo**: [ ] Bug Fix [ ] Optimization [ ] Refactor [ ] Security Fix

**Descrição**:
[Descreva o problema específico ou área que precisa de otimização]

**Impacto Atual**:
- Performance: [impacto na performance]
- UX: [impacto na experiência do usuário] 
- Segurança: [questões de segurança]
- Manutenibilidade: [dificuldades de manutenção]

## ARQUIVOS AFETADOS:

**Modificados no Git Status**:
```
M src/contexts/workspace-context.tsx
M src/services/agent-service.ts
M src/services/data-cleanup.ts
M src/services/document-processor.ts
M src/services/privacy-enforcer.ts
M src/services/user-service.ts
```

**Relacionados**:
- [Lista outros arquivos que podem ser impactados]

## CONTEXTO TÉCNICO EXISTENTE:

**Arquitetura LexAI**:
- 🧠 **AI Orchestrator**: Pipeline multi-LLM (Google, OpenAI, Anthropic)
- ⚛️ **Frontend**: Next.js 14 + shadcn/ui + Tailwind
- 🔥 **Backend**: Firebase (Auth, Firestore, Storage)
- 🎯 **Foco**: Privacidade, processamento local, OCR offline

**Padrões Estabelecidos**:
- TypeScript rigoroso + Zod validation
- Error boundaries para componentes críticos
- Service layer para abstração Firebase
- Hooks customizados para lógica complexa
- Lazy loading para performance

**Convenções Atuais**:
- Prefixo `🛡️` para logs de segurança
- Validação JWT antes de operações Firestore
- Namespace staging para ambientes de teste
- Error handling centralizado com logging

## ERRO/PROBLEMA ESPECÍFICO:

**Sintomas Observados**:
[Descreva exatamente o que está acontecendo]

**Reprodução**:
1. [Passos para reproduzir]
2. [...]

**Logs/Erros**:
```
[Cole logs relevantes aqui]
```

**Hipótese da Causa**:
[Sua teoria sobre o que está causando o problema]

## OTIMIZAÇÃO DESEJADA:

**Objetivo**:
[O que você quer melhorar - performance, segurança, UX, etc.]

**Métricas Atuais**:
- [Performance atual]
- [Métricas relevantes]

**Meta Esperada**:
- [Melhoria esperada com números]

## RESTRIÇÕES & CUIDADOS:

**⚠️ Não Quebrar**:
- Pipeline de IA existente
- Autenticação/autorização Firebase
- Processamento OCR offline
- Dados de usuários existentes

**🛡️ Manter Segurança**:
- Validação JWT
- Isolamento por workspace
- Processamento local de documentos
- Logs de auditoria

**📱 Compatibilidade**:
- Mobile-first design
- PWA functionality
- Offline capabilities

## COMANDOS DE VALIDAÇÃO:

```bash
# Desenvolvimento
npm run dev
npm run typecheck
npm run lint

# Firebase
firebase emulators:start
firebase deploy --only hosting

# Testes
[comandos de teste específicos do projeto]
```

## EXEMPLOS DE IMPLEMENTAÇÃO:

**Patterns Existentes para Seguir**:
- `src/services/` - Padrão service layer
- `src/hooks/` - Hooks customizados  
- `src/components/ui/` - Componentes shadcn/ui
- `src/ai/orchestrator/` - Pipeline IA

**Anti-Patterns a Evitar**:
- Quebrar isolamento por workspace
- Expor dados sensíveis em logs
- Bypass de validação JWT
- Operações Firestore sem error handling

---

## 🎯 CHECKLIST FINAL:

- [ ] Problem/optimization clearly defined
- [ ] Related files identified
- [ ] Current patterns understood
- [ ] Security implications considered
- [ ] Performance impact evaluated
- [ ] Backward compatibility ensured
- [ ] Testing strategy defined
- [ ] Rollback plan ready

---

*Template para manutenção LexAI | Context Engineering*