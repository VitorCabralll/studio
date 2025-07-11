# 🔥 Firebase Setup Guide - LexAI

> **Complete guide for Firebase Authentication and Firestore configuration**

---

## 🎯 **Overview**

This guide consolidates all necessary information to properly configure Firebase in LexAI, including:
- Initial project configuration
- Authentication setup (Email/Password + Google OAuth)
- Firestore configuration
- Common problems troubleshooting
- Production checklist

---

## 🚀 **Initial Setup**

### **1. Firebase Project**
1. Access [Firebase Console](https://console.firebase.google.com/)
2. Project: `lexai-ef0ab`
3. Enable required services:
   - Authentication
   - Firestore Database
   - Cloud Storage
   - Cloud Functions

### **2. Environment Variables**
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=lexai-ef0ab.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=lexai-ef0ab
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=lexai-ef0ab.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Environment
NODE_ENV=production
```

---

## 🔐 **Authentication Setup**

### **Email/Password Authentication**
1. Firebase Console → Authentication → Sign-in method
2. Enable "Email/Password"
3. Configure email templates (optional)

### **Google OAuth Setup**

#### **Firebase Console:**
1. Authentication → Sign-in method → Google
2. Enable Google OAuth
3. Configure support email

#### **Google Cloud Console:**
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → OAuth consent screen
3. Configurar tela de consentimento
4. APIs & Services → Credentials
5. Criar OAuth 2.0 Client ID

#### **Authorized Domains:**
```
Authorized JavaScript origins:
✅ https://lexai-ef0ab.firebaseapp.com
✅ http://localhost:3000 (desenvolvimento)
✅ https://your-custom-domain.com

Authorized redirect URIs:
✅ https://lexai-ef0ab.firebaseapp.com/__/auth/handler
✅ http://localhost:3000/__/auth/handler
```

#### **Firebase Authentication Domains:**
```
Firebase Console → Authentication → Settings → Authorized domains:
✅ lexai-ef0ab.firebaseapp.com
✅ localhost (desenvolvimento apenas)
✅ your-custom-domain.com
```

---

## 🗄️ **Firestore Setup**

### **Security Rules**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Workspaces - owner and members access
    match /workspaces/{workspaceId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.ownerId || 
         request.auth.uid in resource.data.members);
    }
    
    // Agents - workspace members access
    match /agentes/{agentId} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/workspaces/$(resource.data.workspaceId)) &&
        (request.auth.uid == get(/databases/$(database)/documents/workspaces/$(resource.data.workspaceId)).data.ownerId ||
         request.auth.uid in get(/databases/$(database)/documents/workspaces/$(resource.data.workspaceId)).data.members);
    }
  }
}
```

### **Indexes**
```json
{
  "indexes": [
    {
      "collectionGroup": "agentes",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "workspaceId", "order": "ASCENDING"},
        {"fieldPath": "createdAt", "order": "DESCENDING"}
      ]
    }
  ]
}
```

---

## ✅ **Checklist de Produção**

### **🔍 Pré-Deploy**
- [ ] **Firebase Console - Authentication**
  - [ ] Email/Password habilitado
  - [ ] Google OAuth configurado
  - [ ] Domínios autorizados corretos
  - [ ] Templates de email configurados

- [ ] **Google Cloud Console**
  - [ ] OAuth consent screen configurado
  - [ ] Credenciais OAuth criadas
  - [ ] Domínios autorizados atualizados

- [ ] **Variáveis de Ambiente**
  - [ ] Todas as variáveis Firebase configuradas
  - [ ] `NODE_ENV=production`
  - [ ] Domínios corretos para produção

- [ ] **Firestore**
  - [ ] Security rules implementadas
  - [ ] Indexes criados
  - [ ] Collections estruturadas

### **🚀 Pós-Deploy**
- [ ] **Testes Funcionais**
  - [ ] Login com email/senha
  - [ ] Login com Google OAuth
  - [ ] Criação de perfil automática
  - [ ] Acesso a workspaces
  - [ ] Logout funcionando

- [ ] **Validação de Logs**
  - [ ] `✅ Auth ready completed`
  - [ ] `✅ Firestore access confirmed`
  - [ ] `✅ Profile loaded successfully`
  - [ ] Sem erros de permission denied

---

## 🚨 **Troubleshooting**

### **Problemas Comuns**

#### **"Domain not authorized"**
**Causa:** Domínio não configurado nos authorized domains
**Solução:**
1. Firebase Console → Authentication → Settings → Authorized domains
2. Adicionar o domínio atual
3. Google Cloud Console → OAuth credentials → Authorized origins

#### **"Permission denied" no Firestore**
**Causa:** Security rules ou timing de token
**Solução:**
1. Verificar security rules
2. Implementar delay em produção (2s)
3. Verificar estrutura de collections

#### **Google OAuth não funciona**
**Causa:** Configuração OAuth incorreta
**Solução:**
1. Verificar credenciais OAuth no Google Cloud
2. Confirmar redirect URIs
3. Verificar authorized domains

#### **Token timing issues**
**Causa:** Token não propagado imediatamente
**Solução:**
```typescript
// Implementar delay em produção
if (process.env.NODE_ENV === 'production') {
  await new Promise(resolve => setTimeout(resolve, 2000));
}
```

### **Logs de Debug**
```typescript
// Habilitar logs detalhados
console.log('Auth domain:', firebase.app().options.authDomain);
console.log('Current origin:', window.location.origin);
console.log('Environment:', process.env.NODE_ENV);
```

---

## 🔧 **Configuração Environment-Aware**

### **Development vs Production**
```typescript
// firebase-config.ts
const firebaseConfig = {
  authDomain: process.env.NODE_ENV === 'production' 
    ? 'lexai-ef0ab.firebaseapp.com' 
    : process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // ... outras configurações
};

// auth-coordinator.ts
if (process.env.NODE_ENV === 'production') {
  // Delay para propagação de token
  await new Promise(resolve => setTimeout(resolve, 2000));
}

// Collections com namespace
const collection = process.env.NODE_ENV === 'production' 
  ? 'usuarios' 
  : addNamespace('usuarios');
```

---

## 📊 **Monitoramento**

### **Métricas Importantes**
- Taxa de sucesso de login
- Tempo de resposta de autenticação
- Erros de permission denied
- Uso de quotas Firestore

### **Alertas Recomendados**
- Falhas de autenticação > 5%
- Latência > 3 segundos
- Erros de security rules
- Quota Firestore > 80%

---

**🔥 This guide ensures a robust and secure Firebase configuration for LexAI in all environments.**