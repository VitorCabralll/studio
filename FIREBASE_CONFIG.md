# Configuração Firebase - LexAI

## 🔥 Serviços Configurados

### 1. **App Hosting**
- **Backend ID:** `lexai-app`
- **Região:** `us-central1`
- **Port:** `5002`
- **Comando:** `npm run dev`

### 2. **Firestore Database**
- **Database:** `lexai`
- **Região:** `southamerica-east1`
- **Port:** `8080`
- **Rules:** `firestore.rules`
- **Indexes:** `firestore.indexes.json`

### 3. **Cloud Functions**
- **Linguagem:** TypeScript
- **Port:** `5001`
- **Source:** `functions/`
- **Predeploy:** lint + build

### 4. **Authentication**
- **Port:** `9099`
- **Providers:** Email/Password, Google (configurar)

### 5. **Cloud Storage**
- **Port:** `9199`
- **Rules:** `storage.rules`
- **Buckets:** Uploads de usuários, modelos .docx

### 6. **Emulator UI**
- **Port:** `4000` (auto)
- **Dashboard:** Centralizado

## 🚀 Comandos Principais

```bash
# Desenvolvimento local completo
firebase emulators:start

# Deploy produção
firebase deploy

# Deploy específico
firebase deploy --only functions
firebase deploy --only apphosting
firebase deploy --only firestore:rules

# Logs
firebase functions:log
firebase emulators:start --inspect-functions
```

## 📁 Arquivos de Configuração

```
studio/
├── firebase.json              # Config principal
├── .firebaserc               # Projeto ativo
├── firestore.rules           # Segurança Firestore
├── firestore.indexes.json    # Índices performance
├── storage.rules             # Segurança Storage
├── apphosting.yaml           # Config App Hosting
├── apphosting.emulator.yaml  # Config local
└── functions/                # Cloud Functions
    ├── package.json
    ├── tsconfig.json
    └── src/index.ts
```

## 🔐 Variáveis de Ambiente

```bash
# .env.local (frontend)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=lexai-ef0ab
# ... outras configs Firebase

# APIs de IA
OPENAI_API_KEY=sk-...
GOOGLE_AI_API_KEY=...
ANTHROPIC_API_KEY=sk-ant-...

# functions/.env (backend)
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@lexai-ef0ab.iam.gserviceaccount.com
```

## 🌐 URLs de Desenvolvimento

- **Frontend:** http://localhost:3000
- **App Hosting:** http://localhost:5002  
- **Functions:** http://localhost:5001
- **Firestore:** http://localhost:8080
- **Auth:** http://localhost:9099
- **Storage:** http://localhost:9199
- **UI Dashboard:** http://localhost:4000

## 🔧 Troubleshooting

### Erro: "Firebase not initialized"
```bash
firebase login
firebase use lexai-ef0ab
```

### Erro: "Emulator already running"
```bash
firebase emulators:kill
firebase emulators:start
```

### Performance lenta
- Use `firebase emulators:start --only firestore,functions`
- Configure `FIRESTORE_EMULATOR_HOST=localhost:8080`