# 🔧 **Plano de Correções - Sistema de Autenticação LexAI**

> **Documento de Planejamento de Implementação**  
> Data: 12 de Janeiro de 2025  
> Versão: 1.0  
> Status: Em Implementação

---

## 📋 **Resumo Executivo**

Este documento define o plano estruturado para correção dos problemas identificados na revisão de código do sistema de autenticação LexAI. As correções estão organizadas por prioridade de segurança e impacto no negócio.

### **🎯 Objetivos Principais**
- ✅ Eliminar vulnerabilidades de segurança críticas
- ✅ Refatorar código complexo para melhor manutenibilidade
- ✅ Implementar práticas modernas de desenvolvimento
- ✅ Manter estabilidade durante as mudanças

---

## 🚨 **FASE 1: Correções Críticas de Segurança (Semana 1)**

### **1.1 Corrigir Timing Attack na Validação de Token**
**Prioridade**: 🔴 **CRÍTICA** - Implementar IMEDIATAMENTE

**Arquivo**: `src/lib/auth-coordinator.ts`  
**Linhas**: 420-422

**❌ Problema Atual:**
```typescript
// VULNERÁVEL: Delay fixo expõe informações de timing
if (process.env.NODE_ENV === 'production') {
  await new Promise(resolve => setTimeout(resolve, 3000));
}
```

**✅ Solução:**
```typescript
// Implementar validação constant-time
private static async waitForTokenPropagation(): Promise<void> {
  const startTime = performance.now();
  const MIN_VALIDATION_TIME = 2000; // Tempo mínimo constante
  
  // Fazer validação real
  const validationPromise = this.performActualValidation();
  
  // Garantir que sempre demore pelo menos MIN_VALIDATION_TIME
  const [result] = await Promise.all([
    validationPromise,
    new Promise(resolve => {
      const elapsed = performance.now() - startTime;
      const remaining = Math.max(0, MIN_VALIDATION_TIME - elapsed);
      setTimeout(resolve, remaining);
    })
  ]);
  
  return result;
}
```

### **1.2 Sanitizar Logs de Erro (Information Disclosure)**
**Prioridade**: 🔴 **CRÍTICA**

**Arquivo**: `src/lib/auth-coordinator.ts`  
**Linhas**: 492-503

**❌ Problema Atual:**
```typescript
console.warn(`JWT token invalid (permission-denied)`);
```

**✅ Solução:**
```typescript
// Criar logger seguro que não vaza informações sensíveis
private static logSecurityEvent(event: string, metadata?: Record<string, unknown>): void {
  const sanitizedMetadata = {
    timestamp: Date.now(),
    operation: metadata?.operation,
    attempt: metadata?.attempt,
    // NUNCA logar: UIDs, tokens, códigos de erro específicos
  };
  
  if (process.env.NODE_ENV === 'development') {
    logger.warn(`Security event: ${event}`, sanitizedMetadata);
  } else {
    // Em produção, apenas log interno para auditoria
    logger.audit(event, sanitizedMetadata);
  }
}
```

### **1.3 Implementar Validação Server-Side**
**Prioridade**: 🟡 **ALTA**

**Arquivo**: `src/components/auth/signup-form.tsx`  
**Linhas**: 36-66

**✅ Criar Schema de Validação:**
```typescript
// Novo arquivo: src/lib/validation/auth-schemas.ts
import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
  
  email: z.string()
    .email('Email inválido')
    .max(254, 'Email muito longo')
    .transform(email => email.toLowerCase().trim()),
  
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(128, 'Senha muito longa')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter ao menos: 1 minúscula, 1 maiúscula, 1 número'),
  
  phone: z.string()
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Formato de telefone inválido')
    .optional(),
  
  oab: z.string()
    .regex(/^[A-Z]{2}\s\d+$/, 'Formato OAB inválido (ex: SP 123456)')
    .optional()
});

export type SignupData = z.infer<typeof signupSchema>;
```

### **1.4 Implementar Rate Limiting**
**Prioridade**: 🟡 **ALTA**

**✅ Criar Rate Limiter:**
```typescript
// Novo arquivo: src/lib/security/rate-limiter.ts
export class RateLimiter {
  private static attempts = new Map<string, { count: number; resetTime: number }>();
  private static readonly MAX_ATTEMPTS = 5;
  private static readonly WINDOW_MS = 15 * 60 * 1000; // 15 minutos

  static isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier);
    
    if (!record || now > record.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + this.WINDOW_MS });
      return true;
    }
    
    if (record.count >= this.MAX_ATTEMPTS) {
      return false;
    }
    
    record.count++;
    return true;
  }
}
```

---

## 🏗️ **FASE 2: Refatoração de Arquitetura (Semana 2)**

### **2.1 Quebrar AuthCoordinator (Aplicar SRP)**
**Prioridade**: 🟡 **ALTA**

**Estrutura Atual**: 1 classe com 716 linhas  
**Estrutura Nova**: 5 classes especializadas

**✅ Nova Arquitetura:**

```typescript
// src/lib/auth/token-validator.ts
export class TokenValidator {
  private circuitBreaker: CircuitBreaker;
  
  async validateToken(user: User): Promise<TokenValidationResult> {
    return this.circuitBreaker.execute(() => this.performValidation(user));
  }
}

// src/lib/auth/profile-manager.ts
export class ProfileManager {
  private cache: TTLCache<UserProfile>;
  
  async getProfile(uid: string): Promise<UserProfile | null> {
    // Lógica específica de profile
  }
}

// src/lib/auth/auth-state-manager.ts
export class AuthStateManager {
  private static state: AuthCoordinatorState;
  
  static getState(): Readonly<AuthCoordinatorState> {
    return { ...this.state };
  }
}

// src/lib/auth/auth-coordinator.ts (Nova versão simplificada)
export class AuthCoordinator {
  private tokenValidator: TokenValidator;
  private profileManager: ProfileManager;
  private stateManager: AuthStateManager;
  
  // Apenas coordenação entre serviços
}
```

### **2.2 Implementar Dependency Injection**
**Prioridade**: 🟠 **MÉDIA**

**✅ Container DI:**
```typescript
// src/lib/di/container.ts
export class DIContainer {
  private instances = new Map<string, any>();
  
  register<T>(token: string, factory: () => T): void {
    this.instances.set(token, factory);
  }
  
  resolve<T>(token: string): T {
    const factory = this.instances.get(token);
    if (!factory) throw new Error(`Service ${token} not registered`);
    return factory();
  }
}

// Configuração
container.register('TokenValidator', () => new TokenValidator());
container.register('ProfileManager', () => new ProfileManager());
```

### **2.3 Separar Concerns nos Hooks**
**Prioridade**: 🟡 **ALTA**

**Arquivo**: `src/hooks/use-auth.tsx`

**✅ Hooks Especializados:**
```typescript
// src/hooks/use-auth-state.tsx - Apenas estado
export function useAuthState() {
  const [state, setState] = useState<AuthState>(initialState);
  // Apenas gerenciamento de estado
  return { state, setState };
}

// src/hooks/use-auth-navigation.tsx - Apenas navegação
export function useAuthNavigation() {
  const router = useRouter();
  // Apenas lógica de navegação
  return { navigateToLogin, navigateToWorkspace };
}

// src/hooks/use-auth.tsx - Orquestração
export function useAuth() {
  const authState = useAuthState();
  const navigation = useAuthNavigation();
  const profile = useUserProfile();
  
  // Apenas orquestração entre hooks especializados
  return { ...authState, ...navigation, ...profile };
}
```

---

## ⚡ **FASE 3: Otimizações de Performance (Semana 3)**

### **3.1 Implementar Exponential Backoff**
**Prioridade**: 🟠 **MÉDIA**

**Arquivo**: `src/services/user-service.ts`  
**Linhas**: 264-334

**❌ Problema Atual:**
```typescript
await new Promise(resolve => setTimeout(resolve, INTERVAL)); // 300ms fixo
```

**✅ Solução:**
```typescript
// src/lib/utils/retry-logic.ts
export class ExponentialBackoff {
  static async retry<T>(
    operation: () => Promise<T>,
    maxAttempts: number = 5,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxAttempts) break;
        
        // Exponential backoff com jitter
        const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), 30000);
        const jitter = Math.random() * 0.1 * delay;
        
        await new Promise(resolve => setTimeout(resolve, delay + jitter));
      }
    }
    
    throw lastError!;
  }
}
```

### **3.2 Implementar React Query para Cache**
**Prioridade**: 🟠 **MÉDIA**

**✅ Setup React Query:**
```bash
npm install @tanstack/react-query
```

**✅ Configuração:**
```typescript
// src/lib/query/client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: (failureCount, error) => {
        if (error.code === 'permission-denied') return false;
        return failureCount < 3;
      }
    }
  }
});

// src/hooks/use-user-profile.tsx
export function useUserProfile(uid: string) {
  return useQuery({
    queryKey: ['profile', uid],
    queryFn: () => getUserProfile(uid),
    enabled: !!uid,
    staleTime: 3 * 60 * 1000 // 3 minutos para profile
  });
}
```

### **3.3 Code Splitting e Lazy Loading**
**Prioridade**: 🟠 **MÉDIA**

**✅ Implementação:**
```typescript
// src/app/auth/layout.tsx
import { lazy, Suspense } from 'react';

const SignupForm = lazy(() => import('@/components/auth/signup-form'));
const LoginForm = lazy(() => import('@/components/auth/login-form'));

export default function AuthLayout({ children }) {
  return (
    <Suspense fallback={<AuthLoadingSkeleton />}>
      {children}
    </Suspense>
  );
}
```

---

## 🧪 **FASE 4: Testes e Qualidade (Semana 4)**

### **4.1 Implementar Testes Unitários**
**Prioridade**: 🟡 **ALTA**

**✅ Setup de Testes:**
```typescript
// src/__tests__/auth/token-validator.test.ts
import { TokenValidator } from '@/lib/auth/token-validator';

describe('TokenValidator', () => {
  let validator: TokenValidator;
  
  beforeEach(() => {
    validator = new TokenValidator();
  });
  
  it('should validate token with constant time', async () => {
    const start = performance.now();
    await validator.validateToken(mockUser);
    const duration = performance.now() - start;
    
    expect(duration).toBeGreaterThan(2000); // Mínimo 2s
    expect(duration).toBeLessThan(3000);    // Máximo 3s
  });
  
  it('should not leak timing information', async () => {
    const times = [];
    
    for (let i = 0; i < 10; i++) {
      const start = performance.now();
      await validator.validateToken(mockUser);
      times.push(performance.now() - start);
    }
    
    // Variação deve ser mínima (< 10%)
    const avg = times.reduce((a, b) => a + b) / times.length;
    const variance = times.every(t => Math.abs(t - avg) / avg < 0.1);
    expect(variance).toBe(true);
  });
});
```

### **4.2 Configurar Testes de Integração**
**Prioridade**: 🟠 **MÉDIA**

**✅ Testes E2E:**
```typescript
// src/__tests__/integration/auth-flow.test.ts
describe('Auth Flow Integration', () => {
  it('should complete full auth flow without timing leaks', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });
    
    expect(result.current.user).toBeDefined();
    expect(result.current.profile).toBeDefined();
  });
});
```

### **4.3 Implementar Monitoramento**
**Prioridade**: 🟠 **MÉDIA**

**✅ Métricas de Segurança:**
```typescript
// src/lib/monitoring/security-metrics.ts
export class SecurityMetrics {
  static trackAuthAttempt(success: boolean, timing: number) {
    if (timing > 10000) { // > 10s é suspeito
      logger.security('Suspicious auth timing', { timing, success });
    }
  }
  
  static trackFailedAttempts(identifier: string) {
    // Monitorar tentativas de força bruta
  }
}
```

---

## 📊 **Cronograma de Implementação**

### **Semana 1: Segurança Crítica** (12-19 Jan 2025)
- [ ] **Segunda**: Timing attack fix
- [ ] **Terça**: Log sanitization  
- [ ] **Quarta**: Input validation schemas
- [ ] **Quinta**: Rate limiting
- [ ] **Sexta**: Security testing

### **Semana 2: Refatoração** (20-26 Jan 2025)
- [ ] **Segunda**: Quebrar AuthCoordinator
- [ ] **Terça**: Implementar DI
- [ ] **Quarta**: Separar hooks
- [ ] **Quinta**: Testes de refatoração
- [ ] **Sexta**: Code review

### **Semana 3: Performance** (27 Jan - 02 Fev 2025)
- [ ] **Segunda**: Exponential backoff
- [ ] **Terça**: React Query setup
- [ ] **Quarta**: Code splitting
- [ ] **Quinta**: Performance testing
- [ ] **Sexta**: Otimizações finais

### **Semana 4: Qualidade** (03-09 Fev 2025)
- [ ] **Segunda**: Testes unitários
- [ ] **Terça**: Testes de integração
- [ ] **Quarta**: Monitoramento
- [ ] **Quinta**: Documentação
- [ ] **Sexta**: Deploy e validação

---

## 🎯 **Critérios de Sucesso**

### **Segurança**
- [ ] Zero vulnerabilidades críticas detectadas
- [ ] Tempo de resposta consistente (±5%) para operações de auth
- [ ] Rate limiting funcionando (máx 5 tentativas/15min)

### **Qualidade**
- [ ] Complexidade ciclomática < 10 em todas as classes
- [ ] Cobertura de testes > 80%
- [ ] Zero violações de ESLint

### **Performance**
- [ ] Tempo de login < 2s (P95)
- [ ] Cache hit rate > 70%
- [ ] Bundle size reduzido em > 15%

---

## 🚀 **Comandos de Deploy**

### **Preparação**
```bash
# Rodar todos os checks antes do deploy
npm run typecheck
npm run lint
npm run test
npm run build
```

### **Deploy Staging**
```bash
npm run env:staging
npm run deploy:staging
```

### **Deploy Produção**
```bash
npm run env:prod
npm run deploy:prod
```

---

## 📝 **Notas de Implementação**

### **⚠️ Cuidados Especiais**
1. **Backward Compatibility**: Manter APIs antigas funcionando durante transição
2. **Feature Flags**: Usar flags para rollback rápido se necessário
3. **Monitoring**: Monitorar métricas de erro após cada deploy
4. **Database Migrations**: Nenhuma migration necessária para estas correções

### **🔧 Configurações Necessárias**
1. **Environment Variables**: Adicionar configurações de rate limiting
2. **Firebase Rules**: Atualizar se necessário
3. **CI/CD**: Incluir novos testes na pipeline

---

## 📞 **Contatos e Responsabilidades**

- **Security Lead**: Implementação das correções de segurança
- **Tech Lead**: Review da refatoração de arquitetura  
- **QA Lead**: Validação dos testes e quality gates
- **DevOps**: Deploy e monitoramento

---

**🎯 Este plano prioriza segurança e estabilidade, implementando correções incrementais que podem ser facilmente revertidas se necessário. Cada fase é independente e pode ser deployada separadamente.**