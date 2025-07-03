# ⚡ Referência Rápida LexAI

> **Guia de referência para desenvolvimento - comandos, padrões e configurações essenciais**

---

## 🚀 **Comandos Essenciais**

### **Desenvolvimento**
```bash
npm run dev          # Servidor desenvolvimento (Turbopack)
npm run build        # Build produção  
npm run typecheck    # Verificar tipos TypeScript
npm run lint         # Executar linter
```

### **Firebase**
```bash
firebase emulators:start    # Emulators locais
firebase deploy            # Deploy produção
firebase deploy --only hosting  # Deploy apenas frontend
```

### **Estrutura de Pastas**
```
src/
├── ai/orchestrator/     # 🧠 Pipeline IA multi-LLM
├── app/                # 📄 App Router Next.js
├── components/         # ⚛️ Componentes React + shadcn/ui
├── hooks/              # 🎣 Hooks customizados
├── services/           # 🔧 Firebase services
└── lib/                # 🛠️ Utilitários
```

---

## 📝 **Padrões de Código**

### **TypeScript**
- Use tipagem rigorosa (avoid `any`)
- Componentes funcionais com hooks
- Validação com Zod
- Interfaces para props

### **React/Next.js**
- shadcn/ui para componentes base
- Tailwind CSS para styling
- App Router (não Pages Router)
- Server Components quando possível

### **Firebase**
- Firestore para dados
- Storage para arquivos
- Auth para autenticação
- Functions para backend

---

## 🔧 **Configuração de Produção**

### **Variáveis Obrigatórias**
```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# APIs IA  
OPENAI_API_KEY=
GOOGLE_AI_API_KEY=
ANTHROPIC_API_KEY=
```

### **Segurança**
- ✅ OCR processamento local
- ✅ Chaves API apenas server-side
- ✅ Validação de uploads
- ✅ Isolamento por workspace

---

## 🧠 **Orquestrador de IA**

### **Pipeline Padrão**
1. **Sumarização** → Gemini Flash (barato)
2. **Análise Contexto** → Gemini Pro (qualidade)  
3. **Estrutura** → Gemini Flash (rápido)
4. **Geração Conteúdo** → Gemini Pro (premium)
5. **Montagem** → Local (sem custo)

### **Configuração Multi-LLM**
```typescript
// Prioridade: Google AI → OpenAI → Fallback
providers: ['google', 'openai', 'local']
```

---

## 📚 **Documentação Completa**

- **[README.md](./README.md)** - Visão geral completa
- **[SETUP.md](./SETUP.md)** - Configuração detalhada  
- **[docs/](./docs/)** - Documentação técnica
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Como contribuir

---

**🔄 Última atualização**: 02/07/2025