# PRP - Correção Problemas de Autenticação LexAI

## 🎯 Objetivo da Manutenção

**Tipo**: Bug Fix + Security Enhancement

**Descrição do Problema**:
Múltiplos problemas na autenticação causando falhas em login, cadastro e permissões. Usuários relatam erros constantes e dificuldade para acessar o sistema.

**Arquivos Impactados**:
```
M src/contexts/workspace-context.tsx
M src/services/user-service.ts
M src/hooks/use-auth.tsx
M src/lib/firebase.ts
M src/lib/auth-errors.ts (relacionado)
```

## 📚 Contexto Completo LexAI

### Problemas Identificados na Análise

#### 🚨 **CRÍTICO - Timing Issues na Autenticação**
1. **JWT Token Race Condition**: 
   - `workspace-context.tsx:19` força refresh do token mas pode executar antes do login estar completo
   - `use-auth.tsx:96` obtém token para debug mas não aguarda propagação
   - `user-service.ts:153` força refresh mas sem retry em caso de falha

2. **Profile Loading Race Condition**:
   - `use-auth.tsx:121` carrega perfil imediatamente após auth state change
   - `user-service.ts:198` cria perfil padrão mas pode falhar por permission timing
   - Retry automático está configurado mas inconsistente

#### 🔥 **Auth State Management Issues**
1. **Error Handling Inconsistente**:
   - `use-auth.tsx:135` parseAuthError usado mas não trata casos específicos do LexAI
   - `user-service.ts:20` createServiceError genérico demais
   - Firebase permission-denied não é diferenciado de outros erros

2. **Profile Creation Conflicts**:
   - `user-service.ts:197-232` cria perfil padrão quando documento não existe
   - Mas pode falhar se perfil já está sendo criado por outro processo
   - Não há lock mechanism

#### ⚙️ **Firebase Configuration Issues**
1. **Network/Firestore Setup**:
   - `firebase.ts:58` enableNetwork pode falhar silenciosamente
   - Não há validação se Firestore rules estão corretas
   - Missing connection health check

### Arquitetura Auth Atual
```typescript
Flow Problemático Atual:
1. User faz login → Firebase Auth
2. onAuthStateChanged dispara → use-auth.tsx:85
3. loadUserProfile chamado imediatamente → use-auth.tsx:121
4. getUserProfile força token refresh → user-service.ts:153
5. Firestore query pode falhar por permission-denied → timing issue
6. Retry automático inconsistente entre componentes
```

### Dependências Críticas
```json
{
  "firebase": "^10.x" - Auth, Firestore
  "@firebase/auth": "Token/JWT handling",
  "@firebase/firestore": "Security rules + queries"
}
```

## 🔍 Root Cause Analysis

### Sintomas Observados
- ❌ Login aparenta sucesso mas falha carregando perfil
- ❌ Cadastro cria usuário no Firebase Auth mas não cria documento Firestore
- ❌ Permission denied intermitente mesmo com usuário autenticado
- ❌ Multiple retry attempts causando conflitos
- ❌ Error states inconsistentes entre componentes

### Problemas Identificados

#### 1. **Token Propagation Race Condition**
```typescript
// PROBLEMA EM user-service.ts:153
await currentUser.getIdToken(true); // Força refresh
// MAS: Não aguarda propagação para Firestore security rules
// Firestore pode ainda ter token antigo cached
```

#### 2. **Concurrent Profile Creation**
```typescript
// PROBLEMA EM user-service.ts:208
const createResult = await createUserProfile(uid, defaultProfile);
// MAS: Se múltiplos componentes chamam getUserProfile simultaneamente
// Pode tentar criar o mesmo perfil múltiplas vezes
```

#### 3. **Inconsistent Error Recovery**
```typescript
// PROBLEMA: Retry logic está espalhado e inconsistente
// use-auth.tsx:147 - Retry em timeout
// user-service.ts:90 - Retry em getUserProfileWithRetry  
// workspace-context.tsx:19 - Força token mas sem retry
```

## 🛠️ Solução Proposta

### Estratégia: **Coordinated Auth Flow com Proper Timing**

#### 1. **Implementar Auth State Coordinator**
```typescript
// CRIAR: src/lib/auth-coordinator.ts
export class AuthCoordinator {
  private static authStateReady = false;
  private static tokenValidated = false;
  
  static async waitForAuthReady(): Promise<boolean> {
    // Aguarda auth state + token propagation
  }
  
  static async validateTokenPropagation(): Promise<boolean> {
    // Valida se token propagou para Firestore
  }
}
```

#### 2. **Fix Profile Loading Race Condition**
```typescript
// MODIFICAR: src/hooks/use-auth.tsx
const loadUserProfile = async (user: User): Promise<UserProfile | null> => {
  // ADICIONAR: Aguardar token propagation
  await AuthCoordinator.waitForAuthReady();
  
  // ADICIONAR: Single profile loading lock
  if (profileLoadingRef.current) {
    return profileLoadingRef.current;
  }
  
  profileLoadingRef.current = getUserProfile(user.uid);
  try {
    const result = await profileLoadingRef.current;
    return result;
  } finally {
    profileLoadingRef.current = null;
  }
};
```

#### 3. **Implement Firestore Token Sync Check**
```typescript
// MODIFICAR: src/services/user-service.ts
async function validateFirestoreTokenSync(): Promise<boolean> {
  try {
    // Test query que requer auth para verificar se token propagou
    const testRef = doc(getFirebaseDb(), '_auth_test', 'test');
    await getDoc(testRef);
    return true;
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      return false; // Token ainda não propagou
    }
    throw error; // Outro tipo de erro
  }
}
```

#### 4. **Unified Error Handling Strategy**
```typescript
// MODIFICAR: src/lib/auth-errors.ts
export interface AuthFlowError extends AuthError {
  category: 'auth' | 'profile' | 'permission' | 'network';
  retryable: boolean;
  retryStrategy?: 'immediate' | 'delayed' | 'exponential';
}

export function categorizeAuthError(error: unknown): AuthFlowError {
  // Categorizar erros específicos do LexAI flow
}
```

### Integration Points
```yaml
Firebase Auth:
  - Token refresh timing coordinated
  - Auth state change handling unified
  - Error categorization improved

Firestore:
  - Token propagation validation
  - Profile creation locking
  - Permission error differentiation

React State:
  - Loading states coordinated
  - Error recovery unified
  - Profile loading deduplicated
```

## ✅ Validation & Testing

### Level 1: Auth Flow Testing
```typescript
// CRIAR: tests/auth-flow.test.ts
describe('Auth Flow Integration', () => {
  it('should handle login → profile load without race condition', async () => {
    // Test complete flow sem timing issues
  });

  it('should retry profile creation on permission denied', async () => {
    // Test retry mechanism
  });

  it('should not create duplicate profiles', async () => {
    // Test concurrent profile creation
  });
});
```

### Level 2: Manual Testing Scenarios
```bash
# Test Cases para reproduzir problemas atuais
1. Login rápido múltiplos clicks
2. Cadastro + login imediato  
3. Network intermitente durante auth
4. Multiple tabs login simultâneo
5. Refresh page durante profile loading
```

### Level 3: Integration with Firebase
```bash
# Validar integração Firebase
1. Firebase Auth emulator funcional
2. Firestore rules permitindo operações corretas
3. Token propagation timing adequado
4. Error logs não mostram permission denied spurious
```

## 🎯 Success Criteria

### Functional Requirements
- [ ] Login/signup funcionam consistentemente sem falhas de timing
- [ ] Profile loading nunca tenta criar duplicates
- [ ] Permission denied errors eliminados (exceto casos legítimos)
- [ ] Error recovery é uniforme e predictable

### Non-Functional Requirements  
- [ ] Auth flow completo < 3 segundos
- [ ] Zero race conditions em concurrent operations
- [ ] Error messages são específicos e actionable
- [ ] Retry logic é coordenado, não duplicado

### Performance Metrics
```yaml
Current Issues:
  - permission-denied: ~30% das auth operations
  - profile loading failures: ~15%
  - duplicate profile creation attempts: ~5%

Target (After Fix):
  - permission-denied: <2% (apenas casos legítimos)
  - profile loading failures: <3%
  - duplicate profile creation: 0%
```

## 🚨 Implementation Plan

### Phase 1: Coordination Layer
```typescript
// 1. Criar AuthCoordinator
// 2. Implementar token propagation validation
// 3. Add profile loading lock mechanism
```

### Phase 2: Fix Race Conditions
```typescript  
// 1. Modificar use-auth.tsx com proper timing
// 2. Fix user-service.ts concurrent creation
// 3. Coordenar workspace-context.tsx token validation
```

### Phase 3: Error Handling Unification
```typescript
// 1. Extend auth-errors.ts com categorização
// 2. Implement unified retry strategies
// 3. Add proper error recovery flows
```

### Phase 4: Testing & Validation
```bash
# 1. Unit tests para race conditions
# 2. Integration tests com Firebase
# 3. Manual testing scenarios
# 4. Performance validation
```

## 📋 Implementation Checklist

### Pre-Implementation
- [ ] Backup current auth implementation
- [ ] Document current error patterns
- [ ] Setup test scenarios to reproduce issues

### During Implementation  
- [ ] AuthCoordinator com proper timing controls
- [ ] Profile loading deduplication
- [ ] Token propagation validation
- [ ] Unified error handling

### Post-Implementation
- [ ] All test scenarios pass
- [ ] Performance metrics improved
- [ ] Error rates reduced
- [ ] User experience smooth

### Rollback Plan
```bash
# Se issues críticos aparecerem:
git stash                    # Save changes
git checkout HEAD~1          # Previous working version
npm run build && npm run dev # Quick rollback
```

---

## 🧠 Context Engineering Insights

### Patterns Learned
- JWT token propagation delay é real issue no Firebase
- Concurrent profile creation needs locking mechanism
- Error categorization essential para proper UX
- Auth state coordination prevents many race conditions

### Future Architecture Improvements
- Consider auth state machine for complex flows
- Implement proper auth middleware layer
- Add auth operation monitoring/alerting
- Consider authentication caching strategy

---

*PRP específico para correção de problemas de autenticação no LexAI | Context Engineering*