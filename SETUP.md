# 🚀 Guia de Setup - LexAI

## Pré-requisitos

- **Node.js 20+** (recomendado: use nvm)
- **npm** ou **yarn**
- **Git**
- **Conta Firebase** (plano Blaze para Functions)
- **APIs de IA** (OpenAI, Google AI, Anthropic)

---

## 📦 Instalação Local

### 1. Clone e Instale Dependências

```bash
git clone https://github.com/VitorCabralll/studio-1.git
cd studio-1
npm install

# Ou usando yarn
yarn install
```

### 2. Configure Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite com suas configurações
nano .env.local  # ou seu editor preferido
```

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

### OpenAI
1. Acesse [OpenAI Platform](https://platform.openai.com/api-keys)
2. Crie uma nova API key
3. Adicione em `.env.local`: `OPENAI_API_KEY=sk-...`

### Google AI (Gemini)
1. Acesse [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Crie uma API key
3. Adicione em `.env.local`: `GOOGLE_AI_API_KEY=...`

### Anthropic Claude
1. Acesse [Anthropic Console](https://console.anthropic.com/)
2. Crie uma API key
3. Adicione em `.env.local`: `ANTHROPIC_API_KEY=sk-ant-...`

---

## 🔥 Configuração Firebase

### 1. Firebase Web App Config
```bash
# No Firebase Console > Project Settings > Web apps
# Copie as configurações e adicione em .env.local:
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
# ... outras configs
```

### 2. Firebase Admin SDK
```bash
# No Firebase Console > Project Settings > Service Accounts
# Gere nova chave privada (JSON)
# Extraia os campos e adicione em .env.local:
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@your-project.iam.gserviceaccount.com
```

### 3. Firestore Rules
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem acessar apenas seus dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Workspaces - apenas membros
    match /workspaces/{workspaceId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.members;
    }
    
    // Agentes - apenas do workspace
    match /workspaces/{workspaceId}/agents/{agentId} {
      allow read, write: if request.auth != null;
    }
    
    // Documentos gerados - apenas do usuário
    match /documents/{documentId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## 🏃‍♂️ Executando o Projeto

### Desenvolvimento Frontend
```bash
# Terminal 1: Frontend Next.js
npm run dev
# Acesse: http://localhost:3000
```

### Firebase Emulators (Desenvolvimento Local)
```bash
# Terminal 2: Firebase Emulators completos
firebase emulators:start

# Serviços disponíveis:
# - App Hosting: http://localhost:5002
# - Functions: http://localhost:5001  
# - Firestore: http://localhost:8080
# - Authentication: http://localhost:9099
# - Storage: http://localhost:9199
# - UI Dashboard: http://localhost:4000
```

---

## 🧪 Testando o Orquestrador

### Teste Básico
```bash
# Execute os exemplos do orquestrador
npm run test:orchestrator

# Ou execute diretamente
npx tsx src/ai/orchestrator/example.ts
```

### Teste via API
```bash
# Com o projeto rodando, teste via curl:
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
npm run dev                      # Inicia frontend
npm run build                    # Build de produção
npm run lint                     # Executa linting
npm run type-check              # Verifica tipos TypeScript

# Firebase
firebase deploy                  # Deploy completo
firebase deploy --only functions # Deploy apenas functions
firebase deploy --only hosting  # Deploy apenas frontend

# Debugging
npm run debug:orchestrator       # Debug do orquestrador
npm run analyze:bundle          # Análise do bundle
```

---

## ❗ Troubleshooting

### Erro: "Firebase not initialized"
- Verifique se `.env.local` está configurado
- Confirme se o projeto Firebase está ativo
- Execute `firebase use --add your-project-id`

### Erro: "API key invalid"
- Verifique se as chaves das APIs de IA estão corretas
- Confirme se as APIs estão habilitadas nos respectivos consoles
- Verifique se há créditos/quota disponível

### Erro: "Module not found"
- Execute `npm install` novamente
- Limpe cache: `npm run clean` (se disponível)
- Verifique se está na versão correta do Node.js

### Performance Lenta
- Verifique se está usando Next.js em modo desenvolvimento
- Para produção, use `npm run build && npm start`
- Monitore uso de APIs com `ENABLE_TRACING=true`

---

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/VitorCabralll/studio-1/issues)
- **Documentação**: Consulte os arquivos `.md` na raiz do projeto
- **API Reference**: Veja `src/ai/orchestrator/types.ts` para tipos completos

---

**✅ Pronto! Agora você pode desenvolver e testar o LexAI localmente.**