# 🌍 **Ambientes LexAI**

> **Organização clara de ambientes para desenvolvimento seguro e profissional**

---

## 📁 **Estrutura de Ambientes**

```
environments/
├── 🛠️ development/     # SEU AMBIENTE DE TRABALHO
│   ├── .env.development
│   └── README.md
├── 🧪 staging/         # AMBIENTE DE TESTES  
│   ├── .env.staging
│   ├── firestore.staging.rules
│   └── README.md
├── 🚀 production/      # AMBIENTE REAL (CUIDADO!)
│   ├── .env.production
│   ├── firestore.rules
│   └── README.md
└── 🔧 shared/          # Configurações compartilhadas
    └── config.shared.ts
```

---

## 🎯 **Como Usar Cada Ambiente**

### **🛠️ Development (Seu Dia a Dia)**
```bash
# Copiar configuração de desenvolvimento
cp environments/development/.env.development .env.local

# Rodar localmente
npm run dev
```
**Use para:** Desenvolvimento diário, testes rápidos, experimentação

### **🧪 Staging (Testes Internos)**
```bash
# Deploy para staging
./scripts/staging/deploy-staging.sh
```
**Use para:** Testes internos, validação de features, demos

### **🚀 Production (Cliente Final)**
```bash
# Deploy para produção (CUIDADO!)
./scripts/production/deploy-production.sh
```
**Use para:** Releases finais, usuários reais

---

## 🚨 **Regras de Ouro**

### **❌ NUNCA Faça:**
- Teste em produção sem staging
- Commit de chaves API
- Deploy direto para produção
- Misture dados de teste com produção

### **✅ SEMPRE Faça:**
- Teste em development primeiro
- Valide em staging
- Backup antes de produção
- Use o ambiente correto

---

## 🔄 **Fluxo de Trabalho**

```
1. 🛠️ Development
   ↓ (desenvolver feature)
   
2. 🧪 Staging  
   ↓ (testar e validar)
   
3. 🚀 Production
   ↓ (release para usuários)
```

---

## 📋 **Como Identificar Cada Ambiente**

### **Visual no Navegador:**
- **Development**: Banner azul "DESENVOLVIMENTO"
- **Staging**: Banner laranja "TESTES INTERNOS"  
- **Production**: Sem banner

### **Nos Dados:**
- **Development**: Prefixo `dev_`
- **Staging**: Prefixo `staging_`
- **Production**: Sem prefixo

### **Nas URLs:**
- **Development**: `localhost:3000`
- **Staging**: `lexai-ef0ab.web.app` (com banner)
- **Production**: `lexai-ef0ab.web.app` (sem banner)

---

## 🔧 **Scripts Úteis**

```bash
# Trocar para desenvolvimento
npm run env:dev

# Trocar para staging  
npm run env:staging

# Trocar para produção
npm run env:prod

# Ver ambiente atual
npm run env:current
```

---

**🎯 Lembre-se: Cada ambiente tem seu propósito. Use o certo para cada situação!**