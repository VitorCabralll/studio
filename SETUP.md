# 🚀 Guia de Setup - LexAI

> **📊 Status:** Documentação atualizada - Dezembro 2024  
> **⏱️ Tempo estimado:** 30-45 minutos para setup completo

## Pré-requisitos

- **Node.js 20+** (recomendado: use nvm para gerenciamento de versões)
- **npm** ou **yarn** (npm 10+ recomendado)
- **Git** (para clone do repositório)
- **Conta Firebase** (plano Blaze necessário para Cloud Functions)
- **APIs de IA** (pelo menos uma: OpenAI, Google AI ou Anthropic)
- **VSCode** (recomendado com extensões TypeScript/ESLint)

---

## 📦 Instalação Local

### 1. Clone e Instale Dependências

```bash
# Clone o repositório
git clone https://github.com/VitorCabralll/studio-1.git
cd studio-1

# Instale as dependências (recomendado npm)
npm install

# Ou usando yarn
yarn install

# Verifique se as dependências foram instaladas corretamente
npm run typecheck
```

### 2. Configure Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite com suas configurações
nano .env.local  # ou seu editor preferido (code .env.local para VSCode)
```

**⚠️ Importante:** O arquivo `.env.local` contém informações sensíveis e nunca deve ser commitado no Git.

### 3. Configure Firebase

```bash
# Instale Firebase CLI globalmente
npm install -g firebase-tools

# Faça login no Firebase
firebase login

# Inicialize o projeto (se necessário)
firebase init

# Configure o projeto atual
firebase use --add your-project-id
```

---

## 🔑 Configuração das APIs de IA

### OpenAI (Recomendado para início)
1. Acesse [OpenAI Platform](https://platform.openai.com/api-keys)
2. Crie uma nova API key com permissões para GPT-4
3. Configure billing e defina limits de uso
4. Adicione em `.env.local`: `OPENAI_API_KEY=sk-proj-...`

### Google AI (Gemini) - Gratuito para desenvolvimento
1. Acesse [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Crie uma API key (sem necessidade de billing inicial)
3. Adicione em `.env.local`: `GOOGLE_AI_API_KEY=AIza...`

### Anthropic Claude (Opcional)
1. Acesse [Anthropic Console](https://console.anthropic.com/)
2. Crie uma API key e configure billing
3. Adicione em `.env.local`: `ANTHROPIC_API_KEY=sk-ant-...`

**💡 Dica:** Para desenvolvimento, recomendamos começar com Google AI (gratuito) e depois adicionar OpenAI conforme necessário.

---

## 🔥 Configuração Firebase

### 1. Firebase Web App Config
```bash
# No Firebase Console > Project Settings > Web apps
# Crie um novo app web se necessário
# Copie TODAS as configurações e adicione em .env.local:
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abcdef123456"
```

### 2. Firebase Admin SDK
```bash
# No Firebase Console > Project Settings > Service Accounts
# Clique em "Generate new private key" e baixe o arquivo JSON
# Extraia os campos e adicione em .env.local:
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-...@your-project.iam.gserviceaccount.com"
FIREBASE_PROJECT_ID="your-project-id"
```

**⚠️ Segurança:** Mantenha a chave privada segura e nunca a exponha publicamente.

### 3. Configurar Domínios Autorizados
```bash
# No Firebase Console > Authentication > Settings > Authorized domains
# Adicione os domínios que você usará:
# - localhost (já incluído)
# - your-domain.com (para produção)
# - your-vercel-app.vercel.app (se usando Vercel)
```

### 4. Firestore Rules (já configuradas)
```javascript
// O arquivo firestore.rules já está configurado com:
// - Acesso restrito por usuário autenticado
// - Isolamento por workspace
// - Segurança adequada para produção
// Deploy automático com: firebase deploy --only firestore:rules
```

---

## 🏃‍♂️ Executando o Projeto

### Opção 1: Desenvolvimento Frontend Simples (Recomendado)
```bash
# Desenvolvimento apenas frontend (mais rápido)
npm run dev

# Acesse: http://localhost:3000
# ✅ Usa Firebase em produção
# ✅ Ideal para desenvolvimento de UI/UX
# ✅ Startup rápido (5-10 segundos)
```

### Opção 2: Desenvolvimento Completo com Emulators
```bash
# Terminal 1: Firebase Emulators
firebase emulators:start

# Terminal 2: Frontend Next.js
npm run dev

# Serviços disponíveis:
# - Frontend: http://localhost:3000
# - Firestore UI: http://localhost:4000
# - Functions: http://localhost:5001
# - Authentication: http://localhost:9099
# ✅ Ambiente completamente isolado
# ✅ Ideal para desenvolvimento de backend
```

**💡 Recomendação:** Use Opção 1 para desenvolvimento de frontend e Opção 2 apenas quando necessário testar Functions.

---

## 🧪 Testando o Orquestrador

### Teste Básico do Orquestrador
```bash
# Execute os exemplos do orquestrador (requer API keys configuradas)
npm run test:orchestrator

# Ou execute diretamente
npx tsx src/ai/orchestrator/example.ts

# Teste específico de um LLM
OPENAI_API_KEY=sk-... npx tsx src/ai/orchestrator/test-example.ts
```

### Teste via API (Com projeto rodando)
```bash
# Teste simples da API
curl -X GET http://localhost:3000/api/orchestrator/test

# Teste de processamento completo
curl -X POST http://localhost:3000/api/orchestrator/process \
  -H "Content-Type: application/json" \
  -d '{
    "taskType": "document_generation",
    "documentType": "petition",
    "instructions": "Gerar petição teste",
    "context": [
      {
        "type": "ocr_text",
        "content": "Texto do documento para teste",
        "source": "test.pdf"
      }
    ]
  }'

# Teste através da interface web (recomendado)
# 1. Faça login em http://localhost:3000
# 2. Complete o onboarding
# 3. Crie um agente
# 4. Teste a geração de documento
```

---

## 📁 Estrutura do Projeto

```
studio-1/
├── src/
│   ├── ai/orchestrator/          # 🧠 Orquestrador de IA
│   │   ├── types.ts             # Tipos TypeScript
│   │   ├── router.ts            # Roteamento multi-LLM
│   │   ├── pipeline.ts          # Pipeline principal
│   │   ├── processors.ts        # Processadores por etapa
│   │   ├── config.ts            # Configurações
│   │   └── index.ts             # Interface principal
│   ├── components/              # Componentes React
│   │   ├── ui/                  # Componentes base (shadcn/ui)
│   │   ├── layout/              # Layout (header, sidebar)
│   │   ├── forms/               # Formulários
│   │   └── ocr/                 # Componentes OCR
│   ├── hooks/                   # Hooks customizados
│   ├── services/                # Services (Firebase, etc.)
│   ├── lib/                     # Utilitários
│   └── app/                     # App Router do Next.js
├── functions/                   # Firebase Functions
├── docs/                        # Documentação adicional
└── public/                      # Assets estáticos
```

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev                      # Inicia frontend (Turbopack)
npm run build                    # Build de produção
npm run start                    # Serve build de produção
npm run lint                     # Executa ESLint
npm run lint -- --fix            # Corrige erros automáticos
npm run typecheck               # Verifica tipos TypeScript

# Testes
npm run test:orchestrator        # Testa orquestrador de IA

# Firebase
firebase deploy                  # Deploy completo
firebase deploy --only hosting   # Deploy apenas frontend
firebase deploy --only firestore # Deploy apenas rules
firebase emulators:start         # Inicia emulators locais

# Debugging e Análise
npx next info                    # Info do ambiente Next.js
npm ls                           # Lista dependências
```

---

## ❗ Troubleshooting

### 🔥 Firebase: "auth/unauthorized-domain"
```bash
# Solução:
# 1. Acesse Firebase Console > Authentication > Settings > Authorized domains
# 2. Adicione seu domínio atual (ex: localhost:3000, seu-domain.vercel.app)
# 3. Aguarde alguns minutos para propagação
```

### 🔥 Firebase: "not initialized" ou configuração inválida
```bash
# Verifique se todas as variáveis estão em .env.local:
echo "Verificando configuração Firebase:"
node -e "console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ API Key OK' : '❌ API Key missing')"

# Reconfigure o projeto se necessário:
firebase use --add your-project-id
firebase projects:list
```

### 🤖 API de IA: "key invalid" ou "quota exceeded"
```bash
# OpenAI - verifique quota e billing:
# https://platform.openai.com/usage

# Google AI - verifique se está dentro dos limits gratuitos:
# https://aistudio.google.com/app/apikey

# Teste a chave diretamente:
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models
```

### 📦 Node.js: "Module not found" ou erros de dependência
```bash
# Limpe tudo e reinstale:
rm -rf node_modules package-lock.json
npm install

# Verifique versão do Node.js:
node --version  # deve ser 20+
npm --version   # deve ser 10+

# Use nvm se necessário:
nvm install 20
nvm use 20
```

### 🐌 Performance Lenta
```bash
# Em desenvolvimento (normal ser mais lento):
npm run dev

# Para testar performance real:
npm run build
npm start

# Ative tracing para debug:
ENABLE_TRACING=true npm run dev
```

### 🔐 Erro de CORS ou "Access denied"
```bash
# Verifique se está acessando de domínio autorizado
# Adicione nos Authorized domains do Firebase Auth
# Para desenvolvimento local, use sempre http://localhost:3000
```

### 📱 Interface não carrega ou tela branca
```bash
# Verifique console do navegador (F12)
# Problemas comuns:
# 1. Variáveis de ambiente não carregadas
# 2. Erro de hidratação SSR
# 3. Problema de autenticação

# Debug mode:
NODE_ENV=development npm run dev
```

---

## 🎯 Verificação Final

Após o setup, verifique se tudo está funcionando:

```bash
# 1. Verificar build
npm run typecheck
npm run lint

# 2. Testar orquestrador (se APIs configuradas)
npm run test:orchestrator

# 3. Iniciar projeto
npm run dev

# 4. Testar no navegador:
# - http://localhost:3000 deve carregar
# - Login com Google deve funcionar
# - Onboarding deve fluir normalmente
```

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/VitorCabralll/studio-1/issues)
- **Documentação**: Consulte `README.md` e `CLAUDE.md` para referência completa
- **API Reference**: `src/ai/orchestrator/types.ts` para tipos do orquestrador
- **Architecture**: Veja `src/ai/orchestrator/README.md` para detalhes técnicos

## 🚦 Status de Funcionalidades

| Funcionalidade | Status | Como Testar |
|----------------|--------|--------------|
| ✅ **Autenticação** | Completo | Login/Signup funcionando |
| ✅ **Onboarding** | Completo | Fluxo após primeiro login |
| ✅ **OCR Local** | Completo | Upload de PDFs na interface |
| ✅ **Orquestrador IA** | Completo | `npm run test:orchestrator` |
| ✅ **Interface de Geração** | Completo | Criar agente → Gerar documento |
| 🔄 **Exportação PDF** | Parcial | Texto funciona, PDF pendente |
| ⬜ **APIs Públicas** | Pendente | Sem autenticação ainda |

---

## 🎉 Setup Concluído!

**Próximos passos:**
1. ✅ **Explore a interface** - Faça login e complete o onboarding
2. 🤖 **Crie seu primeiro agente** - Upload de template .docx
3. 📄 **Gere um documento** - Teste o pipeline completo
4. 🔧 **Configure APIs de IA** - Para funcionalidade completa
5. 📚 **Leia a documentação** - `README.md` e `CLAUDE.md`

**Recursos úteis:**
- 🐛 **Debug Auth**: Botão no canto inferior direito para debug de autenticação
- 🔍 **Logs detalhados**: Console do navegador (F12) mostra informações úteis
- 🧪 **Modo de teste**: Use Google AI (gratuito) para desenvolvimento

**🚀 Happy coding com LexAI!**