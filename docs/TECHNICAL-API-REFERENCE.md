# 🔧 LexAI - Referência Técnica de APIs

> **Para desenvolvedores**: Detalhes técnicos de implementação e integração das APIs

---

## 🏗️ **ARQUITETURA DE APIs**

### **Fluxo de Dados:**
```
Usuario → Frontend (Next.js) → Firebase Auth → Firestore
                ↓
        AI Orchestrator → OpenAI/Google/Anthropic → Documento Final
                ↓
        Firebase Storage ← OCR Local (Tesseract.js)
```

---

## 🔥 **1. FIREBASE IMPLEMENTATION**

### **Configuração (src/lib/firebase.ts):**
```typescript
// Validação automática de ambiente
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  throw new Error('NEXT_PUBLIC_FIREBASE_API_KEY is required');
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ... outras configurações
};
```

### **Authentication (src/hooks/use-auth.tsx):**
```typescript
// Login com email/senha
const login = async (email: string, password: string) => {
  const auth = getAuth(firebaseApp);
  await signInWithEmailAndPassword(auth, email, password);
};

// Login com Google
const loginWithGoogle = async () => {
  const auth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
};
```

### **Firestore (src/services/user-service.ts):**
```typescript
// Operações CRUD com tratamento de erro
export async function getUserProfile(uid: string): Promise<ServiceResult<UserProfile>> {
  try {
    const db = getFirestore(firebaseApp);
    const docRef = doc(db, 'usuarios', uid);
    const docSnap = await getDoc(docRef);
    // ... lógica de processamento
  } catch (error) {
    return createServiceError(error, 'buscar perfil do usuário');
  }
}
```

### **Storage (src/services/storage-service.ts):**
```typescript
// Upload de arquivos com progress
export async function uploadTemplate(file: File, userId: string) {
  const storage = getStorage(firebaseApp);
  const storageRef = ref(storage, `templates/${userId}/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  // ... tracking de progresso
}
```

---

## 🤖 **2. AI ORCHESTRATOR**

### **Estrutura (src/ai/orchestrator/):**
```
orchestrator/
├── clients/           # Clientes para cada LLM
│   ├── openai.ts     # OpenAI GPT-4/3.5
│   ├── google.ts     # Google Gemini
│   ├── anthropic.ts  # Claude
│   └── index.ts      # Factory pattern
├── pipeline.ts       # Pipeline principal
├── processors.ts     # Processadores por etapa
├── router.ts         # Roteamento inteligente
└── types.ts          # Tipos TypeScript
```

### **Factory Pattern (src/ai/orchestrator/clients/index.ts):**
```typescript
export function createLLMClient(provider: string, options: any) {
  if (!options.apiKey) {
    throw new Error(`API key is required for ${provider} provider`);
  }
  
  switch (provider) {
    case 'openai':
      return new OpenAIClient(options);
    case 'google':
      return new GoogleAIClient(options);
    case 'anthropic':
      return new AnthropicClient(options);
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}
```

### **Pipeline de Processamento:**
```typescript
// 1. Sumarização de documentos (API barata)
const summary = await summarizeProcessor.process(context, 'google');

// 2. Estruturação do documento (API barata)
const structure = await structureProcessor.process(summary, 'google');

// 3. Geração por seção (API premium)
const sections = await generateProcessor.process(structure, 'openai');

// 4. Finalização e revisão (API premium)
const final = await finalizationProcessor.process(sections, 'anthropic');
```

---

## 🔑 **3. CONFIGURAÇÃO POR AMBIENTE**

### **Desenvolvimento (.env.local):**
```bash
# Firebase Development
NEXT_PUBLIC_FIREBASE_PROJECT_ID="lexai-dev"
FIREBASE_PROJECT_ID="lexai-dev"

# AI APIs com rate limits baixos
OPENAI_API_KEY="sk-proj-dev-key"
GOOGLE_AI_API_KEY="AIza-dev-key"

# Debug habilitado
NODE_ENV="development"
NEXT_PUBLIC_APP_ENV="development"
```

### **Produção (.env.production):**
```bash
# Firebase Production
NEXT_PUBLIC_FIREBASE_PROJECT_ID="lexai-prod"
FIREBASE_PROJECT_ID="lexai-prod"

# AI APIs com rate limits altos
OPENAI_API_KEY="sk-proj-prod-key"
GOOGLE_AI_API_KEY="AIza-prod-key"

# Optimizations ativadas
NODE_ENV="production"
NEXT_PUBLIC_APP_ENV="production"
```

---

## 📊 **4. RATE LIMITS E OTIMIZAÇÃO**

### **OpenAI:**
```typescript
// Rate limits por tier
const OPENAI_LIMITS = {
  'gpt-4': {
    rpm: 500,        // requests per minute
    tpm: 30000,      // tokens per minute
    cost: 0.03       // $ por 1k tokens
  },
  'gpt-3.5-turbo': {
    rpm: 3500,
    tpm: 90000,
    cost: 0.0015
  }
};
```

### **Google AI:**
```typescript
// Rate limits gratuitos vs pagos
const GOOGLE_LIMITS = {
  free: {
    rpm: 15,         // 15 requests/minute grátis
    tpm: 32000,
    cost: 0
  },
  paid: {
    rpm: 360,        // 360 requests/minute pago
    tpm: 120000,
    cost: 0.0007
  }
};
```

### **Anthropic:**
```typescript
// Rate limits por tier
const ANTHROPIC_LIMITS = {
  'claude-3-5-sonnet': {
    rpm: 50,
    tpm: 40000,
    cost: 0.015
  },
  'claude-3-haiku': {
    rpm: 50,
    tpm: 40000,
    cost: 0.00025
  }
};
```

---

## 🛡️ **5. SEGURANÇA E VALIDAÇÃO**

### **Environment Validation (src/lib/env-validation.ts):**
```typescript
// Validação automática na inicialização
export function validateEnvironment() {
  const required = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
```

### **API Key Validation:**
```typescript
// Validação de formato de chaves
export function validateAPIKeys() {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey && !openaiKey.startsWith('sk-proj-')) {
    console.warn('OpenAI API key format may be incorrect');
  }
  
  const googleKey = process.env.GOOGLE_AI_API_KEY;
  if (googleKey && !googleKey.startsWith('AIza')) {
    console.warn('Google AI API key format may be incorrect');
  }
}
```

### **Firestore Rules (firestore.rules):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem acessar apenas seus próprios dados
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Workspaces - apenas membros podem acessar
    match /workspaces/{workspaceId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.members;
    }
    
    // Documentos gerados - apenas do usuário
    match /documentos/{documentId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## 🔄 **6. ERROR HANDLING**

### **Service Result Pattern:**
```typescript
export interface ServiceResult<T> {
  data: T | null;
  error: ServiceError | null;
  success: boolean;
}

export interface ServiceError {
  code: string;
  message: string;
  details?: string;
}

// Uso
const result = await getUserProfile(userId);
if (result.success) {
  console.log('Dados:', result.data);
} else {
  console.error('Erro:', result.error?.message);
}
```

### **AI Client Error Handling:**
```typescript
export class OpenAIClient extends BaseLLMClient {
  async callLLM(request: LLMRequest): Promise<LLMResponse> {
    try {
      const response = await this.openai.chat.completions.create({
        model: request.model,
        messages: request.messages,
        temperature: request.temperature
      });
      
      return {
        content: response.choices[0].message.content,
        usage: response.usage,
        model: response.model
      };
    } catch (error) {
      if (error.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (error.status === 401) {
        throw new Error('Invalid OpenAI API key.');
      }
      throw error;
    }
  }
}
```

---

## 📈 **7. MONITORING E ANALYTICS**

### **Firebase Analytics:**
```typescript
// Tracking automático de eventos
import { getAnalytics, logEvent } from 'firebase/analytics';

export function trackDocumentGeneration(documentType: string) {
  const analytics = getAnalytics(firebaseApp);
  logEvent(analytics, 'document_generated', {
    document_type: documentType,
    timestamp: Date.now()
  });
}
```

### **Performance Monitoring:**
```typescript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function setupPerformanceMonitoring() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}
```

---

## 🚀 **8. DEPLOY E CI/CD**

### **Build Optimization:**
```typescript
// next.config.ts
export default {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@radix-ui/react-icons']
  },
  
  webpack: (config: any) => {
    // Bundle analysis
    if (process.env.ANALYZE === 'true') {
      config.plugins.push(new BundleAnalyzerPlugin());
    }
    return config;
  }
};
```

### **Environment Checks:**
```bash
#!/bin/bash
# scripts/validate-env.sh

echo "🔍 Validating environment variables..."

# Check Firebase
if [ -z "$NEXT_PUBLIC_FIREBASE_API_KEY" ]; then
  echo "❌ NEXT_PUBLIC_FIREBASE_API_KEY is missing"
  exit 1
fi

# Check AI APIs
if [ -z "$OPENAI_API_KEY" ] && [ -z "$GOOGLE_AI_API_KEY" ] && [ -z "$ANTHROPIC_API_KEY" ]; then
  echo "❌ At least one AI API key is required"
  exit 1
fi

echo "✅ Environment validation passed"
```

---

## 🧪 **9. TESTING**

### **API Integration Tests:**
```typescript
// tests/api-integration.test.ts
describe('AI Orchestrator', () => {
  test('should process document with OpenAI', async () => {
    const client = createLLMClient('openai', {
      apiKey: process.env.OPENAI_API_KEY
    });
    
    const result = await client.callLLM({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Test prompt' }]
    });
    
    expect(result.content).toBeDefined();
    expect(result.usage?.total_tokens).toBeGreaterThan(0);
  });
});
```

### **Firebase Integration Tests:**
```typescript
// tests/firebase-integration.test.ts
describe('Firebase Services', () => {
  test('should create user profile', async () => {
    const userId = 'test-user-123';
    const profileData = {
      cargo: 'Advogado',
      areas_atuacao: ['Direito Civil'],
      primeiro_acesso: true,
      initial_setup_complete: false,
      data_criacao: new Date()
    };
    
    const result = await createUserProfile(userId, profileData);
    
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject(profileData);
  });
});
```

---

## 📚 **10. REFERÊNCIAS E DOCUMENTAÇÃO**

### **Links Técnicos:**
- [Firebase Web SDK](https://firebase.google.com/docs/web/setup)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Google AI SDK](https://ai.google.dev/tutorials/web_quickstart)
- [Anthropic API Docs](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [Next.js 15 App Router](https://nextjs.org/docs/app)

### **Arquivos Importantes:**
- `src/lib/firebase.ts` - Configuração Firebase
- `src/hooks/use-auth.tsx` - Context de autenticação
- `src/ai/orchestrator/` - Sistema de IA
- `src/services/` - Serviços backend
- `firestore.rules` - Regras de segurança
- `.env.example` - Template de variáveis

### **Comandos Úteis:**
```bash
# Desenvolvimento
npm run dev                 # Desenvolvimento com Turbopack
npm run typecheck          # Verificação TypeScript
npm run lint               # ESLint

# Produção
npm run build:prod         # Build otimizado
npm run start              # Servidor produção

# Firebase
firebase emulators:start   # Emulators locais
firebase deploy            # Deploy produção
firebase use --add         # Adicionar projeto
```

---

**🎯 Este documento técnico complementa o `API-KEYS-SETUP.md` com detalhes de implementação para desenvolvedores.**