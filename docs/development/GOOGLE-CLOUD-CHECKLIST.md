# 🔧 CHECKLIST GOOGLE CLOUD CONSOLE - Correção Auth

> **🎯 Objetivo:** Resolver erro `Firebase: Error (auth/unauthorized-domain)`  
> **⏰ Tempo estimado:** 5-10 minutos

## 📍 **Como Acessar**

1. Vá para: https://console.cloud.google.com/
2. Selecione projeto: **lexai-ef0ab**
3. Menu lateral: **APIs e serviços** → **Credenciais**
4. Clique na credencial OAuth 2.0 (geralmente tem nome como "Web client")

## ✅ **CHECKLIST DE VERIFICAÇÃO**

### 🌐 **1. Origens JavaScript Autorizadas**

**DEVE CONTER EXATAMENTE:**
```
✅ https://lexai--lexai-ef0ab.us-central1.hosted.app
✅ https://lexai-ef0ab.firebaseapp.com
✅ http://localhost:3000 (opcional - para desenvolvimento)
```

**❌ REMOVER SE EXISTIR:**
```
❌ https://lexai-ef0ab.web.app
❌ http://localhost:3000 (se não precisar desenvolvimento)
```

### 🔄 **2. URIs de Redirecionamento Autorizados**

**DEVE CONTER EXATAMENTE:**
```
✅ https://lexai-ef0ab.firebaseapp.com/__/auth/handler
```

**❌ REMOVER SE EXISTIR:**
```
❌ https://lexai-ef0ab.web.app/__/auth/handler
❌ https://lexai--lexai-ef0ab.us-central1.hosted.app/__/auth/handler
```

## 🔍 **VERIFICAÇÃO PASSO A PASSO**

### **Passo 1: Localizar Credencial**
- [ ] Acesse Google Cloud Console
- [ ] Projeto: `lexai-ef0ab`
- [ ] APIs e serviços → Credenciais
- [ ] Encontre credencial tipo "Web application"

### **Passo 2: Verificar Origens**
- [ ] Clique na credencial para editar
- [ ] Seção "Origens JavaScript autorizadas"
- [ ] **Adicionar** se não existir: `https://lexai--lexai-ef0ab.us-central1.hosted.app`
- [ ] **Remover** se existir: `https://lexai-ef0ab.web.app`

### **Passo 3: Verificar URIs**
- [ ] Seção "URIs de redirecionamento autorizados"
- [ ] **Confirmar** existe: `https://lexai-ef0ab.firebaseapp.com/__/auth/handler`
- [ ] **Remover** se existir: `https://lexai-ef0ab.web.app/__/auth/handler`

### **Passo 4: Salvar e Testar**
- [ ] Clicar em "Salvar"
- [ ] Aguardar 1-2 minutos para propagação
- [ ] Testar: https://lexai--lexai-ef0ab.us-central1.hosted.app/signup

## 📊 **CONFIGURAÇÃO FINAL ESPERADA**

```yaml
Credencial OAuth 2.0:
  Origens JavaScript autorizadas:
    - https://lexai--lexai-ef0ab.us-central1.hosted.app
    - https://lexai-ef0ab.firebaseapp.com
    
  URIs de redirecionamento autorizados:
    - https://lexai-ef0ab.firebaseapp.com/__/auth/handler
```

## 🚨 **ERROS COMUNS**

| ❌ Erro | ✅ Correção |
|---------|-------------|
| Usar `.web.app` nas origens | Trocar por `.firebaseapp.com` |
| Adicionar redirect URI no domínio errado | Usar apenas `.firebaseapp.com/__/auth/handler` |
| Esquecer de salvar | Clicar em "Salvar" e aguardar propagação |

## 🔄 **APÓS CONFIGURAR**

1. **Aguardar 1-2 minutos** (propagação das configurações)
2. **Testar no navegador**: https://lexai--lexai-ef0ab.us-central1.hosted.app/signup
3. **Clicar em "Entrar com Google"**
4. **Verificar se não há mais erro** `auth/unauthorized-domain`

## 💡 **TROUBLESHOOTING**

Se ainda houver erro após configurar:

1. **Limpar cache do navegador** (Ctrl+F5)
2. **Tentar navegador privado/incógnito**
3. **Verificar se salvou corretamente** no Google Cloud Console
4. **Aguardar mais 5 minutos** (propagação pode demorar)

---

**📝 Status após verificação:**
- [ ] ✅ Configurações corretas no Google Cloud Console
- [ ] ✅ Teste de login funcionando
- [ ] ✅ Erro `auth/unauthorized-domain` resolvido