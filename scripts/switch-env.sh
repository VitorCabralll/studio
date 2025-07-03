#!/bin/bash

# 🔄 Script para trocar entre ambientes LexAI
# Uso: ./scripts/switch-env.sh [development|staging|production]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para mostrar uso
show_usage() {
    echo "🔄 Script de Troca de Ambiente LexAI"
    echo ""
    echo "Uso: ./scripts/switch-env.sh [ambiente]"
    echo ""
    echo "Ambientes disponíveis:"
    echo "  🛠️  development  - Desenvolvimento local"
    echo "  🧪  staging      - Testes internos" 
    echo "  🚀  production   - Ambiente real (CUIDADO!)"
    echo ""
    echo "Exemplo:"
    echo "  ./scripts/switch-env.sh development"
}

# Verificar parâmetro
if [ $# -eq 0 ]; then
    show_usage
    exit 1
fi

ENV=$1

# Verificar se o ambiente é válido
case $ENV in
    development|dev)
        ENV="development"
        ENV_FILE="environments/development/.env.development"
        EMOJI="🛠️"
        COLOR=$BLUE
        ;;
    staging)
        ENV="staging"
        ENV_FILE="environments/staging/.env.staging"
        EMOJI="🧪"
        COLOR=$YELLOW
        ;;
    production|prod)
        ENV="production"
        ENV_FILE="environments/production/.env.production"
        EMOJI="🚀"
        COLOR=$RED
        ;;
    *)
        echo -e "${RED}❌ Ambiente inválido: $ENV${NC}"
        show_usage
        exit 1
        ;;
esac

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Execute este script no diretório raiz do projeto${NC}"
    exit 1
fi

# Verificar se o arquivo de ambiente existe
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ Arquivo de ambiente não encontrado: $ENV_FILE${NC}"
    exit 1
fi

# Backup do ambiente atual (se existir)
if [ -f ".env.local" ]; then
    cp .env.local .env.local.backup
    echo -e "${GREEN}📁 Backup do ambiente atual criado${NC}"
fi

# Avisos especiais para produção
if [ "$ENV" = "production" ]; then
    echo -e "${RED}⚠️  ATENÇÃO: Você está mudando para PRODUÇÃO!${NC}"
    echo -e "${RED}⚠️  Este ambiente afeta usuários reais!${NC}"
    echo ""
    read -p "Tem certeza? Digite 'CONFIRMO' para continuar: " confirm
    
    if [ "$confirm" != "CONFIRMO" ]; then
        echo -e "${YELLOW}🛑 Operação cancelada${NC}"
        exit 0
    fi
fi

# Copiar arquivo de ambiente
cp "$ENV_FILE" .env.local

echo ""
echo -e "${COLOR}${EMOJI} Ambiente alterado para: ${ENV^^}${NC}"
echo ""

# Mostrar configurações principais
echo "📋 Configurações ativas:"
if grep -q "NEXT_PUBLIC_APP_ENV=" .env.local; then
    APP_ENV=$(grep "NEXT_PUBLIC_APP_ENV=" .env.local | cut -d'=' -f2)
    echo "   🌍 Environment: $APP_ENV"
fi

if grep -q "NEXT_PUBLIC_APP_NAMESPACE=" .env.local; then
    NAMESPACE=$(grep "NEXT_PUBLIC_APP_NAMESPACE=" .env.local | cut -d'=' -f2)
    echo "   🏷️  Namespace: ${NAMESPACE:-'(nenhum)'}"
fi

if grep -q "NEXT_PUBLIC_MAX_FILE_SIZE=" .env.local; then
    MAX_SIZE=$(grep "NEXT_PUBLIC_MAX_FILE_SIZE=" .env.local | cut -d'=' -f2)
    SIZE_MB=$((MAX_SIZE / 1048576))
    echo "   📁 Max file size: ${SIZE_MB}MB"
fi

echo ""

# Instruções específicas por ambiente
case $ENV in
    development)
        echo -e "${BLUE}🛠️  Ambiente de DESENVOLVIMENTO ativo${NC}"
        echo "   • Use para desenvolvimento diário"
        echo "   • Execute: npm run dev"
        echo "   • URL: http://localhost:3000"
        ;;
    staging)
        echo -e "${YELLOW}🧪 Ambiente de STAGING ativo${NC}"
        echo "   • Use para testes internos"
        echo "   • Execute: npm run build && firebase deploy"
        echo "   • URL: https://lexai-ef0ab.web.app (com banner)"
        ;;
    production)
        echo -e "${RED}🚀 Ambiente de PRODUÇÃO ativo${NC}"
        echo -e "${RED}   ⚠️  CUIDADO: Afeta usuários reais!${NC}"
        echo "   • Use apenas para releases finais"
        echo "   • URL: https://lexai-ef0ab.web.app"
        ;;
esac

echo ""
echo -e "${GREEN}✅ Troca de ambiente concluída!${NC}"

# Verificar se há servidor rodando
if pgrep -f "next dev" > /dev/null; then
    echo ""
    echo -e "${YELLOW}⚠️  Servidor Next.js detectado rodando${NC}"
    echo "   Reinicie o servidor para aplicar as mudanças:"
    echo "   Ctrl+C no terminal e execute: npm run dev"
fi