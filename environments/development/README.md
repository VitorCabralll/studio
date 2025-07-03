# 🛠️ **Ambiente Development**

> **SEU AMBIENTE DE TRABALHO DIÁRIO - Use sem medo!**

---

## 🎯 **Este é o SEU ambiente**

**Para que serve:**
- ✅ Desenvolvimento diário
- ✅ Testes rápidos de código
- ✅ Experimentação de features
- ✅ Debug e correções
- ✅ Desenvolvimento local

**Características:**
- 🔒 **Dados isolados** (prefixo `dev_`)
- 💰 **Limites baixos** (economia de API)
- 🐛 **Debug ativado** (mais logs)
- ⚡ **Performance relaxada** (mais info)

---

## 🚀 **Como Usar**

### **Ativar ambiente:**
```bash
# Copiar configuração
cp environments/development/.env.development .env.local

# Rodar localmente
npm run dev
```

### **Verificar se está no ambiente correto:**
- URL: `http://localhost:3000`
- Banner azul: "DESENVOLVIMENTO"
- Console: logs detalhados
- Dados: prefixo `dev_`

---

## ⚙️ **Configurações Específicas**

### **Limites (para economia):**
- 📁 **Arquivos**: 2MB máximo
- 📄 **Documentos**: 5 por usuário
- 🔄 **Requests**: 20 por hora
- 💰 **Custo**: ~$1/dia

### **Debug ativado:**
- 🔍 Console logs detalhados
- 📊 Performance monitoring
- 🐛 Error tracking local
- 🔥 Firebase debug mode

---

## 📂 **Dados de Desenvolvimento**

### **Onde ficam:**
- Firestore: Collections com `dev_`
- Storage: Pasta `dev_uploads/`
- Auth: Usuários normais (isolados)

### **Limpeza automática:**
- 🗑️ Dados removidos após 3 dias
- 🔄 Reset automático se necessário
- 💾 Backup não necessário

---

## 🔧 **Scripts Úteis**

```bash
# Limpar dados de dev
npm run dev:clean

# Reset completo
npm run dev:reset

# Ver logs de dev
npm run dev:logs

# Status do ambiente
npm run dev:status
```

---

## 🚨 **Lembretes Importantes**

### **✅ PODE fazer:**
- Quebrar coisas sem problema
- Testar features experimentais
- Fazer uploads de teste
- Gerar documentos de teste

### **❌ NÃO fazer:**
- Usar dados reais de cliente
- Testar com chaves de produção
- Fazer deploy deste ambiente

---

**🎯 Use este ambiente livremente! É feito para experimentação segura.**