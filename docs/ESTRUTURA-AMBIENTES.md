# 🌍 **Nova Estrutura de Ambientes LexAI**

> **Organização profissional por pastas - Você nunca mais vai se confundir!**

---

## 📁 **Estrutura Atual (Organizada!)**

```
lexai/
├── 🌍 environments/              # TODOS OS AMBIENTES AQUI
│   ├── 📖 README.md             # Guia geral dos ambientes
│   │
│   ├── 🛠️ development/          # SEU AMBIENTE DE TRABALHO
│   │   ├── .env.development     # Configuração dev
│   │   └── README.md            # Como usar desenvolvimento
│   │
│   ├── 🧪 staging/              # AMBIENTE DE TESTES
│   │   ├── .env.staging         # Configuração staging  
│   │   ├── firestore.staging.rules
│   │   └── README.md            # Como usar staging
│   │
│   ├── 🚀 production/           # AMBIENTE REAL (CUIDADO!)
│   │   ├── .env.production      # Configuração produção
│   │   ├── firestore.rules      # Regras de produção
│   │   └── README.md            # Como usar produção
│   │
│   └── 🔧 shared/               # Configurações compartilhadas
│       └── config.shared.ts
│
├── 📜 scripts/                  # SCRIPTS POR AMBIENTE
│   ├── switch-env.sh            # Trocar ambiente facilmente
│   ├── 🛠️ development/
│   ├── 🧪 staging/
│   │   └── deploy-staging.sh
│   └── 🚀 production/
│       └── deploy-production.sh
│
└── 📋 docs/                     # DOCUMENTAÇÃO POR AMBIENTE
    ├── 🛠️ development/
    ├── 🧪 staging/
    └── 🚀 production/
```

---

## 🎯 **Como Identificar Cada Ambiente**

### **🔍 Visual Rápido:**

| Ambiente | Emoji | Cor | URL | Banner | Dados |
|----------|-------|-----|-----|--------|-------|
| **Development** | 🛠️ | Azul | `localhost:3000` | "DESENVOLVIMENTO" | `dev_*` |
| **Staging** | 🧪 | Laranja | `lexai-ef0ab.web.app` | "TESTES INTERNOS" | `staging_*` |
| **Production** | 🚀 | Vermelho | `lexai-ef0ab.web.app` | Sem banner | Sem prefixo |

---

## 🚀 **Como Usar (Super Fácil!)**

### **🔄 Trocar de Ambiente:**

```bash
# Método 1: Scripts NPM (recomendado)
npm run env:dev      # 🛠️ Desenvolvimento
npm run env:staging  # 🧪 Staging  
npm run env:prod     # 🚀 Produção

# Método 2: Script direto
./scripts/switch-env.sh development
./scripts/switch-env.sh staging
./scripts/switch-env.sh production

# Ver ambiente atual
npm run env:current
```

### **📋 Workflow Típico:**

```bash
# 1. Desenvolver (padrão)
npm run env:dev
npm run dev

# 2. Testar internamente
npm run env:staging
npm run deploy:staging

# 3. Liberar para usuários (CUIDADO!)
npm run env:prod
npm run deploy:prod
```

---

## 📊 **Comparação de Ambientes**

### **🛠️ Development (Seu dia a dia)**
- **Para que serve**: Desenvolvimento diário
- **Limitações**: 2MB, 5 docs, 20 req/h
- **Dados**: Prefixo `dev_`
- **Segurança**: Debug ativo
- **Custo**: ~$1/dia

### **🧪 Staging (Testes internos)**
- **Para que serve**: Validação antes produção
- **Limitações**: 5MB, 10 docs, 50 req/h
- **Dados**: Prefixo `staging_`
- **Segurança**: Monitoramento ativo
- **Custo**: ~$5/dia

### **🚀 Production (Usuários reais)**
- **Para que serve**: Operação comercial
- **Limitações**: 10MB, 100 docs, 1000 req/h
- **Dados**: Sem prefixo
- **Segurança**: Máxima
- **Custo**: Ilimitado (monitorado)

---

## 🔒 **Segurança por Ambiente**

### **Isolamento de Dados:**
- ✅ **Development**: Namespace `dev_` 
- ✅ **Staging**: Namespace `staging_`
- ✅ **Production**: Dados protegidos

### **Regras Firestore:**
- 🛡️ Cada ambiente tem suas regras
- 🔐 Produção extra protegida
- 🧪 Staging isolado de produção

---

## 📋 **Arquivos Principais**

### **⚙️ Configuração:**
- `environments/development/.env.development` - Seu ambiente
- `environments/staging/.env.staging` - Testes internos
- `environments/production/.env.production` - Usuários reais

### **📜 Scripts:**
- `scripts/switch-env.sh` - Trocar ambiente
- `scripts/staging/deploy-staging.sh` - Deploy testes
- `scripts/production/deploy-production.sh` - Deploy produção

### **📖 Documentação:**
- `environments/README.md` - Guia geral
- `environments/*/README.md` - Guia específico

---

## 🎯 **Benefícios da Nova Estrutura**

### **✅ Para Você:**
- 🔍 **Fácil identificar** qual ambiente usar
- 🔄 **Troca rápida** entre ambientes
- 🛡️ **Seguro** - impossível confundir
- 📖 **Documentado** - tudo explicado

### **✅ Para Equipe:**
- 👥 **Onboarding fácil** de novos devs
- 📋 **Processo claro** de deploy
- 🐛 **Menos bugs** em produção
- 📊 **Melhor qualidade** geral

### **✅ Para Projeto:**
- 🏢 **Padrão enterprise** implementado
- 🔧 **Manutenção simplificada**
- 📈 **Escalabilidade garantida**
- 💼 **Profissionalismo máximo**

---

## 🚨 **Regras de Ouro**

### **❌ NUNCA Faça:**
- Teste em produção sem staging
- Misture dados de ambientes
- Deploy direto para produção
- Ignore os namespaces

### **✅ SEMPRE Faça:**
- Use desenvolvimento para código novo
- Valide em staging antes produção
- Leia o README do ambiente
- Use os scripts fornecidos

---

## 🎉 **Conclusão**

**Agora você tem:**
- 📁 **Organização clara** por pastas
- 🎯 **Identificação visual** imediata
- 🔄 **Troca fácil** de ambientes
- 📖 **Documentação completa**
- 🛡️ **Segurança máxima**

**Nunca mais vai se confundir sobre qual é qual!**

---

**🎯 Use `npm run env:dev` e comece a desenvolver com confiança!**