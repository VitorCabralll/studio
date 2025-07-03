# 🧪 **Guia de Testes Internos - LexAI Staging**

> **Ambiente de testes configurado para validação completa das funcionalidades**

---

## 🌐 **Acesso ao Ambiente de Testes**

### **URL Staging**
```
https://lexai-ef0ab.web.app
```

### **Credenciais de Teste**
- **Usuário Teste 1**: `teste1@lexai.com.br` / `TesteSeguro123!`
- **Usuário Teste 2**: `teste2@lexai.com.br` / `TesteSeguro123!`
- **Admin**: `admin@lexai.com.br` / `AdminSeguro123!`

**🔒 Importante**: Todos os dados de teste são prefixados com `staging_` e isolados dos dados de produção.

---

## 📋 **Plano de Testes - 7 Dias**

### **DIA 1-2: Funcionalidades Básicas**

#### **✅ Autenticação**
- [ ] **Cadastro**: Criar nova conta
- [ ] **Login**: Fazer login com conta existente
- [ ] **Logout**: Fazer logout
- [ ] **Recuperação**: Recuperar senha (email)
- [ ] **Onboarding**: Completar configuração inicial

#### **✅ Navegação**
- [ ] **Landing Page**: Carregar página inicial
- [ ] **Dashboard**: Acessar área principal
- [ ] **Configurações**: Alterar configurações
- [ ] **Responsividade**: Testar mobile/tablet/desktop

---

### **DIA 3-4: Upload e OCR**

#### **✅ Upload de Arquivos**
- [ ] **PDF**: Upload de documento PDF
- [ ] **Imagem**: Upload de imagem (JPG, PNG)
- [ ] **Drag & Drop**: Arrastar e soltar arquivo
- [ ] **Validação**: Testar arquivos inválidos
- [ ] **Tamanho**: Testar limite de 5MB

#### **✅ OCR (Reconhecimento de Texto)**
- [ ] **Extração**: Extrair texto de imagem
- [ ] **Qualidade**: Verificar qualidade do texto
- [ ] **Performance**: Medir tempo de processamento
- [ ] **Erro**: Testar com imagem sem texto

---

### **DIA 5-6: Pipeline de IA**

#### **✅ Geração de Documentos**
- [ ] **Petição**: Gerar petição simples
- [ ] **Contrato**: Gerar contrato básico
- [ ] **Parecer**: Gerar parecer jurídico
- [ ] **Qualidade**: Avaliar qualidade do output
- [ ] **Tempo**: Medir tempo de geração (< 2min)

#### **✅ Diferentes Casos**
- [ ] **Trabalhista**: Documento trabalhista
- [ ] **Civil**: Documento civil
- [ ] **Criminal**: Documento criminal
- [ ] **Empresarial**: Documento empresarial

---

### **DIA 7: Testes Avançados**

#### **✅ Workspace e Agentes**
- [ ] **Criar Workspace**: Configurar área de trabalho
- [ ] **Criar Agente**: Configurar agente personalizado
- [ ] **Gerenciar Documentos**: Organizar documentos
- [ ] **Compartilhar**: Compartilhar com outros usuários

#### **✅ Testes de Stress**
- [ ] **Múltiplos Uploads**: Enviar vários arquivos
- [ ] **Geração Simultânea**: Gerar múltiplos documentos
- [ ] **Sessões Longas**: Usar por 30+ minutos
- [ ] **Refresh**: Testar após refresh da página

---

## 🔍 **Como Testar**

### **Passo 1: Preparação**
1. Acesse `https://lexai-ef0ab.web.app`
2. Abra Ferramentas do Desenvolvedor (F12)
3. Monitore a aba Console para erros
4. Anote qualquer comportamento estranho

### **Passo 2: Execução**
1. Siga o checklist dia por dia
2. Teste em diferentes navegadores:
   - Chrome
   - Firefox
   - Edge
   - Safari (se disponível)
3. Teste em diferentes dispositivos:
   - Desktop
   - Tablet
   - Mobile

### **Passo 3: Documentação**
1. Anote bugs encontrados
2. Capture screenshots de erros
3. Registre tempos de resposta
4. Avalie qualidade dos outputs

---

## 🐛 **Como Reportar Bugs**

### **Template de Bug Report**
```
**🐛 Bug:** [Título curto]

**📱 Ambiente:**
- Navegador: [Chrome/Firefox/etc]
- Dispositivo: [Desktop/Mobile/Tablet]
- Resolução: [1920x1080/etc]

**🔄 Passos para Reproduzir:**
1. Passo 1
2. Passo 2
3. Passo 3

**❌ Resultado Atual:**
[O que aconteceu]

**✅ Resultado Esperado:**
[O que deveria acontecer]

**📸 Screenshots:**
[Anexar capturas de tela]

**🔍 Logs do Console:**
[Copiar erros do console]

**⚠️ Severidade:**
- [ ] Crítico (quebra funcionalidade)
- [ ] Alto (problema grave)
- [ ] Médio (inconveniente)
- [ ] Baixo (cosmético)
```

---

## 📊 **Métricas a Observar**

### **Performance**
- ⏱️ **Tempo de carregamento**: < 3s
- 🔄 **Tempo de upload**: < 10s
- 🧠 **Tempo de IA**: < 2min
- 📱 **Responsividade**: Smooth em mobile

### **Qualidade**
- 📝 **Qualidade do OCR**: > 90% precisão
- 🤖 **Qualidade da IA**: Coerente e útil
- 🎨 **UI/UX**: Intuitivo e bonito
- 🔒 **Segurança**: Dados isolados

### **Estabilidade**
- 🚫 **Erros JavaScript**: 0 críticos
- 🔧 **Funcionalidades**: 100% funcionais
- 💾 **Dados**: Persistem corretamente
- 🔄 **Refresh**: Mantém estado

---

## 🚨 **Limitações do Staging**

### **Recursos Limitados**
- 📁 **Arquivos**: Máximo 5MB
- 📄 **Documentos**: 10 por usuário
- 🔄 **Requests**: 50 por hora
- 💰 **Custo**: $5/dia máximo

### **Dados de Teste**
- 🗂️ **Namespace**: Todos os dados têm prefixo `staging_`
- 🔄 **Cleanup**: Dados removidos após 7 dias
- 🚫 **Produção**: Dados de produção protegidos
- 👥 **Usuários**: Apenas contas de teste

---

## ✅ **Critérios de Aprovação**

### **Funcionalidade** (Obrigatório)
- [ ] 100% das funcionalidades core funcionam
- [ ] 0 erros críticos
- [ ] Upload/OCR funciona consistentemente
- [ ] Pipeline IA gera documentos válidos

### **Performance** (Obrigatório)
- [ ] Carregamento inicial < 3s
- [ ] Todas as ações < 10s (exceto IA)
- [ ] Responsivo em mobile
- [ ] Sem memory leaks

### **Qualidade** (Desejável)
- [ ] OCR com > 90% precisão
- [ ] IA gera conteúdo coerente
- [ ] UI intuitiva e bonita
- [ ] Poucos bugs não-críticos

---

## 🎯 **Próximos Passos**

### **Após Testes Aprovados**
1. **Correção de Bugs**: Resolver problemas encontrados
2. **Otimizações**: Melhorar performance
3. **Deploy Produção**: Preparar ambiente final
4. **Documentação**: Criar guias de usuário
5. **Marketing**: Preparar lançamento

### **Se Testes Reprovados**
1. **Análise**: Identificar problemas críticos
2. **Correções**: Desenvolver fixes
3. **Reteste**: Nova rodada de testes
4. **Aprovação**: Aguardar nova aprovação

---

**🎉 Bons testes! Seu feedback é essencial para o sucesso do LexAI.**