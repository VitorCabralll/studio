# 🔑 LexAI - Guia Completo de APIs e Configuração

> **⚠️ IMPORTANTE**: Este documento contém informações sensíveis. Mantenha-o seguro e nunca commite chaves de API no repositório.

---

## 📋 **RESUMO EXECUTIVO**

### **APIs Obrigatórias:**
- ✅ **Firebase** (Backend completo)
- ✅ **Pelo menos 1 API de IA** (OpenAI OU Google AI OU Anthropic)

### **APIs Opcionais:**
- 🔄 **reCAPTCHA v3** (Segurança adicional)
- 📊 **Firebase Analytics** (Métricas)

---

## 🔥 **1. FIREBASE (OBRIGATÓRIO)**

### **Serviços Necessários:**
- **Authentication** (Login/Cadastro)
- **Firestore Database** (Dados dos usuários)
- **Storage** (Upload de arquivos)
- **Functions** (Processamento server-side)

### **Como Configurar:**

#### **Passo 1: Criar Projeto Firebase**
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Criar um projeto"
3. Nome: `lexai-producao` (ou similar)
4. Ative Google Analytics (recomendado)
5. Escolha plano **Blaze** (obrigatório para Functions)

#### **Passo 2: Configurar Authentication**
1. No Firebase Console → Authentication → Get started
2. Ative provedores:
   - ✅ **Email/Password**
   - ✅ **Google** (Configure OAuth consent screen)
3. Em **Authorized domains**, adicione:
   - `localhost` (desenvolvimento)
   - `seu-dominio.com` (produção)

#### **Passo 3: Configurar Firestore**
1. No Firebase Console → Firestore Database → Create database
2. Escolha **Start in production mode**
3. Selecione região (recomendado: `southamerica-east1` - São Paulo)

#### **Passo 4: Configurar Storage**
1. No Firebase Console → Storage → Get started
2. Escolha **Start in production mode**
3. Mesma região do Firestore

#### **Passo 5: Obter Configurações**

**Para Frontend (.env.local):**
```bash
# Firebase Console → Project Settings → General → Your apps → Web app
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyA-exemplo-chave-frontend"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="seu-projeto.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="seu-projeto-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="seu-projeto.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abcdef123456"
```

**Para Backend (Server-side):**
```bash
# Firebase Console → Project Settings → Service Accounts → Generate new private key
FIREBASE_PROJECT_ID="seu-projeto-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxx@seu-projeto.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_PRIVADA_AQUI\n-----END PRIVATE KEY-----"
```

### **Custos Firebase:**
- **Firestore**: ~$0.06 por 100k leituras
- **Storage**: ~$0.026 por GB/mês
- **Functions**: ~$0.40 por milhão de invocações
- **Estimativa mensal**: $5-50 para 1k-10k usuários ativos

---

## 🤖 **2. APIS DE INTELIGÊNCIA ARTIFICIAL**

> **📌 ESCOLHA**: Configure pelo menos **UMA** das opções abaixo.

### **🥇 OPÇÃO 1: OpenAI (Recomendado para Produção)**

#### **Funcionalidades:**
- ✅ **GPT-4** (Geração de documentos premium)
- ✅ **GPT-3.5 Turbo** (Tarefas rápidas/baratas)
- ✅ **Embeddings** (Busca semântica)

#### **Como Configurar:**
1. Acesse [OpenAI Platform](https://platform.openai.com/)
2. Crie conta → Verify phone → Add payment method
3. API Keys → Create new secret key
4. Configure billing limits (recomendado: $100/mês inicial)

#### **Configuração:**
```bash
OPENAI_API_KEY="sk-proj-exemplo-sua-chave-openai-aqui"
```

#### **Custos OpenAI:**
- **GPT-4**: ~$30.00 por 1M tokens de entrada
- **GPT-3.5 Turbo**: ~$1.50 por 1M tokens de entrada
- **Estimativa**: $20-200/mês para uso moderado

---

### **🥈 OPÇÃO 2: Google AI (Melhor Custo-Benefício)**

#### **Funcionalidades:**
- ✅ **Gemini Pro** (Qualidade similar ao GPT-4)
- ✅ **Gemini Flash** (Versão rápida/barata)
- ✅ **15 RPM gratuitos** (Excelente para testes)

#### **Como Configurar:**
1. Acesse [Google AI Studio](https://aistudio.google.com/)
2. Login com conta Google
3. Get API Key → Create API Key
4. Sem necessidade de billing inicial (15 req/min grátis)

#### **Configuração:**
```bash
GOOGLE_AI_API_KEY="AIzaSyA-exemplo-sua-chave-google-ai"
```

#### **Custos Google AI:**
- **Gemini Pro**: ~$7.00 por 1M tokens de entrada
- **Gemini Flash**: ~$0.35 por 1M tokens de entrada
- **Estimativa**: $5-50/mês para uso moderado

---

### **🥉 OPÇÃO 3: Anthropic Claude (Melhor Qualidade)**

#### **Funcionalidades:**
- ✅ **Claude 3.5 Sonnet** (Excelente para jurídico)
- ✅ **Claude 3 Haiku** (Versão rápida)
- ✅ **200k tokens de contexto** (Documentos longos)

#### **Como Configurar:**
1. Acesse [Anthropic Console](https://console.anthropic.com/)
2. Sign up → Verify email
3. Add payment method (obrigatório)
4. API Keys → Create Key

#### **Configuração:**
```bash
ANTHROPIC_API_KEY="sk-ant-exemplo-sua-chave-anthropic"
```

#### **Custos Anthropic:**
- **Claude 3.5 Sonnet**: ~$15.00 por 1M tokens de entrada
- **Claude 3 Haiku**: ~$0.25 por 1M tokens de entrada
- **Estimativa**: $10-100/mês para uso moderado

---

## 🛡️ **3. SEGURANÇA OPCIONAL**

### **reCAPTCHA v3 (Recomendado)**

#### **Para que serve:**
- Protege contra bots e ataques automatizados
- Melhora segurança do Firebase App Check

#### **Como Configurar:**
1. Acesse [Google reCAPTCHA](https://www.google.com/recaptcha/admin/)
2. Create → reCAPTCHA v3
3. Label: "LexAI Production"
4. Domains: `seu-dominio.com`, `localhost`

#### **Configuração:**
```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="6LcExemplo-chave-site-recaptcha"
```

#### **Custos:**
- **Gratuito** até 1M verificações/mês

---

## 📊 **4. ANALYTICS E MONITORAMENTO**

### **Firebase Analytics (Incluído)**
- Métricas de usuário automaticamente configuradas
- Dashboards no Firebase Console
- **Custo**: Gratuito

### **Vercel Analytics (Opcional)**
- Performance metrics detalhadas
- Core Web Vitals
- **Custo**: Gratuito no plano Pro ($20/mês)

---

## 🔧 **5. TEMPLATE COMPLETO .env.local**

```bash
# ===========================================
# 🔥 FIREBASE - OBRIGATÓRIO
# ===========================================

# Frontend Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="SUA_CHAVE_FIREBASE_API"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="seu-projeto.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="seu-projeto-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="seu-projeto.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abcdef123456"

# Backend Configuration (Admin SDK)
FIREBASE_PROJECT_ID="seu-projeto-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxx@seu-projeto.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_PRIVADA_COMPLETA\n-----END PRIVATE KEY-----"

# ===========================================
# 🤖 AI APIS - PELO MENOS UMA OBRIGATÓRIA
# ===========================================

# OpenAI (Recomendado para produção)
OPENAI_API_KEY="sk-proj-SUA_CHAVE_OPENAI_AQUI"

# Google AI (Melhor custo-benefício)
GOOGLE_AI_API_KEY="AIzaSyA-SUA_CHAVE_GOOGLE_AI_AQUI"

# Anthropic Claude (Melhor qualidade)
ANTHROPIC_API_KEY="sk-ant-SUA_CHAVE_ANTHROPIC_AQUI"

# ===========================================
# 🛡️ SEGURANÇA - OPCIONAL
# ===========================================

# reCAPTCHA v3 (Recomendado)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="6Lc-SUA_CHAVE_RECAPTCHA_SITE"

# ===========================================
# 🌍 AMBIENTE
# ===========================================

NODE_ENV="production"
NEXT_PUBLIC_APP_ENV="production"
```

---

## 💰 **6. RESUMO DE CUSTOS**

### **Configuração Mínima (Recomendada):**
- **Firebase Blaze**: ~$10-30/mês
- **Google AI**: ~$5-20/mês
- **Total**: ~$15-50/mês para 1k usuários ativos

### **Configuração Premium:**
- **Firebase Blaze**: ~$20-50/mês
- **OpenAI**: ~$50-200/mês
- **Anthropic**: ~$30-100/mês
- **Total**: ~$100-350/mês para 5k+ usuários ativos

### **Configuração Startup (Economia):**
- **Firebase Blaze**: ~$5-15/mês
- **Google AI**: Gratuito/~$5/mês
- **Total**: ~$5-20/mês para centenas de usuários

---

## ✅ **7. CHECKLIST DE CONFIGURAÇÃO**

### **Firebase Setup:**
- [ ] Projeto criado com plano Blaze
- [ ] Authentication configurado (Email + Google)
- [ ] Firestore em modo produção
- [ ] Storage configurado
- [ ] Chaves de API obtidas (frontend + backend)
- [ ] Domains autorizados configurados

### **AI APIs Setup:**
- [ ] Pelo menos uma API de IA configurada e testada
- [ ] Billing configurado (se necessário)
- [ ] Rate limits apropriados definidos
- [ ] Chaves de API válidas e funcionando

### **Segurança:**
- [ ] reCAPTCHA v3 configurado (opcional)
- [ ] Firestore Rules ativas
- [ ] Storage Rules ativas
- [ ] Environment variables seguras

### **Teste Final:**
- [ ] `npm run build` executa sem erros
- [ ] `npm run typecheck` sem erros
- [ ] Login funciona em produção
- [ ] Upload de arquivos funciona
- [ ] Geração de documentos funciona

---

## 🆘 **8. TROUBLESHOOTING**

### **Erro: "Firebase configuration missing"**
- ✅ Verifique se todas as variáveis `NEXT_PUBLIC_FIREBASE_*` estão no `.env.local`
- ✅ Reinicie o servidor de desenvolvimento

### **Erro: "API key invalid"**
- ✅ Confirme que copiou a chave completa
- ✅ Verifique se não há espaços extras
- ✅ Teste a chave diretamente na documentação da API

### **Erro: "Firestore permission denied"**
- ✅ Verifique se o usuário está autenticado
- ✅ Confirme que as Firestore Rules estão corretas

### **Erro: "OpenAI quota exceeded"**
- ✅ Verifique billing na plataforma OpenAI
- ✅ Aumente o rate limit ou mude para Google AI temporariamente

---

## 📞 **9. SUPORTE**

### **Links Úteis:**
- [Firebase Console](https://console.firebase.google.com/)
- [OpenAI Platform](https://platform.openai.com/)
- [Google AI Studio](https://aistudio.google.com/)
- [Anthropic Console](https://console.anthropic.com/)
- [Google reCAPTCHA](https://www.google.com/recaptcha/admin/)

### **Documentação:**
- [Firebase Docs](https://firebase.google.com/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Google AI Docs](https://ai.google.dev/docs)
- [Anthropic API Docs](https://docs.anthropic.com/)

---

## 🎯 **PRÓXIMOS PASSOS**

1. **📋 Salve este documento** em local seguro
2. **🔑 Configure Firebase** (obrigatório)
3. **🤖 Escolha e configure 1 API de IA**
4. **🧪 Teste localmente** com `npm run dev`
5. **🚀 Deploy em produção**

**🎉 Sucesso! Sua aplicação LexAI estará 100% funcional!**