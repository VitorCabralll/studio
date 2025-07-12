# 🚀 Guia Prático: Sistema Orquestrador Rovo + Gemini + Claude

## 🎯 Como Usar o Sistema (Passo a Passo)

### **Passo 1: Conversa com o Rovo (Atlassian CLI)**

Você inicia a conversa com o Rovo sobre qualquer problema ou feature:

```
"Rovo, estou com um problema de login. Os usuários não conseguem 
fazer login na plataforma. Analise o problema e coordene o Gemini 
e Claude para resolver isso."
```

**O Rovo deve:**
1. Analisar o problema usando ferramentas Atlassian
2. Criar pasta `aiflows/00_rovo_orchestration/active_tasks/TASK-[ID]/`
3. Gerar `ROVO_ANALYSIS.md` com sua análise
4. Criar `GEMINI_INVESTIGATION.md` para delegação
5. Te dar os comandos específicos para executar

### **Passo 2: Delegação Manual para Gemini**

Após o Rovo criar os arquivos, você executa:

```bash
# Comando que você dará ao Gemini CLI
gemini analyze aiflows/00_rovo_orchestration/active_tasks/TASK-LOGIN-FIX/GEMINI_INVESTIGATION.md --deep-research --create-prp
```

**O Gemini deve:**
1. Ler o arquivo de investigação
2. Analisar profundamente o codebase
3. Criar PRP detalhado em `aiflows/01_planning/`
4. Gerar `CLAUDE_INSTRUCTIONS.md` em `aiflows/02_execution/`

### **Passo 3: Delegação Manual para Claude**

Após o Gemini completar, você executa:

```bash
# Comando que você dará ao Claude Code
/execute-prp aiflows/02_execution/TASK-LOGIN-FIX/CLAUDE_INSTRUCTIONS.md
```

**O Claude deve:**
1. Ler as instruções detalhadas
2. Implementar as correções
3. Executar validações
4. Reportar sucesso ou gerar ERROR_REPORT.md

## 🎭 Exemplos Práticos de Uso

### **Exemplo 1: Bug Crítico**
```
VOCÊ → ROVO: "Erro de login crítico afetando todos os usuários"
ROVO → Análise: Cria ROVO_ANALYSIS.md + GEMINI_INVESTIGATION.md
VOCÊ → GEMINI: "Investigue conforme aiflows/00_rovo_orchestration/active_tasks/TASK-LOGIN-001/GEMINI_INVESTIGATION.md"
GEMINI → Resultado: PRP-AUTH-FIX.md + CLAUDE_INSTRUCTIONS.md
VOCÊ → CLAUDE: "Execute conforme aiflows/02_execution/TASK-LOGIN-001/CLAUDE_INSTRUCTIONS.md"
CLAUDE → Resultado: Correção implementada + validações
```

### **Exemplo 2: Nova Feature**
```
VOCÊ → ROVO: "Preciso adicionar upload de avatar no perfil do usuário"
ROVO → Análise: Cria análise de feature + delegação para Gemini
VOCÊ → GEMINI: "Planeje a feature conforme especificado"
GEMINI → Resultado: PRP-AVATAR-UPLOAD.md + instruções para Claude
VOCÊ → CLAUDE: "Implemente a feature conforme planejado"
CLAUDE → Resultado: Feature desenvolvida + testes
```

### **Exemplo 3: Refatoração**
```
VOCÊ → ROVO: "O código de autenticação está complexo, precisa refatorar"
ROVO → Análise: Avalia impacto + estratégia de refatoração
VOCÊ → GEMINI: "Analise e crie plano de refatoração"
GEMINI → Resultado: Estratégia detalhada + passos de implementação
VOCÊ → CLAUDE: "Execute a refatoração seguindo o plano"
CLAUDE → Resultado: Código refatorado + testes mantidos
```

## 🔄 Fluxo de Comandos Típico

### **1. Iniciar com Rovo**
```
"Rovo, [descreva o problema/feature]. Analise e coordene Gemini e Claude para resolver."
```

### **2. Aguardar Análise do Rovo**
O Rovo criará:
- `ROVO_ANALYSIS.md` (sua análise)
- `GEMINI_INVESTIGATION.md` (delegação)
- Te dará comandos específicos

### **3. Executar Comando para Gemini**
```bash
gemini analyze [caminho-do-arquivo-de-investigação] --deep-research
```

### **4. Executar Comando para Claude**
```bash
/execute-prp [caminho-do-claude-instructions]
```

## 🎯 Vantagens do Sistema

### **Para Você:**
- ✅ **Menos carga mental**: Rovo analisa e planeja
- ✅ **Comandos claros**: Sabe exatamente o que executar
- ✅ **Rastreabilidade**: Tudo documentado
- ✅ **Especialização**: Cada agente faz o que faz melhor

### **Para os Agentes:**
- ✅ **Contexto claro**: Instruções específicas
- ✅ **Objetivos definidos**: Sabem exatamente o que fazer
- ✅ **Validação**: Critérios de sucesso claros
- ✅ **Coordenação**: Handoffs organizados

## 📋 Checklist de Uso

### **Antes de Começar:**
- [ ] Rovo configurado com contexto (`rovo_context.md`)
- [ ] Gemini CLI funcionando
- [ ] Claude Code funcionando
- [ ] Estrutura de pastas `aiflows/` criada

### **Para Cada Problema:**
- [ ] Conversar com Rovo sobre o problema
- [ ] Aguardar análise e delegações do Rovo
- [ ] Executar comando para Gemini
- [ ] Revisar resultados do Gemini
- [ ] Executar comando para Claude
- [ ] Validar resultados finais

## 🚨 Pontos de Atenção

### **Qualidade das Instruções:**
- Rovo deve ser **específico** nas delegações
- Gemini deve criar **CLAUDE_INSTRUCTIONS.md detalhado**
- Claude deve **validar** antes e depois da execução

### **Comunicação:**
- **Sempre** usar os arquivos `.md` para comunicação
- **Nunca** pular etapas do fluxo
- **Sempre** validar resultados antes de prosseguir

### **Organização:**
- Manter estrutura de pastas organizada
- Arquivar tarefas concluídas
- Documentar lições aprendidas

## 🎯 Próximos Passos

### **Teste Imediato:**
1. Configure o Rovo com o contexto criado
2. Use o exemplo de login como teste
3. Execute o fluxo completo uma vez
4. Ajuste conforme necessário

### **Otimizações Futuras:**
1. Refinar contextos dos agentes
2. Melhorar templates baseado na experiência
3. Criar mais exemplos de uso
4. Documentar padrões que funcionam bem

## 🚀 Comece Agora!

**Teste com o exemplo de login:**
1. Abra o Atlassian CLI (Rovo)
2. Diga: "Analise o erro de login conforme o exemplo em aiflows/00_rovo_orchestration/active_tasks/EXEMPLO-LOGIN-FIX/"
3. Siga as instruções que o Rovo criar
4. Execute os comandos para Gemini e Claude
5. Valide os resultados

**Você está pronto para usar o sistema orquestrador!** 🎉