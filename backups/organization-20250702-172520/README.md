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
- [SEO](#seo)

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
studio-1/
│
├── src/
│   ├── ai/orchestrator/          # 🧠 Orquestrador de IA (IMPLEMENTADO)
│   │   ├── types.ts             # Tipos TypeScript completos
│   │   ├── router.ts            # Roteamento inteligente multi-LLM
│   │   ├── pipeline.ts          # Pipeline principal de processamento
│   │   ├── processors.ts        # Processadores por etapa
│   │   ├── config.ts            # Configurações e LLMs disponíveis
│   │   ├── index.ts             # Interface principal
│   │   └── example.ts           # Exemplos de uso
│   ├── app/                     # App Router Next.js
│   ├── components/              # Componentes React
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── layout/              # Header, sidebar, error boundaries
│   │   ├── forms/               # Formulários de agentes
│   │   └── ocr/                 # Processamento OCR local
│   ├── hooks/                   # Hooks customizados
│   ├── services/                # Firebase services
│   └── lib/                     # Utilitários
│
├── functions/                   # Firebase Functions (TypeScript)
├── firestore.rules              # Regras de segurança Firestore
├── storage.rules                # Regras de segurança Storage
├── docs/                        # Documentação adicional
├── .env.example                 # Template de variáveis
├── SETUP.md                     # Guia de configuração
├── PRD-LEXAI.md                # Product Requirements
├── Technical-Backlog-LEXAI.md   # Backlog técnico
└── README.md                    # Este arquivo
```

---

## ⚙️ Configuração e Execução Local

> **📖 Para instruções detalhadas, consulte [SETUP.md](./SETUP.md)**

**Pré-requisitos:**
- Node.js 20+
- npm ou yarn
- Conta Firebase (plano Blaze para Functions)
- APIs de IA: OpenAI, Google AI, Anthropic

### Instalação Rápida

1. **Clone e instale:**
   ```bash
   git clone https://github.com/VitorCabralll/studio-1.git
   cd studio-1
   npm install
   ```

2. **Configure ambiente:**
   ```bash
   cp .env.example .env.local
   # Edite .env.local com suas chaves de API
   ```

3. **Execute o projeto:**
   ```bash
   # Desenvolvimento completo com Firebase Emulators
   firebase emulators:start
   
   # OU apenas frontend (sem backend)
   npm run dev
   ```

4. **Teste o orquestrador:**
   ```bash
   npm run test:orchestrator
   ```

**Acesso:** http://localhost:3000

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

## SEO

Para garantir que o LexAI seja bem indexado pelo Google:

1. Crie um arquivo `public/robots.txt` com:

```
User-agent: *
Allow: /
Sitemap: https://lexai.com.br/sitemap.xml
```

2. Crie um arquivo `public/sitemap.xml` (exemplo básico):

```
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://lexai.com.br/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://lexai.com.br/login</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://lexai.com.br/signup</loc>
    <priority>0.8</priority>
  </url>
</urlset>
```

3. Adicione imagens de preview em `public/og-image.png` para Open Graph.

4. As principais tags meta já estão no layout global (`src/app/layout.tsx`).

---

**LexAI – Geração de documentos jurídicos 100% automática, inteligente, escalável e acessível.**
