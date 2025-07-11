# PRD – LexAI SaaS Jurídico Hiperpersonalizável

---

## 1. Visão Geral e Objetivo

O LexAI é um SaaS jurídico orientado por IA, que permite que operadores do Direito criem agentes inteligentes hiperpersonalizados para geração automática de minutas, pareceres, relatórios técnicos e outros documentos. O grande diferencial é o pipeline orquestrado, que divide a tarefa em etapas lógicas e delega cada uma para a IA mais adequada, equilibrando custo e qualidade, sem exigir conhecimento técnico ou preenchimento manual do usuário após a criação do agente.

- **Diferenciais:**
  - Pipeline automatizado/orquestrador inteligente
  - Delegação automática de etapas para diferentes IAs (multi-LLM, roteamento dinâmico)
  - Templates customizáveis (.docx), anexados só na criação do agente
  - Multi-workspace, multiagente, UI para leigos e técnicos
  - Compliance, privacidade, OCR sempre local
  - Experiência plug-and-play: usuário só anexa os insumos, LexAI entrega o documento pronto

---

## 2. Público-Alvo

- Advogados, promotores, órgãos públicos, departamentos jurídicos, estagiários, técnicos, consultores.

---

## 3. Requisitos Funcionais

### 3.1 Autenticação e Onboarding
- Cadastro/login (email/senha, Google)
- Onboarding guiado para área do Direito e workspace
- Multi-workspace

### 3.2 Gestão de Workspaces
- Criar, editar, excluir workspaces
- Convite de membros
- Permissões: proprietário, membro, admin

### 3.3 Criação de Agentes
- Criar agente por área do Direito (nome, tema, configurações)
- **Anexar modelo (.docx) apenas na criação**
- Configurar parâmetros, regras, instruções do agente
- Salvar modelo, regras e parâmetros junto ao agente

### 3.4 Geração de Documentos (Pipeline)
- Usuário **seleciona agente já criado**
- Anexa documentos do processo (OCR local)
- [Opcional] Anexa instruções personalizadas
- [Opcional] Anexa arquivos auxiliares (fundamentações, doutrinas, jurisprudências)
- LexAI utiliza o modelo salvo do agente, interpreta o contexto dos anexos, instruções e auxiliares, e **retorna o documento completo pronto**
- **Pipeline automatizado**, sem preenchimento manual de campos
- Para agentes “especializados” (ex: só relatório), retorna apenas a parte correspondente

### 3.5 Administração e Configurações
- Branding, permissões, preferências, integrações
- Validação de uploads

### 3.6 Ajuda e Onboarding
- Tutoriais em vídeo/texto
- Tooltips, FAQ, suporte integrado

---

## 4. Requisitos Não Funcionais

- **Performance:** geração rápida de documentos (<10s ideal), uploads até 50MB
- **Escalabilidade:** multi-workspace, multiusuário, multiagente
- **Segurança:** isolamento de dados por workspace, autenticação obrigatória
- **Privacidade:** compliance LGPD, CNJ
- **Acessibilidade:** interface inclusiva (WCAG)
- **OCR local:** todos os documentos/anexos convertidos para texto no PC do usuário, nunca enviados em formato bruto para a nuvem

---

## 5. Arquitetura e Tecnologias

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Firebase Functions (TypeScript), Firestore, Firebase Auth, Storage
- **Pipeline de IA e Orquestrador:** modular, plugável, multi-LLM (OpenAI, Gemini, Anthropic, Claude, etc.), roteamento configurável por etapa
- **Infraestrutura:** App Hosting (Firebase), CI/CD

---

## 6. Pipeline do Orquestrador de IA (Cérebro do Produto)

### Etapas automáticas do pipeline (após o usuário acionar "gerar documento"):

1. **Sumarização dos anexos**  
   - *Tarefa:* Extrair fatos/relevâncias dos documentos anexados (OCR local)
   - *IA usada:* API barata (Gemini Pro, GPT-3.5)
   - *Prompt:* "Resuma os fatos principais destes documentos para uso jurídico."

2. **Análise de instruções e arquivos auxiliares**  
   - *Tarefa:* Identificar pontos prioritários conforme instruções e textos auxiliares
   - *IA usada:* API barata ou premium (conforme complexidade)
   - *Prompt:* "Liste pontos que devem ser destacados, conforme as instruções/auxiliares."

3. **Definição da estrutura do documento**  
   - *Tarefa:* Montar o esqueleto da minuta com base no template (.docx) e contexto
   - *IA usada:* API barata
   - *Prompt:* "Com base no template e contexto, crie o esqueleto da minuta."

4. **Geração de conteúdo por seção**  
   - *Tarefa:* Para cada seção (Histórico, Fundamentação, Conclusão...), gerar o texto completo e fundamentado
   - *IA usada:* API premium (GPT-4, Claude Opus, etc.)
   - *Prompt:* "Redija a seção 'Histórico Fático' conforme contexto, sumarização e template. Repita para cada seção."

5. **Montagem e pós-processamento**  
   - *Tarefa:* Unir tudo no template, revisar formatação, garantir coesão e estilo
   - *IA usada:* (opcional) revisão automática via IA ou rotina local

- **Roteamento multi-LLM:** O pipeline permite decidir para cada etapa qual IA usar, podendo ser ajustado conforme custo/qualidade.

---

## 7. Critérios de Aceite e Qualidade

- Após criar o agente, o usuário não preenche campos ao gerar minutas/pareceres completos
- Geração 100% autônoma, exceto para agentes especializados
- OCR sempre local
- Pipeline automatizado, modular, expansível
- Interface responsiva, intuitiva, inclusiva
- Exportação disponível (PDF/DOCX)
- Dados sensíveis nunca enviados sem processamento local

---

## 8. Roadmap Macro

- **1ª etapa:** Frontend, onboarding, upload de modelo, extração e salvamento, pipeline básico, exportação
- **2ª etapa:** Multi-LLM completo, personalização UI, agentes especializados, integrações
- **3ª etapa:** API pública, mobile, RAG (busca semântica), templates avançados

---

## 9. Observações Finais

- O usuário nunca repete upload de modelo após criar agente
- OCR sempre local
- Pipeline configurável para trocar a IA de cada etapa facilmente
- PRD deve ser atualizado conforme evolução do produto

---

**LexAI – Geração de documentos jurídicos 100% automática, inteligente, escalável e acessível.**
