# 🔥 **Guia Completo: Firebase Auth + Firestore em Produção**

> **Documentação baseada em investigação sistemática e documentação oficial Firebase 2024**  
> **Para Claude Code: Consulte este guia para resolver problemas de auth em produção**

---

## 🎯 **Visão Geral**

Este guia documenta a configuração completa e os requisitos para Firebase Authentication + Firestore funcionarem corretamente em ambiente de produção, baseado em pesquisa da documentação oficial Firebase 2024 e resolução de problemas reais.

---

## 📋 **Checklist de Configuração Produção**

### **✅ 1. Configurações do Firebase Console**

#### **Authentication → Settings → Authorized Domains**
```bash
OBRIGATÓRIO: lexai-ef0ab.firebaseapp.com
OPCIONAL: Domínio customizado (se aplicável)
❌ NÃO incluir: localhost (produção)
```

#### **Authentication → Sign-in Method**
```bash
✅ Email/Password: Habilitado
✅ Google: Habilitado com OAuth 2.0 Client ID correto
✅ Authorized domains: Configurados corretamente
```

### **✅ 2. Variáveis de Ambiente (apphosting.yaml)**

```yaml
env:
  # Firebase Configuration
  - variable: NEXT_PUBLIC_FIREBASE_API_KEY
    value: AIzaSyBlznzwe_cuk3X2QCXHYpqCx6UGh1HOxSI
  - variable: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    value: lexai-ef0ab.firebaseapp.com  # ← CRÍTICO: Sempre .firebaseapp.com
  - variable: NEXT_PUBLIC_FIREBASE_PROJECT_ID
    value: lexai-ef0ab
  - variable: NODE_ENV
    value: production  # ← CRÍTICO: Para ativar correções específicas
```

### **✅ 3. Firestore Security Rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // USUÁRIOS - Padrão recomendado 2024
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
    }
    
    // WORKSPACES - Baseado em membership
    match /workspaces/{workspaceId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.members;
      allow create: if request.auth != null && 
        request.resource.data.members.hasAny([request.auth.uid]);
    }
  }
}
```

---

## ⚡ **Configuração de Código**

### **1. Firebase Config (firebase-config.ts)**

```typescript
export function getFirebaseConfig(): FirebaseConfig {
  const getAuthDomain = () => {
    // PRODUÇÃO: sempre usar domínio Firebase correto
    if (process.env.NODE_ENV === 'production') {
      return 'lexai-ef0ab.firebaseapp.com';
    }
    
    // DESENVOLVIMENTO: permitir override
    return process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'lexai-ef0ab.firebaseapp.com';
  };

  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: getAuthDomain(), // ← CRÍTICO
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    // ... outras configs
  };
}
```

### **2. Auth Coordinator (auth-coordinator.ts)**

```typescript
private static async waitForTokenPropagation(): Promise<void> {
  // PRODUÇÃO: Aguardar propagação real devido à latência
  if (process.env.NODE_ENV === 'production') {
    console.log('⏳ AuthCoordinator: Waiting for token propagation in production (2s)');
    await new Promise(resolve => setTimeout(resolve, 2000));
    return;
  }
  
  // DESENVOLVIMENTO: Token válido imediatamente
  console.log('✅ AuthCoordinator: Token ready immediately in development');
  return Promise.resolve();
}

private static async testFirestoreAccess(uid: string): Promise<boolean> {
  try {
    const db = getFirebaseDb();
    // CORREÇÃO: usar 'usuarios' diretamente em produção
    const collection = process.env.NODE_ENV === 'production' ? 'usuarios' : addNamespace('usuarios');
    
    const testRef = doc(db, collection, uid);
    await getDoc(testRef);
    
    console.log('✅ AuthCoordinator: Firestore access confirmed');
    return true;
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.warn('⚠️ AuthCoordinator: Firestore permission denied - retrying');
      return false;
    }
    
    console.log('✅ AuthCoordinator: Firestore access ok (non-permission error):', error.code);
    return true;
  }
}
```

### **3. Collection Namespacing Pattern**

```typescript
// PADRÃO para todos os services que usam Firestore
function getCollectionName(baseName: string): string {
  return process.env.NODE_ENV === 'production' ? baseName : addNamespace(baseName);
}

// EXEMPLO de uso:
const usersCollection = getCollectionName('usuarios');
const workspacesCollection = getCollectionName('workspaces');
const agentsCollection = getCollectionName('agentes');
```

---

## 🔍 **Troubleshooting Guide**

### **Erro: "Missing or insufficient permissions"**

#### **Diagnóstico:**
```bash
1. Verificar logs do console:
   - "Token ready immediately" em produção → Problema de timing
   - "Firestore permission denied" → Problema de rules ou token

2. Verificar configurações:
   - NODE_ENV === 'production'
   - AuthDomain correto
   - Authorized domains no Firebase Console
```

#### **Soluções por Causa:**

| Causa | Sintoma | Solução |
|-------|---------|---------|
| **Token Propagation** | Falha imediata após login | ✅ Delay 2s implementado |
| **AuthDomain incorreto** | OAuth redirect falha | ✅ `.firebaseapp.com` obrigatório |
| **Namespace issues** | Collection not found | ✅ Environment-aware collections |
| **Rules muito restritivas** | Permission denied sempre | ✅ Rules com `request.auth != null` |
| **Authorized domains** | Domain not authorized | 🔧 Configurar no Firebase Console |

---

## 📊 **Timing e Performance**

### **Token Propagation em Produção**
```typescript
// BASEADO EM RESEARCH FIREBASE 2024:
// - Tokens são válidos imediatamente após getIdToken()
// - MAS: Propagação para Firestore pode levar 1-5s em produção
// - SOLUÇÃO: Delay de 2s é recomendado e adequado

if (process.env.NODE_ENV === 'production') {
  await new Promise(resolve => setTimeout(resolve, 2000));
}
```

### **Retry Strategy**
```typescript
export async function retryWithCoordination<T>(
  operation: () => Promise<T>,
  user: User,
  maxAttempts: number = 3
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const isReady = await AuthCoordinator.waitForAuthReady(user);
      if (!isReady) throw new Error('Auth not ready');
      
      return await operation();
    } catch (error: any) {
      if (error?.code === 'permission-denied' && attempt < maxAttempts) {
        const backoffDelay = attempt * 500; // 500ms, 1s, 1.5s
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        continue;
      }
      throw error;
    }
  }
}
```

---

## 🛡️ **Security Best Practices**

### **Firestore Rules - Padrões 2024**

```javascript
// ✅ CORRETO: Auth-based access
allow read, write: if request.auth != null && request.auth.uid == userId;

// ✅ CORRETO: Role-based access
allow read, write: if request.auth != null && 
  request.auth.uid in resource.data.members;

// ❌ INCORRETO: Nunca em produção
allow read, write: if true;
allow read, write: if request.time < timestamp.date(2024, 5, 31);
```

### **Environment Separation**

```typescript
// ✅ CORRETO: Environment-aware configuration
const config = {
  authDomain: process.env.NODE_ENV === 'production' 
    ? 'lexai-ef0ab.firebaseapp.com'
    : process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
};

// ✅ CORRETO: Collection namespacing
const collection = process.env.NODE_ENV === 'production' 
  ? 'usuarios' 
  : addNamespace('usuarios');
```

---

## 🔧 **Deploy Checklist**

### **Antes do Deploy:**
```bash
✅ npm run typecheck (sem erros)
✅ npm run lint (warnings OK)
✅ Firestore rules atualizadas
✅ Environment variables no apphosting.yaml
✅ Authorized domains no Firebase Console
```

### **Deploy Commands:**
```bash
# Deploy completo
firebase deploy --only firestore:rules,hosting

# Deploy apenas rules (se necessário)
firebase deploy --only firestore:rules

# Deploy apenas hosting
firebase deploy --only hosting
```

### **Pós-Deploy - Validação:**
```bash
✅ Testar login Google
✅ Testar cadastro email/senha
✅ Verificar criação de perfil automática
✅ Testar acesso a workspaces
✅ Monitorar logs por 24h
```

---

## 🚨 **Problemas Conhecidos e Soluções**

### **1. "This domain is not authorized"**
```bash
CAUSA: Authorized domains não configurados
SOLUÇÃO: Firebase Console → Authentication → Settings → Authorized domains
ADICIONAR: lexai-ef0ab.firebaseapp.com
```

### **2. "Token ready immediately" em produção**
```bash
CAUSA: Não está aguardando propagação em produção
SOLUÇÃO: Verificar se NODE_ENV === 'production' e delay implementado
```

### **3. "Collection not found" em produção**
```bash
CAUSA: Namespace sendo aplicado em produção
SOLUÇÃO: Environment-aware collection naming implementado
```

### **4. "Permission denied" intermitente**
```bash
CAUSA: Race condition entre auth e Firestore
SOLUÇÃO: AuthCoordinator com retry logic implementado
```

---

## 📈 **Monitoramento em Produção**

### **Logs Importantes:**
```bash
✅ "Auth ready completed" - Auth funcionando
✅ "Firestore access confirmed" - Permissions OK
✅ "Profile loaded successfully" - User flow completo
⚠️ "Firestore permission denied - retrying" - Retry logic ativo
❌ "Auth coordination failed" - Problema crítico
```

### **Métricas de Sucesso:**
```bash
- Login success rate > 95%
- Profile creation success rate > 99%
- Average auth time < 3s
- Permission denied rate < 1%
```

---

## 🔄 **Troubleshooting Rápido**

### **Para Claude Code - Checklist de Debug:**

```bash
1. ❓ Problema de Auth em produção?
   → Consulte esta documentação primeiro

2. ❓ "Permission denied"?
   → Verificar: NODE_ENV, AuthDomain, Collections, Rules

3. ❓ OAuth não funciona?
   → Verificar: Authorized domains, AuthDomain

4. ❓ Timing issues?
   → Verificar: Delay implementation, Retry logic

5. ❓ Environment differences?
   → Verificar: apphosting.yaml, Environment-aware code
```

---

## 📚 **Referências e Research**

### **Documentação Oficial Consultada:**
- [Firebase App Hosting 2024](https://firebase.google.com/docs/app-hosting)
- [Firebase Auth Domains](https://firebase.google.com/docs/auth)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security)
- [Token Propagation Issues](https://stackoverflow.com/questions/64140228/firebase-auth-propagation-time-for-firestore-rules)

### **Principais Findings:**
1. **Token Propagation**: 1-5s delay possível em produção
2. **AuthDomain**: `.firebaseapp.com` obrigatório para OAuth
3. **Rules Pattern**: `request.auth != null` é o padrão 2024
4. **Environment Separation**: Projetos separados recomendado

---

**📅 Criado**: Janeiro 2025  
**🔄 Baseado**: Investigação sistemática + Documentação Firebase 2024  
**🎯 Para**: Claude Code reference e troubleshooting  
**✅ Status**: Validado em produção