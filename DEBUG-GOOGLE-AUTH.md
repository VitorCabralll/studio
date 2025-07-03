# 🔍 Debug Google Auth - Checklist Completo

## ❌ Problema: Ainda não funciona após adicionar domínios

### 🔧 **Verificações Obrigatórias:**

#### 1. **URLs Corretas no Google Cloud**
✅ Você adicionou os domínios
❓ **Verifique se adicionou EXATAMENTE estas URLs:**

**URIs de redirecionamento autorizados:**
```
https://lexai-ef0ab.firebaseapp.com/__/auth/handler
https://lexai-ef0ab.web.app/__/auth/handler
```

**Origens JavaScript autorizadas:**
```
https://lexai--lexai-ef0ab.us-central1.hosted.app
https://lexai-ef0ab.firebaseapp.com
https://lexai-ef0ab.web.app
```

⚠️ **IMPORTANTE: Note o `/__/auth/handler` no final das URIs de redirecionamento!**

#### 2. **Firebase Console - Authentication**
1. Acesse: https://console.firebase.google.com/project/lexai-ef0ab/authentication/providers
2. Verifique se **Google** está habilitado
3. Clique em **Google** e veja se tem o **Web SDK configuration**
4. **Web client ID** deve estar preenchido

#### 3. **Aguardar Propagação**
- Google Cloud leva **2-5 minutos** para atualizar
- Limpe cache do browser
- Teste em aba anônima

#### 4. **Testar URL Específica**
Teste este link direto:
```
https://lexai--lexai-ef0ab.us-central1.hosted.app/__/auth/handler
```
Deve retornar uma página, não erro 404.

### 🚨 **Erros Comuns:**

#### **Erro: "redirect_uri_mismatch"**
- ❌ Esqueceu o `/__/auth/handler`
- ❌ Copiou URL errada
- ❌ Não salvou no Google Cloud

#### **Erro: "invalid_request"**
- ❌ Google Auth não habilitado no Firebase
- ❌ Web Client ID não configurado

#### **Erro: "unauthorized_client"**
- ❌ Projeto errado no Google Cloud
- ❌ Credenciais OAuth não criadas

### 🔧 **Soluções Rápidas:**

#### **Se ainda não funciona:**

1. **Aguarde mais 5 minutos**
2. **Limpe cache** (Ctrl+Shift+R)
3. **Teste em aba anônita**
4. **Verifique no Network tab** do browser se há erros

#### **Se continuar falhando:**

1. **Re-adicione as URLs** no Google Cloud
2. **Desabilite e reabilite** Google Auth no Firebase
3. **Regenere** as credenciais OAuth

### 📱 **Teste Alternativo:**
Use cadastro com email/senha enquanto ajusta Google Auth:
```
Email: teste@exemplo.com
Senha: MinhaSenh@123
```

---

## 🎯 **Próximos Passos:**
1. Verificar configuração atual
2. Aguardar propagação (5 min)
3. Testar em aba anônima
4. Se persistir: regenerar credenciais OAuth