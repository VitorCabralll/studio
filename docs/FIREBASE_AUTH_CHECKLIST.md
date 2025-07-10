# ✅ **Checklist: Firebase Auth Produção - Validação Rápida**

> **Para Claude Code: Use este checklist para validar configurações antes do deploy**

---

## 🎯 **Checklist Pré-Deploy**

### **📱 Firebase Console (Manual)**
- [ ] **Authentication → Settings → Authorized domains**
  - [ ] `lexai-ef0ab.firebaseapp.com` está na lista
  - [ ] `localhost` removido (produção only)
- [ ] **Authentication → Sign-in method**
  - [ ] Email/Password habilitado
  - [ ] Google OAuth habilitado e configurado

### **⚙️ Variáveis de Ambiente**
- [ ] **apphosting.yaml contém:**
  - [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: lexai-ef0ab.firebaseapp.com`
  - [ ] `NODE_ENV: production`
  - [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID: lexai-ef0ab`

### **🔒 Firestore Rules**
- [ ] **Rules pattern correto:**
  ```javascript
  allow read, write: if request.auth != null && request.auth.uid == userId;
  allow create: if request.auth != null && request.auth.uid == userId;
  ```

### **💻 Código - Environment-Aware**
- [ ] **firebase-config.ts:**
  ```typescript
  authDomain: process.env.NODE_ENV === 'production' 
    ? 'lexai-ef0ab.firebaseapp.com' 
    : process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  ```

- [ ] **auth-coordinator.ts:**
  ```typescript
  if (process.env.NODE_ENV === 'production') {
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  ```

- [ ] **Services com collections:**
  ```typescript
  const collection = process.env.NODE_ENV === 'production' 
    ? 'usuarios' 
    : addNamespace('usuarios');
  ```

### **🧪 Validação Build**
- [ ] `npm run typecheck` - sem erros
- [ ] `npm run lint` - warnings OK
- [ ] Build passa sem erros críticos

---

## 🚀 **Checklist Pós-Deploy**

### **🔍 Testes de Funcionalidade**
- [ ] **Login Google** funciona
- [ ] **Cadastro email/senha** funciona  
- [ ] **Perfil criado automaticamente** após signup
- [ ] **Acesso a workspaces** funciona
- [ ] **Logout** funciona corretamente

### **📊 Logs de Validação**
- [ ] **Console mostra:**
  - [ ] `✅ Auth ready completed`
  - [ ] `✅ Firestore access confirmed`
  - [ ] `✅ Profile loaded successfully`
  - [ ] **NÃO mostra:** `Token ready immediately` em produção

### **⚠️ Erro Handling**
- [ ] **Retry logic funciona** - Logs mostram retries quando necessário
- [ ] **Delay em produção** - 2s delay está ativo
- [ ] **Collections corretas** - Sem namespace em produção

---

## 🚨 **Red Flags - Sinais de Problema**

### **❌ Logs que indicam problemas:**
```bash
❌ "Token ready immediately" (em produção)
❌ "Permission denied" (consistente, não retry)
❌ "Domain not authorized"
❌ "Collection not found"
❌ "Auth coordination failed"
```

### **✅ Logs que indicam sucesso:**
```bash
✅ "Waiting for token propagation in production (2s)"
✅ "Firestore access confirmed"
✅ "Profile loaded successfully"
✅ "Auth ready completed"
```

---

## 🔧 **Troubleshooting Rápido**

| Problema | Verificar | Solução |
|----------|-----------|---------|
| Permission denied | NODE_ENV, Collections, Rules | Environment-aware code |
| Domain not authorized | Firebase Console | Authorized domains |
| Token timing | Delay implementation | 2s delay em produção |
| Collection errors | Namespace usage | Direct naming em prod |

---

**✅ Use este checklist antes de cada deploy para garantir funcionamento correto em produção**