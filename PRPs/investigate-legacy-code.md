## FEATURE: Investigação de Código Legado no Projeto

### OBJETIVO:
Identificar e documentar áreas do código que podem ser consideradas "legado" com base em critérios definidos, a fim de planejar futuras refatorações ou atualizações.

### CRITÉRIOS DE CÓDIGO LEGADO:
1.  **Tecnologias/Sintaxe Antigas:**
    *   Uso excessivo de JavaScript puro (`.js`, `.jsx`) em áreas onde TypeScript (`.ts`, `.tsx`) é o padrão.
    *   Uso de `var` em vez de `let` ou `const`.
    *   Padrões assíncronos baseados em callbacks (`.then().catch()`) onde `async/await` é mais idiomático.
    *   Uso de APIs ou padrões Next.js/React/Firebase que foram oficialmente depreciados ou substituídos por alternativas mais modernas (ex: `getInitialProps` no `app/` router, Firebase SDK v8 patterns se v9+ é o padrão).
2.  **Falta de Tipagem ou Tipagem Fraca:**
    *   Uso excessivo do tipo `any` no TypeScript.
    *   Ausência de interfaces ou tipos para estruturas de dados complexas.
3.  **Inconsistência de Estilo/Padrões:**
    *   Código que não segue as convenções de estilo definidas no `.eslintrc.json`, `tailwind.config.ts` ou `CLAUDE.md` (futuro `GEMINI.md`).
    *   Padrões de componentes ou módulos que divergem significativamente dos padrões mais recentes do projeto.
4.  **Dependências Desatualizadas:**
    *   Bibliotecas no `package.json` com versões significativamente antigas que possuem atualizações maiores disponíveis.
5.  **Código Não Utilizado ou Redundante:**
    *   Funções, componentes ou arquivos que não são mais referenciados ou executados.
6.  **Soluções Alternativas (Workarounds) Antigas:**
    *   Soluções temporárias que foram implementadas e nunca foram refatoradas para uma abordagem mais robusta.

### ETAPAS DE IMPLEMENTAÇÃO:

#### Fase 1: Análise de Dependências e Configurações
1.  **Verificar Dependências Desatualizadas:**
    *   Ação: Executar `npm outdated`.
    *   Ferramenta: `run_shell_command`.
    *   Critério de Legado: Dependências com major versions desatualizadas.
2.  **Revisar Configurações de Linting e TypeScript:**
    *   Ação: Ler `.eslintrc.json` e `tsconfig.json`.
    *   Ferramenta: `read_file`.
    *   Critério de Legado: Violações claras dessas regras.

#### Fase 2: Varredura de Código por Padrões Legados
1.  **Identificar Arquivos JavaScript/JSX em Áreas TypeScript:**
    *   Ação: Procurar por `.js` ou `.jsx` em `src/` e `functions/src/`.
    *   Ferramenta: `glob` (padrão: `**/*.{js,jsx}`).
2.  **Procurar por Sintaxe JavaScript Antiga (`var`):**
    *   Ação: Pesquisar por `var ` em `src/` e `functions/src/`.
    *   Ferramenta: `search_file_content` (padrão: `var `, include: `src/**/*.{ts,tsx,js,jsx}`, `functions/src/**/*.{ts,js}`).
3.  **Identificar Padrões Assíncronos Antigos (Callbacks vs. Async/Await):**
    *   Ação: Pesquisar por `.then().catch()` sem um `async` ou `await` próximo.
    *   Ferramenta: `search_file_content` (padrão: `\.then\(\)\.catch\(`, include: `src/**/*.{ts,tsx,js,jsx}`, `functions/src/**/*.{ts,js}`).
4.  **Detectar Uso Excessivo de `any`:**
    *   Ação: Pesquisar por `: any` em arquivos TypeScript.
    *   Ferramenta: `search_file_content` (padrão: `: any`, include: `src/**/*.{ts,tsx}`, `functions/src/**/*.ts`).
5.  **Verificar Padrões Next.js/React Depreciados:**
    *   Ação: Pesquisar por `getInitialProps` ou `getServerSideProps` em arquivos `.tsx` ou `.ts` dentro de `src/app/`.
    *   Ferramenta: `search_file_content` (padrão: `getInitialProps|getServerSideProps`, include: `src/app/**/*.{ts,tsx}`).
6.  **Analisar Uso do Firebase SDK:**
    *   Ação: Pesquisar por padrões de importação e uso do Firebase SDK que correspondam à versão 8 ou anterior, se o projeto estiver usando a versão 9+.
    *   Ferramenta: `search_file_content` (padrão: `firebase/app|firebase/firestore|firebase/auth`, include: `src/**/*.{ts,tsx,js,jsx}`, `functions/src/**/*.{ts,js}`).

#### Fase 3: Análise Manual e Contextual
1.  **Revisão de Código em Áreas Suspeitas:**
    *   Ação: Leitura focada de arquivos identificados como potencialmente legados.
    *   Ferramenta: `read_file`.
2.  **Verificar Scripts de Automação (`scripts/`):**
    *   Ação: Ler o conteúdo de cada script em `scripts/`.
    *   Ferramenta: `read_file`.
3.  **Consultar Documentação Existente:**
    *   Ação: Ler `docs/ARCHITECTURE.md`, `docs/DESIGN-SYSTEM.md`, `docs/CONTRIBUTING.md`.
    *   Ferramenta: `read_file`.

#### Fase 4: Documentação e Próximos Passos
1.  **Documentar Descobertas:**
    *   Ação: Registrar caminho do arquivo, linhas, motivo, impacto.
    *   Ferramenta: `write_file` (para criar `docs/development/LEGACY_CODE_REPORT.md`).
2.  **Propor Plano de Ação:**
    *   Ação: Propor refatoração ou atualização.
    *   Ferramenta: `write_file`.

### EXAMPLES:
Não há exemplos de código específicos para esta tarefa, mas os padrões de busca e análise serão baseados na estrutura de código existente no projeto (ex: como `src/` é organizado, como os componentes são escritos).

### DOCUMENTATION:
*   `CLAUDE.md` (ou `GEMINI.md` se renomeado): Para diretrizes gerais de código e estilo.
*   `package.json`: Para dependências e scripts.
*   `tsconfig.json`: Para configurações de TypeScript.
*   `.eslintrc.json`: Para regras de linting.
*   `docs/ARCHITECTURE.md`: Para entender a arquitetura do projeto.
*   `docs/DESIGN-SYSTEM.md`: Para padrões de design e componentes.
*   `docs/CONTRIBUTING.md`: Para diretrizes de contribuição.

### OTHER CONSIDERATIONS:
*   **Falsos Positivos:** As buscas por padrões podem gerar falsos positivos. A análise manual na Fase 3 é crucial para validar as descobertas.
*   **Priorização:** A priorização das refatorações será baseada no impacto (segurança, performance, manutenibilidade) e na complexidade da mudança.
*   **Testes:** Qualquer refatoração resultante desta investigação deve ser acompanhada de testes adequados para garantir que nenhuma funcionalidade seja quebrada.
*   **Comunicação:** As descobertas e o plano de ação devem ser comunicados à equipe.
