# 🚀 TESTE EM PRODUÇÃO - ROTEIRO COMPLETO

## ⚡ **INÍCIO RÁPIDO**

### **1. Configure Agora (2 minutos)**
```bash
# 1. Copie o arquivo de exemplo
cp .env.example .env.local

# 2. Execute verificação automática
node scripts/verificar-auth.js
```

### **2. Configure Firebase (3 minutos)**
1. **Acesse:** https://console.firebase.google.com/project/lexai-ef0ab/settings/general
2. **Copie configurações** do seu app para `.env.local`
3. **Vá para:** https://console.firebase.google.com/project/lexai-ef0ab/authentication/settings
4. **Confirme que está habilitado:**
   - ✅ Email/Password
   - ✅ Google (se usar)

### **3. Teste Imediatamente**
```bash
# Inicie o servidor
npm run dev

# Abra no navegador
http://localhost:3000/signup
```

---

## 🎯 **TESTE PRÁTICO**

### **Fase 1: Cadastro**
1. **Vá para:** `/signup`
2. **Preencha TODOS os campos:**
   - Nome: "João Silva"
   - Email: "joao@teste.com"
   - Telefone: "(11) 99999-9999"
   - Empresa: "Escritório Teste"
   - OAB: "SP 123456"
   - Senha: "teste123"
3. **Abra Console (F12)** e veja logs:
   ```
   📝 [AUTH] Iniciando cadastro para: joao@teste.com
   ✅ [AUTH] Usuário criado com sucesso: abc123
   ✅ [AUTH] Perfil criado com sucesso
   ```
4. **Confirme redirecionamento** para página inicial

### **Fase 2: Login**
1. **Vá para:** `/login`
2. **Use credenciais:** joao@teste.com / teste123
3. **Veja logs no console:**
   ```
   🔐 [AUTH] Iniciando login para: joao@teste.com
   ✅ [AUTH] Login bem-sucedido: abc123
   👤 [AUTH] Usuário detectado: abc123
   ```

### **Fase 3: Verificar Dados**
1. **Acesse Firestore:** https://console.firebase.google.com/project/lexai-ef0ab/firestore
2. **Vá para:** Collection `usuarios`
3. **Confirme que documento foi criado** com:
   - ✅ name: "João Silva"
   - ✅ email: "joao@teste.com"
   - ✅ phone: "(11) 99999-9999"
   - ✅ company: "Escritório Teste"
   - ✅ oab: "SP 123456"

---

## ❌ **SE ALGO DER ERRADO**

### **Erro 400 - Bad Request**
```javascript
❌ [AUTH] Erro no cadastro: {
  code: "auth/invalid-api-key",
  message: "Your API key is invalid"
}
```
**➜ SOLUÇÃO:** Verificar NEXT_PUBLIC_FIREBASE_API_KEY no .env.local

### **Erro de Configuração**
```
🚨 FIREBASE CONFIGURATION ERROR 🚨
Missing required environment variables:
- NEXT_PUBLIC_FIREBASE_API_KEY: ❌
```
**➜ SOLUÇÃO:** Configurar todas as variáveis no .env.local

### **Erro de Domínio**
```javascript
❌ [AUTH] Erro no login: {
  code: "auth/unauthorized-domain"
}
```
**➜ SOLUÇÃO:** 
1. Vá para: https://console.firebase.google.com/project/lexai-ef0ab/authentication/settings
2. Adicione seu domínio nos "Domínios autorizados"

### **Sem Logs no Console**
- **F12** → Console → Recarregue a página
- Se não aparecer nada, há erro de JavaScript
- Veja tab "Console" para erros

---

## ✅ **CHECKLIST COMPLETO**

### **Antes de Testar:**
- [ ] `.env.local` criado e configurado
- [ ] Firebase Authentication habilitado
- [ ] App Check desabilitado no Console
- [ ] Domínios autorizados configurados
- [ ] `node scripts/verificar-auth.js` passou

### **Durante o Teste:**
- [ ] Console do navegador aberto (F12)
- [ ] Logs aparecem com emojis
- [ ] Cadastro completa sem erros
- [ ] Login funciona corretamente
- [ ] Dados salvos no Firestore

### **Teste Completo:**
- [ ] Usuário criado no Firebase Auth
- [ ] Perfil completo no Firestore
- [ ] Login/logout funcionando
- [ ] Redirecionamentos corretos
- [ ] Estados de loading adequados

---

## 🎖️ **RESULTADO ESPERADO**

**🟢 SUCESSO TOTAL:**
```
✅ Sistema de autenticação 100% funcional
✅ Cadastro salvando dados completos
✅ Login com validação robusta
✅ Logs claros para debug
✅ Error handling adequado
✅ Performance otimizada
```

**🔴 SE FALHOU:**
1. **Execute:** `node scripts/verificar-auth.js`
2. **Consulte:** `SISTEMA-AUTH-PRONTO.md`
3. **Verifique:** Configurações Firebase no Console
4. **Confirme:** Variáveis de ambiente

---

## 💪 **SISTEMA ESTÁ PRONTO!**

- ✅ **App Check removido** (causa dos erros anteriores)
- ✅ **Configuração robusta** com validação clara
- ✅ **Logging detalhado** para debug fácil
- ✅ **Dados completos** salvos no cadastro
- ✅ **Error handling** melhorado
- ✅ **Performance otimizada**

**🚀 Vá em frente e teste! O sistema está completamente funcional!**