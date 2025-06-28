# Plano do Orquestrador de IA – LexAI

---

## 1. Objetivo do Orquestrador

O **Orquestrador de IA** é o “cérebro” do LexAI: um pipeline modular que recebe uma demanda complexa (ex: gerar uma minuta jurídica), divide-a automaticamente em microtarefas e atribui cada etapa ao modelo de IA mais apropriado, equilibrando custo e qualidade.

---

## 2. Princípios e Diretrizes

- **Divisão em microtarefas:** Nenhuma etapa é monolítica; tudo é modular, cada fase é autônoma.
- **Roteamento multi-LLM:** Cada microtarefa pode ser atribuída a um modelo diferente, conforme custo, complexidade e objetivo.
- **Pipeline dinâmico:** Permite fácil alteração/adaptação do fluxo, seja por configuração ou por regras dinâmicas.
- **Escalabilidade:** Novas etapas ou modelos podem ser incluídos no pipeline sem reescrever todo o sistema.
- **Facilidade de manutenção:** Qualquer dev ou IA pode compreender e ajustar o fluxo lendo este arquivo.

---

## 3. Fluxo do Orquestrador – Passo a Passo

### **A. Recepção da Demanda**
- Recebe requisição com:
  - ID do agente (para resgatar modelo/template e regras)
  - Textos dos anexos (OCR local já processado)
  - Instruções extras e arquivos auxiliares

### **B. Pipeline Modular de Microtarefas**

1. **Sumarização dos Anexos**
   - *Tarefa:* Extrair fatos/relevâncias dos textos anexados
   - *Prompt típico:*  
     > "Liste de forma objetiva os principais fatos e evidências presentes nestes documentos processuais para uso em minuta jurídica."
   - *Modelo sugerido:* Gemini Pro, GPT-3.5 (baixo custo)

2. **Análise das Instruções e Auxiliares**
   - *Tarefa:* Identificar demandas específicas, destaques e pontos críticos
   - *Prompt típico:*  
     > "Com base nestas instruções e textos auxiliares, aponte os tópicos prioritários a considerar na fundamentação jurídica."
   - *Modelo sugerido:* Gemini Pro, GPT-3.5 (ou premium se a tarefa for crítica)

3. **Definição da Estrutura do Documento**
   - *Tarefa:* Montar o esqueleto da minuta (títulos/seções) com base no template .docx e contexto fornecido
   - *Prompt típico:*  
     > "Com base neste template e nas informações extraídas, defina a estrutura completa do documento jurídico."
   - *Modelo sugerido:* Gemini Pro, GPT-3.5

4. **Geração de Conteúdo por Seção**
   - *Tarefa:* Para cada seção (ex: Histórico, Fundamentação, Conclusão), gerar o texto fundamentado e coeso
   - *Prompt típico:*  
     > "Redija a seção 'Histórico Fático' deste documento, baseando-se nos fatos resumidos e nas instruções prioritárias. Linguagem formal, estrutura conforme template."
   - *Modelo sugerido:* GPT-4, Claude Opus (premium)  
   - *Obs:* Pode ser feito em loop para cada seção do template

5. **Montagem, Revisão e Pós-processamento**
   - *Tarefa:* Unir todas as seções no template .docx, ajustar formatação, revisar coesão e clareza
   - *Prompt típico (se for IA):*  
     > "Revise o documento final, garanta clareza, coesão e correção jurídica, mantendo a estrutura e estilo do modelo."
   - *Modelo sugerido:* Gemini Pro ou rotina local

### **C. Roteamento Multi-LLM**

- **Como funciona:**  
  - Cada etapa do pipeline tem sua função, e dentro dela o código decide qual API/modelo utilizar, baseado em regras configuráveis (por custo, tamanho do texto, criticidade, etc.)
- **Exemplo de decisão no código:**
  ```python
  if tarefa == 'sumarizacao':
      modelo = 'GeminiPro'
  elif tarefa == 'geracao_final':
      modelo = 'GPT-4'
  # Chama a API correspondente com o prompt daquela etapa
  ```

### **D. Retorno ao Usuário**

- Monta e entrega o documento final pronto para exportação/edição.
- Usuário só anexa arquivos e recebe resultado final, nunca precisa interagir com o pipeline interno.

---

## 4. Estrutura Recomendada do Código

```
orquestrador/
│
├── pipeline.py (ou .ts/.js)
│   ├── sumarizacao.py
│   ├── analise_instrucoes.py
│   ├── estrutura_documento.py
│   ├── geracao_secoes.py
│   ├── pos_processamento.py
│   └── roteador_llm.py
│
├── config/
│   └── roteamento.json  # Define qual modelo para qual etapa
```

---

## 5. Técnicas Envolvidas

- **Prompt Chaining:** Output de uma etapa é input da próxima.
- **Routing:** Decisão dinâmica de modelo/LLM por etapa.
- **Pipeline Orquestrado:** Cada etapa é modular, podendo ser alterada ou pulada facilmente.
- **Fallback:** Se a IA principal falhar, usa modelo alternativo.
- **Logs & Monitoramento:** (Opcional) Guardar tempo de execução, IA usada, custo, para otimizar futuramente.

---

## 6. Expansibilidade e Manutenção

- Adicionar nova etapa? Basta criar uma nova função/módulo, incluir no pipeline e configurar no roteamento.
- Trocar IA de uma etapa? Só muda a regra no roteamento (ex: config/roteamento.json).
- Mudanças de prompt? Cada etapa tem seu prompt configurável, pode ser refinado sem mexer nas outras.

---

## 7. Sugestão de Prompts (por etapa)

- **Sumarização:**  
  “Liste em tópicos os principais fatos dos anexos abaixo para uso em manifestação jurídica.”

- **Instruções/auxiliares:**  
  “Considere as instruções e textos auxiliares anexos. Quais tópicos são prioritários para fundamentação?”

- **Estrutura:**  
  “Defina a estrutura do documento conforme o template e contexto abaixo.”

- **Redação por seção:**  
  “Redija a seção ‘Histórico’ conforme fatos, instruções e estrutura abaixo.”

- **Revisão final:**  
  “Revise o texto a seguir para clareza, coesão e correção jurídica, mantendo formato do template.”

---

## 8. Exemplo de Fluxo Visual

```
[Usuário]
   ↓
[Recepção de insumos]
   ↓
[Sumarização dos anexos] --GeminiPro/GPT-3.5
   ↓
[Análise das instruções] --GeminiPro/GPT-3.5
   ↓
[Definição da estrutura] --GeminiPro/GPT-3.5
   ↓
[Geração por seção] ------GPT-4/Claude Opus
   ↓
[Montagem/revisão] -------GeminiPro/local
   ↓
[Documento final pronto]
```

---

## 9. Pontos de Atenção

- **OCR sempre local:** Nenhum documento é processado na nuvem antes do texto.
- **Expansível para RAG/busca semântica:** Se necessário no futuro, uma etapa pode buscar jurisprudência ou contexto adicional.
- **Configuração centralizada:** Todas as decisões de roteamento (qual IA, prompts) ficam em um arquivo de configuração.

---

## 10. Como usar o Orquestrador no vibe coding

Peça para a IA:
- Gerar função “orquestrador” seguindo este pipeline, com cada etapa em função separada.
- Criar um arquivo de configuração para roteamento de modelos por etapa.
- Gerar exemplos de prompt para cada etapa, aceitando contexto dinâmico.
- Explicar cada parte do pipeline em português claro.
- Gerar testes unitários para cada etapa.

---

**LexAI – Orquestrador de IA: pipeline modular, expansível e plugável, garantindo qualidade, economia e autonomia para geração de documentos jurídicos.**
