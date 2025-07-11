# ⚡ Referência Rápida LexAI

> **Guia de referência para desenvolvimento - comandos, padrões e configurações essenciais**

---

## 🚀 **Comandos Essenciais**

### **Desenvolvimento**
```bash
npm run dev          # Servidor desenvolvimento (Turbopack - Next.js 14.x)
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

## ⚠️ **Tratamento de Erros e Código Limpo**

### **Filosofia: Código Novo Sempre que Possível**
- 🔄 **Refatore ao invés de patchear**: Quando encontrar bugs, prefira reescrever o módulo
- ✨ **Clean slate approach**: Implemente soluções limpas ao invés de quick fixes
- 📐 **Padrões consistentes**: Mantenha arquitetura e convenções em novas implementações
- 🧪 **Test-driven**: Escreva testes para código novo antes da implementação

### **Estratégias de Error Handling**
```typescript
// ✅ Padrão: Error boundaries + proper typing
interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// ✅ Centralize error logging
const logError = (error: Error, context: string) => {
  console.error(`[${context}]`, error);
  // TODO: Implement Sentry/Firebase Crashlytics
};

// ✅ Use Result pattern para operações críticas
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };
```

### **Debugging Avançado**
- 🔍 **Extended thinking first**: Use `/think` para problemas complexos
- 📊 **Context analysis**: Entenda o problema completamente antes de codificar
- 🎯 **Root cause focus**: Identifique a causa raiz, não apenas sintomas
- 🔄 **Iterative refinement**: Implemente, teste, refine

### **Quando Refatorar vs. Patch**
| Situação | Ação Recomendada | Justificativa |
|----------|------------------|---------------|
| Bug em função legada | ✨ Reescrever | Oportunidade de melhoria |
| Error handling ausente | ✨ Implementar padrão | Consistência arquitetural |
| Código duplicado | ✨ Extrair utility | DRY principle |
| Performance issue | ✨ Otimizar algoritmo | Solução sustentável |
| Quick hotfix | ⚠️ Patch temporário | Apenas se urgente + TODO refactor |

---

## 🔥 **Firebase Auth + Firestore - Referência Rápida**

### **Para Claude Code: Problemas de Auth em Produção**
```bash
📚 CONSULTE PRIMEIRO: docs/FIREBASE_AUTH_PRODUCTION_GUIDE.md

🚨 PROBLEMAS COMUNS:
- "Permission denied" → Verificar timing + namespace + rules
- "Domain not authorized" → Firebase Console authorized domains  
- "Token ready immediately" em prod → Verificar NODE_ENV + delay
- Collection não encontrada → Environment-aware naming

✅ CONFIGURAÇÃO CORRETA:
- AuthDomain: lexai-ef0ab.firebaseapp.com (sempre)
- NODE_ENV: production (ativa correções específicas)
- Delay: 3s em produção para token propagation
- Collections: Direct naming em prod, namespace em dev
- Rules: request.auth != null (padrão 2024)

🔧 PADRÃO DE CÓDIGO:
const collection = process.env.NODE_ENV === 'production' 
  ? 'usuarios' 
  : addNamespace('usuarios');
```

---

## 🎯 **Diretrizes de Desenvolvimento Claude**

### **Abordagem Profissional**
- ✅ **Seja proativo**: Vá além do solicitado quando agregar valor
- ✅ **Crie arquivos**: Não há restrição para criar novos arquivos
- ✅ **Documente**: Crie documentação .md quando necessário
- ❌ **Evite gambiarras**: Sempre busque soluções profissionais
- 🔍 **Analise primeiro**: Investigue erros e problemas antes de agir
- 🧪 **Teste antes**: Verifique se mudanças não quebram o código

### **Fluxo de Trabalho Otimizado**
1. **🔍 Investigar** → Use `/think` para análise profunda
2. **📊 Analisar** → Context completo + impactos + dependências  
3. **📋 Planejar** → TodoWrite para tasks complexas (3+ steps)
4. **⚡ Implementar** → Batch tool calls + parallel execution
5. **✅ Validar** → `npm run typecheck && npm run lint`
6. **📝 Documentar** → Update CLAUDE.md se necessário

---

## 🔧 **Configurações Avançadas Claude Code**

### **Memory Management**
```bash
# Estrutura otimizada de memória
CLAUDE.md                    # 📄 Project memory (este arquivo)
.claude/settings.json        # ⚙️ Project settings
.claude/settings.local.json  # 👤 Personal settings (git-ignored)
```

### **Hooks Sugeridos**
```json
{
  "hooks": {
    "pre_bash": "echo 'Executando: $COMMAND'",
    "post_edit": "npm run typecheck --noEmit",
    "pre_commit": "./scripts/pre-commit-checks.sh"
  }
}
```

### **Comandos de Produtividade**
```bash
# Debugging
/think                    # Extended reasoning para problemas complexos
/memory                   # Edit CLAUDE.md rapidamente
#                        # Add quick memory notes

# Development
npm run dev --turbo      # Desenvolvimento com Turbopack
npm run typecheck        # SEMPRE antes de commit
npm run lint            # Code standards
```

### **Otimizações para Projetos Complexos**
- ✅ **Batch tool calls**: Múltiplas operações em paralelo
- ✅ **Context management**: Use Task tool para searches extensas
- ✅ **Memory hierarchy**: Project > User > Context
- ✅ **Git integration**: Automatic branch/PR workflows
- ✅ **Extended thinking**: Para arquitetura e debugging

---

**🔄 Última atualização**: 02/07/2025