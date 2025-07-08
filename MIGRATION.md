# 🚀 Migração LexAI - Claude Code para WindSurf/VS Code

## ✅ Sim, você pode salvar tudo no GitHub e importar!

Todas as configurações já foram criadas e commitadas no repositório. Basta clonar o projeto no novo IDE.

---

## 🔧 Configurações Criadas

### **WindSurf** (.windsurf/settings.json)
- ✅ Configurações de IA habilitadas (Claude 3.5 Sonnet)
- ✅ Auto-complete inteligente
- ✅ Code generation e review
- ✅ Context awareness
- ✅ Todas as configurações do projeto

### **VS Code** (.vscode/settings.json + extensions.json)
- ✅ Configurações TypeScript/React
- ✅ Prettier + ESLint
- ✅ Tailwind CSS support
- ✅ File nesting otimizado
- ✅ Extensões recomendadas

---

## 📋 Processo de Migração

### **1. Backup GitHub**
```bash
git add .
git commit -m "🔧 CONFIG: Adicionar configurações WindSurf e VS Code"
git push origin main
```

### **2. Novo IDE - Clone**
```bash
git clone https://github.com/seu-usuario/lexai.git
cd lexai
npm install
```

### **3. Configurar Ambiente**
```bash
# Instalar dependências
npm install

# Configurar Firebase CLI
npm install -g firebase-tools
firebase login

# Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas chaves
```

### **4. Extensões Necessárias**

#### **WindSurf**
- Já vem com IA integrada
- Configurações automáticas via .windsurf/settings.json

#### **VS Code**
- Instalar extensões recomendadas (prompt automático)
- Ou manualmente: `Ctrl+Shift+P` → "Extensions: Show Recommended Extensions"

---

## 🎯 Comandos Essenciais Pós-Migração

```bash
# Verificar configuração
npm run typecheck
npm run lint

# Desenvolvimento
npm run dev

# Build
npm run build

# Firebase
firebase emulators:start
```

---

## 🔐 Variáveis de Ambiente Necessárias

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=sua_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto
FIREBASE_PRIVATE_KEY=sua_private_key
FIREBASE_CLIENT_EMAIL=seu_email

# APIs IA
OPENAI_API_KEY=sua_key
GOOGLE_AI_API_KEY=sua_key
ANTHROPIC_API_KEY=sua_key

# Ambiente
NEXT_PUBLIC_APP_ENV=development
```

---

## 💡 Dicas Importantes

### **WindSurf**
- ✅ IA nativa - melhor para desenvolvimento assistido
- ✅ Context awareness automático
- ✅ Sugestões inteligentes baseadas no projeto

### **VS Code**
- ✅ Ecossistema robusto de extensões
- ✅ GitHub Copilot integrado
- ✅ Debugging avançado

### **Ambos**
- ✅ Configurações sincronizadas via Git
- ✅ Formatação automática (Prettier)
- ✅ Linting (ESLint)
- ✅ TypeScript intellisense otimizado

---

## 🚨 Troubleshooting

### **Erro de dependências**
```bash
rm -rf node_modules package-lock.json
npm install
```

### **Erro TypeScript**
```bash
npm run typecheck
# Resolver erros mostrados
```

### **Erro Firebase**
```bash
firebase login
firebase use --add
```

---

## 📁 Estrutura Mantida

```
lexai/
├── .vscode/           # ✅ Configurações VS Code
├── .windsurf/         # ✅ Configurações WindSurf
├── src/               # ✅ Código fonte
├── CLAUDE.md          # ✅ Configurações Claude
├── MIGRATION.md       # ✅ Este arquivo
└── package.json       # ✅ Scripts e dependências
```

---

**✅ Tudo pronto para migração!** Faça commit das configurações e clone no novo IDE.