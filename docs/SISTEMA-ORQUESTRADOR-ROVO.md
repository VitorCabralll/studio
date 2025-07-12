# 🎯 Sistema Orquestrador: Atlassian CLI (Rovo) + Gemini + Claude

## 🚀 Visão Geral Estratégica

Você está certo em querer usar o **Atlassian CLI (Rovo)** como orquestrador principal! Baseado na sua estrutura atual do AI Flows, vou propor um sistema onde:

- **🎭 Rovo (Atlassian CLI)**: Orquestrador e Analista Principal
- **🧠 Gemini CLI**: Investigador e Planejador Profundo  
- **⚡ Claude Code**: Executor e Implementador

## 🏗️ Arquitetura do Sistema Orquestrado

### 1. **Rovo como Orquestrador Central**
```
[VOCÊ] → [ROVO] → [Análise + Delegação] → [Gemini/Claude]
                     ↓
                [Arquivos .md]
                     ↓
                [Coordenação]
```

### 2. **Fluxo de Trabalho Proposto**

#### **Fase 1: Análise e Orquestração (Rovo)**
1. Você conversa com o Rovo sobre um problema/feature
2. Rovo analisa o contexto usando suas ferramentas Atlassian
3. Rovo cria arquivos `.md` estruturados para delegação
4. Rovo define qual agente deve executar cada parte

#### **Fase 2: Investigação Profunda (Gemini)**
1. Rovo delega investigação ao Gemini via arquivo `.md`
2. Gemini pesquisa, analisa codebase, cria PRPs/PRDs
3. Gemini gera `CLAUDE_INSTRUCTIONS.md` detalhado

#### **Fase 3: Execução (Claude)**
1. Rovo delega execução ao Claude via `CLAUDE_INSTRUCTIONS.md`
2. Claude implementa, testa, valida
3. Claude reporta resultados via `ERROR_REPORT.md` ou sucesso

## 📁 Estrutura de Arquivos para Orquestração

```
aiflows/
├── 00_rovo_orchestration/          # NOVO: Pasta do Rovo
│   ├── active_tasks/               # Tarefas em andamento
│   ├── delegation_queue/           # Fila de delegação
│   └── coordination_logs/          # Logs de coordenação
├── 01_planning/                    # Gemini trabalha aqui
├── 02_execution/                   # Claude trabalha aqui
└── shared_context/
    ├── rovo_context.md            # NOVO: Contexto do Rovo
    ├── gemini_context.md          # Já existe
    └── claude_context.md          # Já existe
```

## 🎯 Templates de Delegação

### Template: `ROVO_ANALYSIS.md`
```markdown
# Análise Rovo: [PROBLEMA/FEATURE]

## Contexto do Problema
- **Origem**: [Descrição do problema relatado]
- **Impacto**: [Análise de impacto usando ferramentas Atlassian]
- **Prioridade**: [Alta/Média/Baixa]

## Estratégia de Delegação
- **Para Gemini**: [O que investigar/planejar]
- **Para Claude**: [O que implementar]
- **Dependências**: [Entre as tarefas]

## Arquivos de Delegação Criados
- [ ] `GEMINI_INVESTIGATION.md`
- [ ] `CLAUDE_EXECUTION.md` (será criado pelo Gemini)

## Critérios de Sucesso
- [ ] Problema resolvido
- [ ] Testes passando
- [ ] Documentação atualizada
```

### Template: `GEMINI_INVESTIGATION.md`
```markdown
# Investigação Gemini: [TAREFA]

## Missão do Gemini
[Instruções específicas do que o Gemini deve investigar]

## Contexto Fornecido pelo Rovo
[Análise inicial do Rovo]

## Deliverables Esperados
- [ ] PRP.md detalhado
- [ ] CLAUDE_INSTRUCTIONS.md
- [ ] Análise de riscos

## Deadline
[Prazo estimado]
```

## 🔄 Comandos de Orquestração

### Para o Rovo (Atlassian CLI):
```bash
# Comando que você dará ao Rovo
"Analise o erro de login, crie estratégia de investigação para Gemini e plano de execução para Claude"
```

### Para o Gemini CLI:
```bash
# Comando baseado no arquivo do Rovo
gemini analyze aiflows/00_rovo_orchestration/active_tasks/TASK-LOGIN-FIX/GEMINI_INVESTIGATION.md --deep-research --create-prp
```

### Para o Claude Code:
```bash
# Comando baseado no arquivo do Gemini
/execute-prp aiflows/02_execution/TASK-LOGIN-FIX/CLAUDE_INSTRUCTIONS.md
```

## 🎭 Configuração do Rovo como Orquestrador

### Contexto para o Rovo (`rovo_context.md`):
```markdown
# Rovo Context: Orquestrador de Agentes LexAI

## Sua Missão
Você é o ORQUESTRADOR PRINCIPAL do sistema multi-agente LexAI. Sua responsabilidade é:

1. **ANALISAR** problemas/features usando suas ferramentas Atlassian
2. **ESTRATEGIZAR** a melhor abordagem de solução
3. **DELEGAR** tarefas específicas para Gemini e Claude
4. **COORDENAR** o fluxo entre os agentes
5. **VALIDAR** resultados finais

## Ferramentas Disponíveis
- Confluence: Para documentação e contexto
- Jira: Para tracking de issues
- Análise de código: Para entender impacto

## Padrão de Delegação
1. **Problemas Complexos**: Gemini investiga → Claude executa
2. **Bugs Simples**: Direto para Claude
3. **Features Novas**: Gemini planeja → Claude implementa
4. **Refatoração**: Gemini analisa → Claude refatora

## Templates que Você Deve Usar
- `ROVO_ANALYSIS.md`: Sua análise inicial
- `GEMINI_INVESTIGATION.md`: Delegação para Gemini
- `CLAUDE_EXECUTION.md`: Delegação para Claude (via Gemini)
```

## 🚀 Exemplo Prático: "Erro de Login"

### 1. Você para o Rovo:
```
"Rovo, estou com erro de login. Os usuários não conseguem fazer login. 
Analise o problema e coordene Gemini e Claude para resolver."
```

### 2. Rovo cria `ROVO_ANALYSIS.md`:
```markdown
# Análise Rovo: Erro de Login

## Contexto do Problema
- **Origem**: Usuários reportando falha no login
- **Impacto**: Crítico - bloqueia acesso à plataforma
- **Arquivos Relacionados**: auth-coordinator.ts, use-auth.tsx

## Estratégia de Delegação
- **Para Gemini**: Investigar auth flow, Firebase integration, race conditions
- **Para Claude**: Implementar correções baseadas na análise do Gemini

## Próximos Passos
1. Gemini: Análise profunda do auth flow
2. Claude: Implementação das correções
```

### 3. Rovo cria `GEMINI_INVESTIGATION.md`:
```markdown
# Investigação Gemini: Auth Flow Debug

## Missão do Gemini
Investigue profundamente o sistema de autenticação:
- Analise auth-coordinator.ts
- Verifique race conditions
- Identifique pontos de falha
- Crie PRP detalhado para correção

## Deliverables
- [ ] PRP-AUTH-FIX.md
- [ ] CLAUDE_INSTRUCTIONS.md detalhado
```

### 4. Você executa:
```bash
# Para Gemini
gemini analyze aiflows/00_rovo_orchestration/active_tasks/TASK-LOGIN-FIX/GEMINI_INVESTIGATION.md

# Depois para Claude
/execute-prp aiflows/02_execution/TASK-LOGIN-FIX/CLAUDE_INSTRUCTIONS.md
```

## 🎯 Vantagens Deste Sistema

1. **🎭 Rovo como Cérebro Central**: Usa ferramentas Atlassian para contexto completo
2. **🧠 Gemini como Investigador**: Foca em análise profunda e planejamento
3. **⚡ Claude como Executor**: Foca em implementação precisa
4. **📁 Comunicação via Arquivos**: Sistema já testado e funcionando
5. **🔄 Fluxo Padronizado**: Reduz sua carga mental
6. **📊 Rastreabilidade**: Tudo documentado e versionado

## 🚀 Implementação Imediata

Quer que eu crie os arquivos de configuração e templates para começar AGORA?

### Opções:
1. **🏃‍♂️ Setup Rápido**: Criar contextos e templates básicos
2. **🔧 Setup Completo**: Criar toda estrutura + scripts de automação
3. **🧪 Teste Piloto**: Fazer um teste com o erro de login atual
4. **📚 Documentação Detalhada**: Expandir este documento com mais exemplos