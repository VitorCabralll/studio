# 🔧 Configuração para Desenvolvimento - Google Auth

## 🎯 **O que você tem agora (PRODUÇÃO):**
```
✅ https://lexai--lexai-ef0ab.us-central1.hosted.app (App Hosting)
✅ https://lexai-ef0ab.firebaseapp.com (Firebase)
```

## 🛠️ **Para DESENVOLVIMENTO LOCAL, adicione:**

### **1. No Google Cloud Console**
**Adicione estas URLs nas "Origens JavaScript autorizadas":**
```
URIs 5: http://localhost:3000
URIs 6: http://localhost:5002
URIs 7: http://localhost:8080
```

**Configuração completa ficará:**
```
✅ http://localhost
✅ http://localhost:5000  
✅ http://localhost:3000     ← Para npm run dev
✅ http://localhost:5002     ← Para emulators
✅ http://localhost:8080     ← Para outras portas
✅ https://lexai-ef0ab.firebaseapp.com
✅ https://lexai--lexai-ef0ab.us-central1.hosted.app
```

### **2. URIs de redirecionamento (adicionar):**
```
URIs 2: http://localhost:3000/__/auth/handler
URIs 3: http://localhost:5002/__/auth/handler
```

## 🚀 **Para testar LOCALMENTE:**

### **Opção 1: Emulators (Recomendado)**
```bash
firebase emulators:start
```
- URL: http://localhost:5002
- Firebase Auth será emulado
- Dados não persistem

### **Opção 2: Desenvolvimento Normal**
```bash
npm run dev
```
- URL: http://localhost:3000  
- Conecta com Firebase real
- Google Auth funcionará

### **Opção 3: Teste direto em Produção**
```
https://lexai--lexai-ef0ab.us-central1.hosted.app/signup
```

## ⚙️ **Configuração .env.local (já está OK)**
```env
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=lexai-ef0ab.firebaseapp.com ✅
```

## 🔥 **Comandos para testar:**

### **1. Desenvolvimento Local:**
```bash
npm run dev
# Acesse: http://localhost:3000/signup
```

### **2. Com Emulators:**
```bash
firebase emulators:start
# Acesse: http://localhost:5002/signup
```

### **3. Build de Produção:**
```bash
npm run build && npm start
# Acesse: http://localhost:3000/signup
```

## 🎯 **Qual escolher para testar?**

**MAIS FÁCIL:** Teste direto em produção
```
https://lexai--lexai-ef0ab.us-central1.hosted.app/signup
```

**PARA DESENVOLVIMENTO:** Adicione as URLs localhost no Google Cloud Console e use:
```bash
npm run dev
```

## ✅ **Verificação Rápida:**
Após configurar, teste se Google Auth abre popup sem erro em qualquer uma das URLs configuradas.

---

**Recomendo começar testando em PRODUÇÃO primeiro, depois configurar desenvolvimento se precisar.**