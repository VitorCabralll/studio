# Projeto LexAI - Plataforma SaaS Jurídica

## Visão Geral
LexAI é uma plataforma SaaS para automação de documentos jurídicos usando Next.js, TypeScript, Firebase e orquestração de IA multi-LLM.

## Comandos Principais
- `npm run dev` - Inicia o servidor de desenvolvimento (Next.js com Turbopack)
- `npm run build` - Build de produção
- `npm run lint` - Executa o linter
- `npm run typecheck` - Verifica tipos TypeScript
- `npm run test:orchestrator` - Testa o orquestrador de IA
- `firebase emulators:start` - Inicia emulators Firebase (desenvolvimento local)
- `firebase deploy` - Deploy para produção

## Stack Tecnológica
- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Firebase (Auth, Firestore, Storage)
- **IA**: Genkit, OpenAI, Google AI, multi-LLM
- **OCR**: Tesseract.js (processamento local)

## Estrutura Principal
- `src/ai/orchestrator/` - Orquestrador de IA (pipeline multi-LLM)
- `src/app/` - Páginas Next.js (App Router)
- `src/components/` - Componentes React + shadcn/ui
- `src/hooks/` - Hooks customizados
- `src/services/` - Serviços Firebase

## Padrões de Código
- Use TypeScript rigoroso
- Componentes funcionais com hooks
- shadcn/ui para componentes base
- Tailwind para styling
- Firebase para backend
- Validação com Zod

## Segurança
- Nunca expor chaves de API no frontend
- Processar OCR localmente (cliente)
- Validar todos os uploads
- Isolamento por workspace

## Arquivos de Referência
Ver @README.md para visão completa do projeto
Ver @package.json para comandos disponíveis
Ver @SETUP.md para configuração detalhada