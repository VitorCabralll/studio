# 🧪 **Ambiente Staging**

> **AMBIENTE DE TESTES INTERNOS - Para validação antes da produção**

---

## 🎯 **Para que serve**

**Objetivo:**
- ✅ Testes internos completos
- ✅ Validação de features
- ✅ Demos para stakeholders
- ✅ Testes de aceitação
- ✅ Preparação para produção

**Características:**
- 🔒 **Dados isolados** (prefixo `staging_`)
- 🎯 **Ambiente real** (como produção)
- 📊 **Monitoramento ativo** 
- 🔐 **Segurança reforçada**

---

## 🚀 **Como Usar**

### **Deploy para staging:**
```bash
# Script automatizado
./scripts/staging/deploy-staging.sh

# Manual (se necessário)
cp environments/staging/.env.staging .env.local
npm run build
firebase deploy --only hosting,firestore:rules
```

### **Acessar ambiente:**
- URL: `https://lexai-ef0ab.web.app`
- Banner laranja: "TESTES INTERNOS"
- Dados: prefixo `staging_`

---

## ⚙️ **Configurações Específicas**

### **Limites (controlados):**
- 📁 **Arquivos**: 5MB máximo
- 📄 **Documentos**: 10 por usuário
- 🔄 **Requests**: 50 por hora
- 💰 **Custo**: $5/dia máximo

### **Monitoramento:**
- 📊 Analytics ativado
- 🔍 Performance tracking
- 🚨 Error reporting
- 📈 Usage metrics

---

## 📂 **Dados de Staging**

### **Onde ficam:**
- Firestore: Collections com `staging_`
- Storage: Pasta `staging_uploads/`
- Auth: Usuários de teste

### **Gestão de dados:**
- 🗑️ Limpeza automática (7 dias)
- 💾 Backup diário
- 🔄 Reset sob demanda

---

## 👥 **Contas de Teste**

```
Usuário 1: teste1@lexai.com.br / TesteSeguro123!
Usuário 2: teste2@lexai.com.br / TesteSeguro123!
Admin:     admin@lexai.com.br / AdminSeguro123!
```

---

## 🧪 **Processo de Testes**

### **Checklist obrigatório:**
- [ ] Autenticação funciona
- [ ] Upload/OCR processa
- [ ] IA gera documentos
- [ ] Interface responsiva
- [ ] Performance adequada

### **Duração recomendada:**
- 🗓️ **7 dias** de testes
- 👥 **3+ testadores** diferentes
- 📱 **Múltiplos dispositivos**
- 🌐 **Múltiplos navegadores**

---

## 📋 **Scripts de Gestão**

```bash
# Deploy staging
./scripts/staging/deploy-staging.sh

# Limpar dados de teste
./scripts/staging/cleanup-staging.sh

# Backup dados staging
./scripts/staging/backup-staging.sh

# Status do ambiente
./scripts/staging/status-staging.sh
```

---

## 🚨 **Regras Importantes**

### **✅ PODE fazer:**
- Testes completos de funcionalidade
- Demos para clientes internos
- Validação de qualidade
- Testes de performance

### **❌ NÃO fazer:**
- Usar dados reais de cliente
- Dar acesso a usuários finais
- Fazer alterações sem backup
- Pular para produção sem validar

---

## 📊 **Critérios de Aprovação**

**Para liberar para produção:**
- ✅ 0 bugs críticos
- ✅ Performance adequada
- ✅ Todos os testes passando
- ✅ Aprovação dos stakeholders

---

**🎯 Use este ambiente para garantir qualidade antes da produção!**