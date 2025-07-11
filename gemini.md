# Contexto do Projeto LexAI para Gemini

## 1. Visão Geral do Projeto

LexAI é uma plataforma SaaS Full-Stack TypeScript, construída com Next.js e Firebase, projetada para otimizar o fluxo de trabalho de profissionais do direito. O sistema utiliza um orquestrador multi-LLM (OpenAI, Google, Anthropic) para automatizar a criação de documentos a partir de templates, analisar processos judiciais com OCR local (Tesseract.js) e fornecer um ambiente seguro e modular para a gestão de agentes de IA. O projeto está em fase avançada de desenvolvimento (75% do MVP concluído), com foco atual em robustez, segurança e na finalização de funcionalidades como a exportação de documentos em formato .docx.

## 2. Stack de Tecnologia

*   **Frontend:** Next.js 15 (App Router, Server Components), React 18 (Functional Components, Hooks, Context API), TypeScript 5 (Strict Mode), Tailwind CSS, shadcn/ui, Framer Motion, Lucide React, next-themes.
*   **Backend:** Firebase Suite (Authentication, Firestore, Cloud Storage, Cloud Functions, Hosting), Next.js API Routes.
*   **Inteligência Artificial:** Orquestrador Multi-LLM (OpenAI, Google AI, Anthropic), Tesseract.js (OCR local), Zod (validação de dados).
*   **Testes:** Jest, React Testing Library, Playwright (planejado).
*   **Ferramentas de Desenvolvimento:** ESLint, Prettier, Turbopack.

## 3. Estrutura de Diretórios Chave

*   `src/app/`: Rotas da aplicação Next.js (incluindo rotas de API em `src/app/api/`).
*   `src/components/`: Componentes React reutilizáveis (incluindo `ui/` para componentes base).
*   `src/hooks/`: Hooks React customizados.
*   `src/lib/`: Utilitários, configurações (incluindo Firebase), e lógica de negócios.
*   `src/ai/orchestrator/`: O sistema de orquestração multi-LLM.
*   `functions/`: Funções do Firebase Cloud Functions.
*   `public/`: Assets estáticos.
*   `docs/`: Documentação detalhada do projeto (arquitetura, roadmap, changelog, etc.).

## 4. Comandos Essenciais

*   `npm run dev`: Inicia o servidor de desenvolvimento.
*   `npm run build`: Cria a build de produção.
*   `npm run start`: Inicia o servidor de produção.
*   `npm run lint`: Executa o linter.
*   `npm run typecheck`: Executa a verificação de tipos do TypeScript.

## 5. Regras e Convenções de Código

### 🔄 Consciência do Projeto e Contexto
- **Sempre leia a documentação** no diretório `/docs` no início de uma nova conversa para entender a arquitetura, objetivos, estilo e restrições do projeto.
- **Use as convenções de nomenclatura, estrutura de arquivos e padrões de arquitetura** existentes no projeto, especialmente a estrutura de rotas do Next.js em `src/app`.
- **Verifique o `package.json`** para identificar os scripts corretos para rodar, testar e fazer lint no projeto.

### 🧱 Estrutura de Código e Modularidade
- **Nunca crie um arquivo com mais de 500 linhas de código.** Se um arquivo se aproximar desse limite, refatore-o dividindo-o em múltiplos componentes, hooks ou funções utilitárias.
- **Organize o código em módulos claramente separados**, agrupados por funcionalidade:
    - **Componentes:** em `src/components/ui` para componentes de UI genéricos e `src/components/` para os mais complexos.
    - **Hooks:** em `src/hooks/`.
    - **Lógica de Negócios/Firebase:** em `src/lib/`.
    - **Rotas de API:** em `src/app/api/`.
- **Use importações claras e consistentes** (prefira aliases de caminho como `@/components/*` se configurado no `tsconfig.json`).

### 🧪 Testes e Confiabilidade
- **Sempre crie testes para novos componentes React e hooks customizados**, usando a framework de testes configurada no projeto (ex: Jest, React Testing Library).
- **Após atualizar qualquer lógica**, verifique se os testes existentes precisam ser atualizados.
- **Os testes devem estar localizados próximos aos arquivos que testam** (ex: `component.test.tsx` ao lado de `component.tsx`) ou em um diretório `__tests__`.
- Inclua no mínimo:
    - 1 teste para o caso de uso esperado (renderização correta).
    - 1 teste para um caso extremo (props faltando, estado de erro).
    - 1 teste de interação do usuário, se aplicável.

### ✅ Conclusão de Tarefas
- **Siga o plano gerado (PRP)** passo a passo para concluir as tarefas.
- **Informe sobre quaisquer desvios ou problemas encontrados** durante o desenvolvimento.

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

### 📚 Documentação e Clareza
- **Atualize a documentação relevante** em `/docs` quando novas funcionalidades forem adicionadas ou se a arquitetura mudar.
- **Comente código não óbvio** e garanta que tudo seja compreensível para um desenvolvedor de nível intermediário.
- Ao escrever lógica complexa, **add an inline `# Reason:` or `// Reason:` comment** explaining the why, not just the what.

### 🧠 Regras de Comportamento da IA
- **Nunca presuma contexto ausente. Faça perguntas se não tiver certeza.**
- **Nunca alucine bibliotecas ou funções** – use apenas pacotes conhecidos e verificados do `package.json`.
- **Sempre confirme se os caminhos de arquivos e nomes de módulos existem** antes de referenciá-los no código ou nos testes.
- **Nunca exclua ou sobrescreva código existente** a menos que seja explicitamente instruído ou faça parte de uma tarefa do plano (PRP).
