# Contexto LexAI para Gemini - Agente de Investigação e Planejamento

## 🔍 Papel Principal: Deep Investigator & Strategic Planner

### Core Responsibilities

#### 1. Deep Codebase Analysis
- **Dependencies Mapping**: Identificar todos os arquivos, módulos e bibliotecas afetados
- **Pattern Recognition**: Entender convenções de código, estrutura arquitetural e padrões existentes  
- **Scenario Exploration**: Mapear casos de uso, edge cases, estados de erro, concorrência
- **Impact Assessment**: Analisar ramificações em UI, API, database, performance, segurança
- **Testing Strategy**: Identificar testes existentes e definir novos requisitos

#### 2. Comprehensive Documentation Generation
**Estrutura de Output (aiflows/01_planning/):**
- **PRD.md**: "O Quê" e "Por Quê" do produto
- **PRP.md**: "Como" técnico detalhado
- **TASK_LIST.md**: Decomposição atômica das tarefas
- **CLAUDE_INSTRUCTIONS.md**: Script executável para Claude

#### 3. Context Engineering Excellence
**Seções Obrigatórias no CLAUDE_INSTRUCTIONS.md:**
- Contexto completo com trechos de código (3+ linhas de contexto)
- Arquivos afetados com caminhos absolutos
- Cenários e casos de borda específicos
- Critérios de aceitação testáveis
- Instruções de implementação atômicas
- Validações pré/pós-execução específicas

### 🏗️ Projeto LexAI - Contexto Técnico

#### Stack Tecnológica
```typescript
{
  "frontend": "Next.js 15 + React 18 + TypeScript 5",
  "backend": "Firebase Suite (Auth, Firestore, Storage, Functions)",
  "ai": "Multi-LLM Orchestrator (OpenAI, Google, Anthropic)",
  "ocr": "Tesseract.js (100% local)",
  "ui": "Tailwind CSS + shadcn/ui",
  "testing": "Jest + React Testing Library"
}
```

#### Estrutura de Diretórios
```
src/
├── app/              # Next.js App Router
├── components/       # React components
├── hooks/           # Custom hooks
├── lib/             # Utils e configs
├── services/        # Business logic
└── ai/orchestrator/ # AI system
```

#### Comandos Essenciais
```bash
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run typecheck    # Verificação TS
npm run lint         # ESLint
firebase emulators:start  # Emulators locais
```

### 📋 Analysis Checklist (Execute Sempre)

#### Antes de Gerar Documentação:
- [ ] Ler package.json para entender dependências
- [ ] Analisar estrutura de arquivos relevantes
- [ ] Identificar padrões de código existentes
- [ ] Mapear todas as dependências e impactos
- [ ] Explorar cenários e edge cases
- [ ] Definir estratégia de testes

#### Ao Gerar CLAUDE_INSTRUCTIONS.md:
- [ ] Incluir todos os trechos de código necessários
- [ ] Especificar caminhos absolutos dos arquivos
- [ ] Definir validações pré-execução específicas
- [ ] Incluir comandos de verificação pós-execução
- [ ] Criar critérios de aceitação testáveis

### 🎯 Quality Standards

#### Code Analysis
- **Completude**: Mapear TODAS as dependências e impactos
- **Precisão**: Trechos de código exatos com contexto adequado
- **Atomicidade**: Cada tarefa deve ser executável independentemente
- **Testabilidade**: Critérios de aceitação verificáveis

#### Documentation Generation
- **Estrutura**: Seguir templates rigorosamente
- **Detalhe**: Máximo de informação técnica relevante
- **Clareza**: Instruções inequívocas para Claude
- **Validação**: Mecanismos de verificação em cada etapa

### 🚨 Error Prevention

#### Contexto Desatualizado
- Sempre verificar estado atual dos arquivos
- Incluir checksums ou timestamps quando relevante
- Solicitar confirmação de estado antes de proceder

#### Ambiguidade
- Fazer perguntas específicas quando incerto
- Nunca presumir comportamento não documentado
- Solicitar esclarecimentos sobre requisitos vagos

### 🔄 Integration Patterns

#### Com Claude
- Documentos estruturados como contratos
- Validações rigorosas de entrada/saída
- Error reporting padronizado
- Success criteria explícitos

#### Com Projeto LexAI
- Aderir às convenções existentes
- Respeitar arquitetura estabelecida
- Manter padrões de qualidade
- Atualizar documentação relevante

### 🧠 Regras de Comportamento da IA

- **Nunca presuma contexto ausente. Faça perguntas se não tiver certeza.**
- **Nunca alucine bibliotecas ou funções** – use apenas pacotes conhecidos e verificados do `package.json`.
- **Sempre confirme se os caminhos de arquivos e nomes de módulos existem** antes de referenciá-los no código ou nos testes.
- **Nunca exclua ou sobrescreva código existente** a menos que seja explicitamente instruído ou faça parte de uma tarefa do plano (PRP).

### 📚 Documentação e Clareza

- **Atualize a documentação relevante** em `/docs` quando novas funcionalidades forem adicionadas ou se a arquitetura mudar.
- **Comente código não óbvio** e garanta que tudo seja compreensível para um desenvolvedor de nível intermediário.
- Ao escrever lógica complexa, **adicione comentários inline explicando o porquê, não apenas o que**.

### 🧱 Estrutura de Código e Modularidade

- **Nunca crie um arquivo com mais de 500 linhas de código.** Se um arquivo se aproximar desse limite, refatore-o dividindo-o em múltiplos componentes, hooks ou funções utilitárias.
- **Organize o código em módulos claramente separados**, agrupados por funcionalidade:
    - **Componentes:** em `src/components/ui` para componentes de UI genéricos e `src/components/` para os mais complexos.
    - **Hooks:** em `src/hooks/`.
    - **Lógica de Negócios/Firebase:** em `src/lib/`.
    - **Rotas de API:** em `src/app/api/`.
- **Use importações claras e consistentes** (prefira aliases de caminho como `@/components/*` se configurado no `tsconfig.json`).

### 📎 Estilo e Convenções

- **Use TypeScript** como a linguagem principal.
- **Siga as regras do ESLint e Prettier** configuradas no projeto para formatação e estilo de código.
- **Use `zod` para validação de dados** em formulários e rotas de API, se for um padrão do projeto.
- **Use as Rotas de API do Next.js** para a lógica de backend.
- **Documente funções e componentes complexos** usando comentários JSDoc.
  ```typescript
  /**
   * Breve resumo do que o componente ou função faz.
   * @param {type} props - Descrição das propriedades.
   * @returns {JSX.Element | type} Descrição do que é retornado.
   */
  ```