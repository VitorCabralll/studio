# LexAI – Plataforma SaaS Jurídica Hiperpersonalizável

LexAI é uma plataforma SaaS para automação e hiperpersonalização de documentos jurídicos, desenvolvida com **Next.js**, **TypeScript** e **Firebase**. Seu diferencial está em um pipeline inteligente de IA (“orquestrador”), capaz de dividir a tarefa de geração de minutas em etapas automáticas e delegar cada uma para a IA mais adequada, equilibrando custo e qualidade — tudo sem exigir nenhum preenchimento manual do usuário final após a criação do agente.

---

## 📖 Sumário

- [Visão Geral](#visão-geral)
- [Principais Funcionalidades](#principais-funcionalidades)
- [Fluxo do Usuário](#fluxo-do-usuário)
- [Pipeline Automatizado (Orquestrador de IA)](#pipeline-automatizado-orquestrador-de-ia)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Configuração e Execução Local](#configuração-e-execução-local)
- [Segurança e Boas Práticas](#segurança-e-boas-práticas)
- [Contribuição](#contribuição)
- [Licença](#licença)
- [Suporte](#suporte)

---

## 🚀 Visão Geral

O LexAI permite:
- **Criação de agentes jurídicos especializados:** cada agente tem um modelo (.docx) anexado **uma única vez na criação**.
- **Geração automática de documentos jurídicos complexos:** após criar o agente, o usuário só precisa anexar documentos do processo, instruções opcionais e arquivos auxiliares (fundamentações, jurisprudências, etc.) para receber o documento final pronto.
- **Pipeline orquestrado:** a geração da minuta é dividida em etapas (sumarização, estruturação, geração por seção, revisão/montagem), com cada etapa podendo usar a IA mais adequada (multi-LLM), controlando custo e qualidade.
- **OCR local:** todos os anexos são convertidos para texto localmente no PC do usuário.
- **Interface universal:** fácil para leigos, poderosa para técnicos.

---

## ✨ Principais Funcionalidades

- **Agentes jurídicos personalizáveis:** upload de modelo .docx apenas na criação do agente; configurações, parâmetros e instruções.
- **Geração 100% automatizada:** pipeline de IA que divide o processo em micro-tarefas e retorna o documento pronto, sem preencher variáveis.
- **Multi-LLM:** uso de diferentes APIs/modelos de IA para cada etapa do pipeline, otimizando custos e resultados.
- **Modo especializado:** agentes podem gerar minutas completas ou apenas partes específicas (relatórios, etc).
- **Personalização e reuso:** agentes e modelos ficam salvos para uso recorrente.
- **Multi-workspace e gestão de times.**

---

## 👤 Fluxo do Usuário

### **1. Criação de Agente**
- Usuário define nome, área do Direito, parâmetros e **anexa modelo (.docx)** apenas **uma vez**.
- O modelo e configurações ficam salvos no sistema junto ao agente.

### **2. Geração de Documento**
- Usuário seleciona agente já criado.
- Anexa **documentos do processo** (OCR local).
- [Opcional] Anexa **instruções personalizadas** (“Foque em X”, “Adote linguagem Y”, etc.).
- [Opcional] Anexa **arquivos auxiliares** (fundamentações, doutrinas, jurisprudências).
- Clica em **“Gerar”**.
- LexAI utiliza o modelo do agente, contexto dos anexos, instruções e arquivos auxiliares, e **retorna o documento final pronto** (minuta, manifestação, parecer, etc.), já formatado.

---

## 🧠 Pipeline Automatizado (Orquestrador de IA)

O “cérebro” do LexAI é um pipeline modular, que divide a geração de cada documento nas seguintes etapas:

1. **Sumarização dos anexos**  
   - *Tarefa:* Extrair os fatos/relevâncias dos documentos anexados  
   - *IA usada:* API barata (ex: Gemini Pro, GPT-3.5)
2. **Análise de instruções/auxiliares**  
   - *Tarefa:* Entender instruções específicas e pontos a destacar  
   - *IA usada:* API barata/premium conforme complexidade
3. **Definição da estrutura do documento**  
   - *Tarefa:* Criar o esqueleto baseado no modelo do agente  
   - *IA usada:* API barata
4. **Geração por seção da minuta**  
   - *Tarefa:* Para cada parte do documento (Histórico, Fundamentação, Conclusão, etc.), gerar o texto detalhado  
   - *IA usada:* API premium (ex: GPT-4, Claude Opus)
5. **Montagem, revisão e pós-processamento**  
   - *Tarefa:* Juntar tudo no template, revisar formatação e linguagem  
   - *IA usada:* (opcional) API premium ou rotina local

**Roteamento multi-LLM:**  
O pipeline pode ser facilmente ajustado para usar diferentes IAs em cada etapa, de acordo com custo, qualidade ou tarefa (tudo configurável).

---

## 🛠️ Tecnologias Utilizadas

- **Next.js** (App Router)
- **React 18+**
- **TypeScript**
- **Tailwind CSS**
- **Firebase** (Auth, Firestore, Storage)
- **PostCSS**
- **shadcn/ui**
- **Node.js**
- **Módulos de IA plugáveis** (`src/ai/`): OpenAI, Gemini, Claude, etc.
- **OCR local:** conversão sempre feita no computador do usuário

---

## 📁 Estrutura de Pastas

```
studio-master/
│
├── .vscode/
├── docs/
├── src/
│   ├── ai/              # Pipeline de IA e integração multi-LLM
│   ├── app/             # Páginas e rotas Next.js
│   ├── components/      # Componentes reutilizáveis
│   ├── hooks/           # React hooks customizados
│   ├── lib/             # Integrações (ex: Firebase)
│   ├── services/        # Serviços e regras de negócio
│   └── ...              # Outras pastas customizadas
│
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── apphosting.yaml
├── README.md
```

---

## ⚙️ Configuração e Execução Local

**Pré-requisitos:**
- Node.js 18+
- npm ou yarn
- Conta Firebase (projeto criado)

### Passos

1. Clone o repositório:
   ```bash
   git clone <url-do-repo>
   cd studio-master
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure variáveis de ambiente:
   - Copie `.env.example` (se houver) para `.env.local` e preencha com as chaves do Firebase e das IAs.
4. Inicie o app localmente:
   ```bash
   npm run dev
   ```
   Acesse em `http://localhost:3000`

---

## 🔒 Segurança e Boas Práticas

- **Autenticação via Firebase**
- **Isolamento por workspace**
- **Validação de uploads**
- **Compliance LGPD, CNJ**
- **Nenhum OCR ou dado sensível processado na nuvem sem consentimento**

---

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit e push (`git commit -m "feat: MinhaFeature"`)
4. Abra um Pull Request

---

## 📄 Licença

MIT – veja o arquivo LICENSE.

---

## 📞 Suporte

- Abra issues para dúvidas, bugs ou sugestões
- Consulte a documentação na pasta `/docs`
- Use este README e comentários do código como referência para humanos e IAs

---

**LexAI – Geração de documentos jurídicos 100% automática, inteligente, escalável e acessível.**
