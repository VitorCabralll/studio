# 🔧 Google Cloud Console - Configuração OAuth

## 🎯 **O que você está vendo é NORMAL**

No Firebase Console, os domínios aparecem como "Default" e não podem ser removidos:
```
✅ lexai-ef0ab.firebaseapp.com    Default
❓ lexai-ef0ab.web.app           Default  
```

**Isso é normal!** Você precisa configurar no **Google Cloud Console**.

## 📋 **Passo a Passo - Google Cloud Console**

### 1. **Acesse o Google Cloud Console**
```
https://console.cloud.google.com/apis/credentials?project=lexai-ef0ab
```

### 2. **Encontre as Credenciais OAuth 2.0**
- Procure por **"IDs do cliente OAuth 2.0"**
- Clique no **nome da credencial** (não no ícone)
- Ou clique no **ícone de lápis** para editar

### 3. **Seção: "URIs de redirecionamento autorizados"**
**Deve conter APENAS:**
```
✅ https://lexai-ef0ab.firebaseapp.com/__/auth/handler
```

**Se aparecer isto, REMOVA:**
```
❌ https://lexai-ef0ab.web.app/__/auth/handler
```

### 4. **Seção: "Origens JavaScript autorizadas"**
**Deve conter:**
```
✅ https://lexai--lexai-ef0ab.us-central1.hosted.app
✅ https://lexai-ef0ab.firebaseapp.com
```

**Se aparecer isto, REMOVA:**
```
❌ https://lexai-ef0ab.web.app
```

### 5. **Salvar e Aguardar**
- Clique em **"Salvar"**
- Aguarde **2-3 minutos** para propagação
- Teste: https://lexai--lexai-ef0ab.us-central1.hosted.app/signup

## 🔍 **Se não encontrar as credenciais OAuth**

### **Pode ser que não existam ainda! Vamos criar:**

1. **Clique em "CRIAR CREDENCIAIS"**
2. **Selecione "ID do cliente OAuth 2.0"**
3. **Tipo de aplicativo:** "Aplicativo da Web"
4. **Nome:** "LexAI Web Client"
5. **Origens JavaScript autorizadas:**
   ```
   https://lexai--lexai-ef0ab.us-central1.hosted.app
   https://lexai-ef0ab.firebaseapp.com
   ```
6. **URIs de redirecionamento autorizados:**
   ```
   https://lexai-ef0ab.firebaseapp.com/__/auth/handler
   ```
7. **Clique "Criar"**

## 🆘 **Se ainda não conseguir**

**Alternativa 1: Link Direto**
```
https://console.cloud.google.com/apis/credentials/oauthclient?project=lexai-ef0ab
```

**Alternativa 2: Via Menu**
1. APIs e Serviços → Credenciais
2. + CRIAR CREDENCIAIS → ID do cliente OAuth 2.0

## ✅ **Como Saber se Funcionou**
Após salvar, teste o Google Auth:
1. Vá para: https://lexai--lexai-ef0ab.us-central1.hosted.app/signup
2. Clique em "Continuar com Google"
3. **Deve abrir popup Google** (sem erro)

---

**O Firebase Console não importa - só o Google Cloud Console!**