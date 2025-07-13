# 🧹 Guia de Limpeza do Código - LexAI

## Como Identificar Código Morto vs Funcional

### 🎯 **Critérios de Decisão**

#### ✅ **MANTER** (Código Funcional)
1. **Arquivos importados em outros lugares**
2. **Rotas definidas no App Router** (`/app/**/page.tsx`)
3. **Componentes UI essenciais** (botões, forms, layouts)
4. **Hooks utilizados** (verificar imports)
5. **Serviços core** (auth, firebase, orquestrador)
6. **API routes funcionais** (testadas e usadas)

#### 🗑️ **REMOVER** (Código Morto)
1. **Nunca importado** em nenhum arquivo
2. **Arquivos de teste/debug** não-funcionais
3. **Componentes de exemplo/showcase**
4. **Duplicatas** de funcionalidade
5. **Arquivos temporários** (.md, scripts de teste)
6. **Código comentado** há muito tempo

#### ⚠️ **INVESTIGAR** (Incerto)
1. **API routes** (podem ser chamadas diretamente)
2. **Componentes de layout** (podem ser usados pelo Next.js)
3. **Hooks específicos** (podem ter uso condicional)
4. **Serviços** (podem ser importados dinamicamente)

---

## 📊 **Status Atual do Projeto**

### ✅ **Funcionalidades Ativas**
- ✅ Build/Deploy funcionando
- ✅ Magic UI migrado para motion.tsx
- ✅ Autenticação funcional
- ✅ Sistema de orquestração AI
- ✅ Interface responsiva

### 🔍 **Arquivos Identificados para Remoção**

#### 🗑️ **REMOÇÃO IMEDIATA** (100% seguro)
```bash
# Arquivos de teste
src/app/test/page.tsx
src/lib/auth-test-scenarios.ts

# Exemplos/showcase
src/components/examples/premium-showcase.tsx

# Debug não-funcional
src/components/debug/auth-debug.tsx
```

#### 🤔 **INVESTIGAR ANTES DE REMOVER**
```bash
# API Routes - podem ser chamadas externamente
src/app/api/agents/route.ts
src/app/api/generate/route.ts
src/app/api/orchestrator/route.ts

# Páginas potenciais
src/app/page.tsx (homepage?)
src/app/login/page.tsx (página de login?)
```

---

## 🛠️ **Ferramentas para Análise**

### 1. **Verificar se arquivo é importado**
```bash
# Procurar imports do arquivo
grep -r "from.*filename" src/
grep -r "import.*filename" src/
```

### 2. **Verificar rotas funcionais**
```bash
# Testar rota no navegador
curl http://localhost:3000/api/test
```

### 3. **Verificar componentes usados**
```bash
# Procurar referências ao componente
grep -r "ComponentName" src/
```

### 4. **Ver dependências de um arquivo**
```bash
# Ver o que o arquivo importa
head -20 src/path/to/file.tsx
```

---

## 📋 **Plano de Limpeza Sugerido**

### **Fase 1: Remoção Segura** (2-3 arquivos por vez)
1. ✅ Arquivos de teste óbvios
2. ✅ Componentes de exemplo/showcase  
3. ✅ Debug panels não-funcionais
4. ✅ Arquivos temporários (.md na raiz)

### **Fase 2: Investigação** (verificar um por um)
1. 🔍 API routes (testar se funcionam)
2. 🔍 Páginas potenciais (verificar se são rotas válidas)
3. 🔍 Hooks específicos (ver se são usados condicionalmente)

### **Fase 3: Limpeza Final**
1. 🧹 Componentes órfãos confirmados
2. 🧹 Arquivos de configuração antigos
3. 🧹 Dependências não-utilizadas no package.json

---

## ⚡ **Comandos Úteis**

### **Verificar se build ainda funciona**
```bash
npm run build
npm run typecheck
```

### **Buscar referências a um arquivo**
```bash
# Substituir FILENAME pelo nome do arquivo
rg "FILENAME" src/ --type ts --type tsx
```

### **Ver estrutura atual**
```bash
tree src/ -I "node_modules"
```

### **Verificar rotas definidas**
```bash
find src/app -name "page.tsx" -o -name "route.ts"
```

---

## 🎯 **Regra de Ouro**

> **"Se você não tem certeza se o arquivo é usado, NÃO DELETE ainda"**

1. ✅ Primeiro remova o que tem **100% de certeza** que é código morto
2. 🔍 Depois investigue os **casos duvidosos** um por um  
3. 🧪 Sempre teste o build após cada remoção
4. 📝 Mantenha um log do que foi removido (para reverter se necessário)

---

## 🚨 **Sinais de Alerta**

**NÃO remova se:**
- Está em `app/layout.tsx` ou `app/not-found.tsx`
- É um arquivo de configuração do Next.js
- Tem comentários indicando uso futuro/planejado
- É parte de uma feature ainda em desenvolvimento
- Build quebra após a remoção

**REMOVA com confiança se:**
- Nunca é importado em lugar nenhum
- É claramente um arquivo de teste/exemplo
- Build continua funcionando após remoção
- Não há referências no código