#!/bin/bash

# Multi-Agent Workflow para LexAI
# Sistema de coordenação entre Gemini CLI e Claude Code

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções utilitárias
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Função para criar PRP usando Gemini
create_prp_with_gemini() {
    local feature_name="$1"
    local description="$2"
    
    log_info "🧠 Iniciando análise estratégica com Gemini..."
    
    # Criar arquivo de feature para o Gemini analisar
    cat > "tmp_rovodev_feature_${feature_name}.md" << EOF
# Feature: ${feature_name}

## Descrição
${description}

## Contexto do Projeto LexAI
- SaaS jurídico com orquestrador multi-LLM
- Stack: Next.js 15, TypeScript, Firebase
- 75% do MVP concluído
- Foco em automação de documentos jurídicos

## Arquivos Relevantes para Análise
- src/ai/orchestrator/ (sistema de orquestração existente)
- src/components/ (componentes React)
- docs/ (documentação do projeto)
- Context-Engineering-Intro/ (templates e padrões)

## Objetivo
Criar um PRP completo que o Claude Code possa executar em uma única sessão.
EOF

    log_info "📝 Arquivo de feature criado: tmp_rovodev_feature_${feature_name}.md"
    log_warning "🔄 PRÓXIMO PASSO: Execute no Gemini CLI:"
    echo ""
    echo "gemini analyze tmp_rovodev_feature_${feature_name}.md --output PRPs/${feature_name}-prp.md --template Context-Engineering-Intro/PRPs/templates/prp_base.md"
    echo ""
    log_info "Após o Gemini gerar o PRP, execute: ./scripts/multi-agent-workflow.sh execute ${feature_name}"
}

# Função para executar PRP com Claude Code
execute_prp_with_claude() {
    local feature_name="$1"
    local prp_file="PRPs/${feature_name}-prp.md"
    
    if [ ! -f "$prp_file" ]; then
        log_error "❌ PRP não encontrado: $prp_file"
        log_info "Execute primeiro: ./scripts/multi-agent-workflow.sh plan <feature_name> <description>"
        exit 1
    fi
    
    log_info "⚡ Preparando execução com Claude Code..."
    
    # Criar contexto estruturado para o Claude
    cat > "tmp_rovodev_claude_context.md" << EOF
# Contexto para Execução - ${feature_name}

## PRP a ser executado
$(cat "$prp_file")

## Estrutura do Projeto LexAI
$(find src -type f -name "*.ts" -o -name "*.tsx" | head -20)

## Comandos de Validação Disponíveis
- \`npm run typecheck\` - Verificação de tipos TypeScript
- \`npm run lint\` - ESLint
- \`npm run build\` - Build de produção
- \`npm run test\` - Testes (quando implementados)

## Padrões do Projeto
- Usar TypeScript strict mode
- Seguir convenções do Next.js 15
- Integrar com Firebase existente
- Manter compatibilidade com orquestrador multi-LLM
EOF

    log_success "✅ Contexto preparado para Claude Code"
    log_warning "🔄 PRÓXIMO PASSO: No Claude Code, execute:"
    echo ""
    echo "/execute-prp tmp_rovodev_claude_context.md"
    echo ""
    log_info "Ou copie o conteúdo do arquivo e cole no Claude Code com o comando:"
    echo "Implemente a feature seguindo o PRP em tmp_rovodev_claude_context.md"
}

# Função para validar implementação
validate_implementation() {
    local feature_name="$1"
    
    log_info "🔍 Validando implementação..."
    
    # Verificação de tipos
    if npm run typecheck; then
        log_success "✅ TypeScript: OK"
    else
        log_error "❌ TypeScript: Erros encontrados"
        return 1
    fi
    
    # Lint
    if npm run lint; then
        log_success "✅ ESLint: OK"
    else
        log_warning "⚠️ ESLint: Avisos encontrados"
    fi
    
    # Build
    if npm run build; then
        log_success "✅ Build: OK"
    else
        log_error "❌ Build: Falhou"
        return 1
    fi
    
    log_success "🎉 Implementação validada com sucesso!"
}

# Função para limpar arquivos temporários
cleanup() {
    log_info "🧹 Limpando arquivos temporários..."
    rm -f tmp_rovodev_*
    log_success "✅ Limpeza concluída"
}

# Função para mostrar status do projeto
show_status() {
    log_info "📊 Status do Projeto LexAI"
    echo ""
    echo "📁 Estrutura Principal:"
    echo "  ├── src/ai/orchestrator/ (Orquestrador Multi-LLM)"
    echo "  ├── src/components/ (Componentes React)"
    echo "  ├── src/app/ (Rotas Next.js)"
    echo "  ├── functions/ (Firebase Functions)"
    echo "  └── docs/ (Documentação)"
    echo ""
    echo "🤖 Agentes Disponíveis:"
    echo "  ├── Gemini CLI (Planejamento estratégico)"
    echo "  ├── Claude Code (Implementação)"
    echo "  └── Orquestrador LexAI (OpenAI/Google/Anthropic)"
    echo ""
    echo "📋 PRPs Existentes:"
    if ls PRPs/*.md >/dev/null 2>&1; then
        ls PRPs/*.md | sed 's/^/  ├── /'
    else
        echo "  └── Nenhum PRP encontrado"
    fi
}

# Menu principal
case "${1:-help}" in
    "plan")
        if [ -z "$2" ] || [ -z "$3" ]; then
            log_error "Uso: $0 plan <feature_name> <description>"
            exit 1
        fi
        create_prp_with_gemini "$2" "$3"
        ;;
    "execute")
        if [ -z "$2" ]; then
            log_error "Uso: $0 execute <feature_name>"
            exit 1
        fi
        execute_prp_with_claude "$2"
        ;;
    "validate")
        if [ -z "$2" ]; then
            log_error "Uso: $0 validate <feature_name>"
            exit 1
        fi
        validate_implementation "$2"
        ;;
    "status")
        show_status
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|*)
        echo "🤖 Multi-Agent Workflow para LexAI"
        echo ""
        echo "Uso: $0 <comando> [argumentos]"
        echo ""
        echo "Comandos disponíveis:"
        echo "  plan <name> <desc>  - Criar PRP com Gemini CLI"
        echo "  execute <name>      - Executar PRP com Claude Code"
        echo "  validate <name>     - Validar implementação"
        echo "  status              - Mostrar status do projeto"
        echo "  cleanup             - Limpar arquivos temporários"
        echo "  help                - Mostrar esta ajuda"
        echo ""
        echo "Fluxo recomendado:"
        echo "  1. $0 plan nova-feature 'Descrição da feature'"
        echo "  2. [Execute comando Gemini sugerido]"
        echo "  3. $0 execute nova-feature"
        echo "  4. [Execute no Claude Code]"
        echo "  5. $0 validate nova-feature"
        ;;
esac