# 📋 PLANO DE UNIFICAÇÃO DE AUTENTICAÇÃO - LexAI

## 🎯 OBJETIVO
Unificar os dois sistemas de autenticação em um único sistema robusto e confiável.

## 🔄 ESTRATÉGIA
**Evoluir `use-simple-auth.tsx`** adicionando features importantes do sistema complexo, depois migrar todos os arquivos.

## 📝 PLANO DE EXECUÇÃO

### **ETAPA 1: APRIMORAR SISTEMA SIMPLES** (5 min)
1. **Adicionar features do sistema complexo**:
   - ✅ Alias `userProfile` para compatibilidade
   - ✅ Reset de senha (`resetPassword`)
   - ✅ Tratamento de erros robusto
   - ✅ Router integration para logout
   - ✅ Flag `isInitialized`
   - ✅ Função `clearError`
   - ✅ Função `updateUserProfileState`

2. **Melhorar tipos**:
   - ✅ Interface `AuthError` padronizada
   - ✅ Compatibilidade com código existente

### **ETAPA 2: MIGRAR ARQUIVOS CRÍTICOS** (10 min)
1. **Componentes de autenticação**:
   - ✅ `forgot-password-form.tsx` → `useSimpleAuth`
   - ✅ `auth-error-boundary.tsx` → `useSimpleAuth`

2. **Layout e navegação**:
   - ✅ `header.tsx` → `useSimpleAuth`
   - ✅ `auth-debug.tsx` → `useSimpleAuth`

3. **Páginas principais**:
   - ✅ `onboarding/page.tsx` → `useSimpleAuth`
   - ✅ `settings/page.tsx` → `useSimpleAuth`
   - ✅ `workspace/page.tsx` → `useSimpleAuth`
   - ✅ `agente/criar/CriarAgenteClient.tsx` → `useSimpleAuth`

4. **Hooks dependentes**:
   - ✅ `use-storage.tsx` → `useSimpleAuth`
   - ✅ `use-document-processor.tsx` → `useSimpleAuth`

### **ETAPA 3: LIMPEZA E OTIMIZAÇÃO** (5 min)
1. **Remover arquivos obsoletos**:
   - ❌ `use-auth.tsx` → DELETE
   - ❌ Referências ao AuthCoordinator

2. **Atualizar imports**:
   - ✅ Criar alias `useAuth` para `useSimpleAuth`
   - ✅ Garantir compatibilidade total

3. **Validar tipos**:
   - ✅ Verificar TypeScript errors
   - ✅ Testar build

### **ETAPA 4: TESTES E VALIDAÇÃO** (5 min)
1. **Testes funcionais**:
   - ✅ Login/logout
   - ✅ Cadastro
   - ✅ Reset senha
   - ✅ Google OAuth
   - ✅ Navegação entre páginas

2. **Testes de integração**:
   - ✅ Profile loading
   - ✅ Workspace access
   - ✅ File upload
   - ✅ Document processing

## 📊 ARQUIVOS PARA MIGRAR

### **PRIORIDADE ALTA** (Quebram funcionalidade)
1. `src/components/auth/forgot-password-form.tsx`
2. `src/components/layout/header.tsx`
3. `src/app/onboarding/page.tsx`
4. `src/app/settings/page.tsx`
5. `src/app/workspace/page.tsx`

### **PRIORIDADE MÉDIA** (Impactam UX)
1. `src/components/auth/auth-error-boundary.tsx`
2. `src/components/debug/auth-debug.tsx`
3. `src/hooks/use-storage.tsx`
4. `src/hooks/use-document-processor.tsx`

### **PRIORIDADE BAIXA** (Podem ficar para depois)
1. `src/app/agente/criar/CriarAgenteClient.tsx`
2. `src/app/onboarding/success/page.tsx`

## 🔧 TEMPLATE DE MIGRAÇÃO

### **ANTES:**
```typescript
import { useAuth } from '@/hooks/use-auth';

const { user, userProfile, loading, error, updateUserProfileState } = useAuth();
```

### **DEPOIS:**
```typescript
import { useSimpleAuth as useAuth } from '@/hooks/use-simple-auth';

const { user, userProfile, loading, error, updateUserProfileState } = useAuth();
```

## ⚠️ PONTOS DE ATENÇÃO

1. **Compatibilidade**: Garantir que todas as props usadas existem
2. **Tipos**: Verificar se interfaces são compatíveis
3. **Timing**: Testar se não há race conditions
4. **Performance**: Verificar se não há re-renders desnecessários

## 📋 CHECKLIST DE VALIDAÇÃO

### **Funcionalidades Básicas**
- [ ] Login com email/senha
- [ ] Cadastro de usuário
- [ ] Login com Google
- [ ] Logout
- [ ] Reset de senha
- [ ] Carregamento de perfil
- [ ] Atualização de perfil

### **Integrações**
- [ ] Workspace loading
- [ ] File upload
- [ ] Document processing
- [ ] Navigation guards
- [ ] Error boundaries

### **Qualidade**
- [ ] Zero TypeScript errors
- [ ] Build success
- [ ] Lint success
- [ ] No console errors
- [ ] Performance OK

## 🚀 RESULTADO ESPERADO

Após execução do plano:
- ✅ Sistema de auth unificado
- ✅ Zero conflitos entre sistemas
- ✅ Código mais limpo e maintível
- ✅ Melhor performance
- ✅ Debugging mais fácil
- ✅ Compatibilidade total

## 📈 CRONOGRAMA

- **Tempo total**: 25 minutos
- **Etapa 1**: 5 min (Aprimorar sistema)
- **Etapa 2**: 10 min (Migrar arquivos)
- **Etapa 3**: 5 min (Limpeza)
- **Etapa 4**: 5 min (Validação)

---

**Status**: PLANEJADO ✅
**Próximo passo**: Execução da Etapa 1