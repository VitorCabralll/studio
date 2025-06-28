# Technical Backlog – LexAI

## 1. Análise Geral do Código Atual

- Frontend base Next.js + Firebase pronto.
- Cadastro, login, workspaces, agentes, upload de modelos: pronto.
- Integração de IA, pipeline/orquestrador: **faltando/precisa completar**.
- Multi-LLM: faltando.
- OCR Local: precisa integrar e validar.
- Geração por seções, prompts, pós-processamento, configuração dinâmica: faltando.
- Onboarding, tutorial, documentação dinâmica e testes UX/UI: faltando.

---

## 2. O que já está pronto x o que falta

| Parte                             | Status     |
|-----------------------------------|------------|
| Infraestrutura (Next, Firebase)   | Quase pronta |
| Frontend base                     | Pronto, falta lapidar UX/UI |
| Cadastro/Workspaces/Agentes       | Pronto, falta integração pipeline |
| Upload de modelo                  | Pronto     |
| Pipeline de IA/Orquestrador       | Faltando   |
| Multi-LLM                         | Faltando   |
| OCR Local                         | Implementar/testar integração |
| Geração por seções, prompts       | Faltando   |
| Pós-processamento (template docx) | Faltando   |
| Configuração dinâmica do pipeline | Faltando   |
| Onboarding/Tutorial               | Faltando   |
| Documentação interna              | Faltando   |
| Testes UX/UI com usuários         | Faltando   |

---

## 3. Roadmap Detalhado de Tarefas Pendentes

### 1. Finalizar Pipeline/Orquestrador de IA
**Descrição:** Implementar pipeline que recebe anexos, processa cada etapa (sumarização, estruturação, geração por seção, montagem, revisão), faz roteamento multi-LLM.
**Vibe coding:**  
Peça para IA: “Gere o código de um pipeline modular, onde cada etapa chama uma função separada. Implemente roteamento para decidir qual IA será chamada em cada etapa, recebendo os insumos e retornando o documento final.”

### 2. Implementar OCR Local Integrado
**Descrição:** Integrar biblioteca de OCR local ao frontend para garantir que todo anexo já chega como texto.
**Vibe coding:**  
Peça para IA: “Me indique as melhores bibliotecas de OCR local para Next.js/React, e implemente um componente de upload que faz OCR no navegador antes de enviar o texto ao backend.”

### 3. Implementar Geração de Documento por Seção
**Descrição:** Gerar cada seção do documento (histórico, fundamentação, conclusão) com prompts separados, utilizando pipeline.
**Vibe coding:**  
Peça para IA: “Implemente uma função que, para cada seção do template docx, gera um prompt com o contexto e chama a IA configurada. Explique como montar o loop e recompor no template.”

### 4. Implementar Pós-processamento e Montagem no Template (.docx)
**Descrição:** Inserir o texto gerado nas seções do modelo .docx, mantendo formatação e estilo.
**Vibe coding:**  
Peça para IA: “Implemente um pós-processamento que insere textos gerados automaticamente nas seções corretas do template .docx, mantendo estilos. Sugira bibliotecas e explique o fluxo.”

### 5. Configurar Multi-LLM (roteamento dinâmico por etapa)
**Descrição:** Criar lógica/config para decidir qual IA é chamada em cada etapa do pipeline.
**Vibe coding:**  
Peça para IA: “Implemente um roteador multi-LLM, onde cada etapa do pipeline pode receber como parâmetro o modelo de IA a ser chamado. Sugira como criar arquivo de config para isso.”

### 6. Criar Interface de Configuração de Pipeline (admin/dev)
**Descrição:** Tela/configuração para que seja possível alterar, sem código, qual IA é chamada em cada etapa.
**Vibe coding:**  
Peça para IA: “Crie uma interface (tela admin) para configurar facilmente o modelo de IA usado em cada etapa do pipeline. Mostre como salvar em arquivo ou banco.”

### 7. Onboarding/Tutorial Inteligente para Usuário
**Descrição:** Criar onboarding guiado, tutorial ou assistente para ensinar o uso do SaaS para leigos.
**Vibe coding:**  
Peça para IA: “Implemente onboarding/tutorial interativo e contextual para o LexAI, explicando cada passo do uso, com textos e exemplos fáceis.”

### 8. UX/UI Refinado para Leigos e Técnicos
**Descrição:** Revisar flows, textos, tooltips e navegação para que qualquer usuário consiga usar.
**Vibe coding:**  
Peça para IA: “Sugira melhorias de UX/UI para SaaS jurídico, focando em clareza, acessibilidade e facilidade de uso para leigos. Explique nomenclaturas e padrões.”

### 9. Testes Unitários e de Integração
**Descrição:** Implementar testes para cada etapa do pipeline, integração dos fluxos e uploads.
**Vibe coding:**  
Peça para IA: “Gere exemplos de testes unitários e de integração para cada função do pipeline orquestrador e componentes de upload.”

### 10. Documentação Técnica e FAQ
**Descrição:** Escrever documentação interna clara, tanto para devs quanto para usuários, com exemplos de prompts, fluxos, dicas e dúvidas frequentes.
**Vibe coding:**  
Peça para IA: “Crie um arquivo README/FAQ interno para devs e usuários, explicando cada etapa, exemplos de prompts, dicas de troubleshooting.”

---

## 4. Dica Geral para Vibe Coding

Sempre explique:
- Objetivo da tarefa (“Quero fazer...”)
- Contexto e stack (“Uso Next.js, Firebase, multi-LLM”)
- Peça código comentado, explicação e dicas de melhores práticas
- Peça exemplos de prompts e sugestões de UI, se relevante
- Peça como testar e debugar cada parte

---

## Exemplo de Pedido para IA

> “Preciso que o backend do pipeline orquestrador processe cada etapa da geração de minutas usando multi-LLM. Quero poder definir qual IA é usada em cada etapa, via arquivo de configuração. Gero os prompts conforme template, anexo os textos dos documentos, e recebo o documento final pronto. Gere o código modularizado, com explicações em cada função.”

---

**LexAI – Technical Backlog | Roadmap para vibe coding e evolução do produto**
