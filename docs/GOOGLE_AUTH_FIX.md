# 🔧 Google Auth Fix - unauthorized-domain

## 📋 Problema
```
auth/unauthorized-domain: This domain (localhost, vercel.app, etc) is not authorized to run this operation
```

## 🔍 Diagnóstico
A configuração Firebase não está permitindo o domínio atual para Google OAuth.

## ✅ Solução

### 1. Firebase Console - Authorized Domains
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Projeto: `lexai-ef0ab` 
3. Authentication > Settings > Authorized domains
4. Adicionar domínios:
   - `localhost` (desenvolvimento)
   - `lexai-ef0ab.firebaseapp.com` (hosting)
   - `*.vercel.app` (se usando Vercel)
   - Seu domínio customizado

### 2. Google Cloud Console - OAuth Consent
1. [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services > OAuth consent screen
3. Authorized domains: adicionar mesmos domínios

### 3. OAuth Client Configuration
1. APIs & Services > Credentials
2. OAuth 2.0 Client ID para web
3. Authorized origins:
   - `http://localhost:3000`
   - `https://lexai-ef0ab.firebaseapp.com`
   - Seus domínios de produção

## 📝 Configuração Atual
```env
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=lexai-ef0ab.firebaseapp.com
```

## 🧪 Teste
```javascript
// No console do navegador
console.log('Auth domain:', firebase.app().options.authDomain);
console.log('Current origin:', window.location.origin);
```

## 📋 Checklist
- [ ] Domínios autorizados no Firebase Auth
- [ ] OAuth consent screen configurado  
- [ ] Credenciais OAuth atualizadas
- [ ] Teste em localhost
- [ ] Teste em produção