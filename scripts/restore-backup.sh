#!/bin/bash

# 🔄 Script de Restauração de Backup - LexAI
# Restaura projeto a partir de backup em caso de problemas

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Verificar parâmetro
if [ $# -eq 0 ]; then
    echo "🔄 Script de Restauração LexAI"
    echo ""
    echo "Uso: ./scripts/restore-backup.sh [pasta-backup]"
    echo ""
    echo "Backups disponíveis:"
    ls -la backups/ 2>/dev/null | grep "^d" | awk '{print "  - " $9}' | grep -v "^\.$\|^\.\.$" || echo "  Nenhum backup encontrado"
    exit 1
fi

BACKUP_DIR=$1

echo -e "${BLUE}🔄 Iniciando Restauração de Backup${NC}"
echo "====================================="

# Verificações de segurança
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${RED}❌ Pasta de backup não encontrada: $BACKUP_DIR${NC}"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Execute este script no diretório raiz do projeto${NC}"
    exit 1
fi

echo -e "${YELLOW}⚠️  ATENÇÃO: Esta operação irá sobrescrever configurações atuais!${NC}"
echo "Backup a ser restaurado: $BACKUP_DIR"
echo ""

# Listar conteúdo do backup
echo "📁 Conteúdo do backup:"
ls -la "$BACKUP_DIR/" | awk '{print "   " $9 " (" $5 " bytes)"}' | grep -v "^\.$\|^\.\.$"

echo ""
read -p "Confirma a restauração? Digite 'RESTAURAR' para continuar: " confirm

if [ "$confirm" != "RESTAURAR" ]; then
    echo -e "${YELLOW}🛑 Restauração cancelada${NC}"
    exit 0
fi

# FASE 1: Backup atual antes de restaurar
echo ""
echo -e "${BLUE}📦 FASE 1: Backup do Estado Atual${NC}"
echo "==================================="

SAFETY_BACKUP="backups/before-restore-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$SAFETY_BACKUP"

echo "💾 Criando backup de segurança em: $SAFETY_BACKUP"

# Backup configurações atuais
cp -r environments/ "$SAFETY_BACKUP/" 2>/dev/null || true
cp package.json "$SAFETY_BACKUP/" 2>/dev/null || true
cp firestore.rules "$SAFETY_BACKUP/" 2>/dev/null || true
cp .env.local "$SAFETY_BACKUP/" 2>/dev/null || true

echo -e "${GREEN}✅ Backup de segurança criado${NC}"

# FASE 2: Restauração
echo ""
echo -e "${BLUE}🔄 FASE 2: Restauração${NC}"
echo "======================="

echo "📁 Restaurando arquivos de configuração..."

# Restaurar environments
if [ -d "$BACKUP_DIR/environments" ]; then
    rm -rf environments/ 2>/dev/null || true
    cp -r "$BACKUP_DIR/environments" .
    echo "   ✅ Ambientes restaurados"
fi

# Restaurar regras Firestore
if [ -f "$BACKUP_DIR/firestore.rules" ]; then
    cp "$BACKUP_DIR/firestore.rules" .
    echo "   ✅ Regras Firestore restauradas"
fi

# Restaurar package.json
if [ -f "$BACKUP_DIR/package.json" ]; then
    cp "$BACKUP_DIR/package.json" .
    echo "   ✅ Package.json restaurado"
fi

# Restaurar usuários (se existir)
if [ -f "$BACKUP_DIR/backup-users.json" ]; then
    echo "👥 Restaurando usuários Firebase..."
    firebase auth:import "$BACKUP_DIR/backup-users.json" || echo "⚠️  Não foi possível restaurar usuários"
fi

echo -e "${GREEN}✅ Restauração de arquivos concluída${NC}"

# FASE 3: Verificação
echo ""
echo -e "${BLUE}🔍 FASE 3: Verificação${NC}"
echo "======================="

echo "🔧 Verificando integridade do projeto..."

# Verificar package.json
if node -e "JSON.parse(require('fs').readFileSync('package.json'))" 2>/dev/null; then
    echo "   ✅ Package.json válido"
else
    echo -e "   ${RED}❌ Package.json inválido${NC}"
fi

# Verificar ambientes
if [ -d "environments" ]; then
    echo "   ✅ Pasta de ambientes presente"
    
    # Verificar arquivos críticos
    if [ -f "environments/development/.env.development" ]; then
        echo "   ✅ Ambiente development OK"
    else
        echo -e "   ${YELLOW}⚠️  Ambiente development ausente${NC}"
    fi
    
    if [ -f "environments/staging/.env.staging" ]; then
        echo "   ✅ Ambiente staging OK"
    else
        echo -e "   ${YELLOW}⚠️  Ambiente staging ausente${NC}"
    fi
else
    echo -e "   ${RED}❌ Pasta de ambientes ausente${NC}"
fi

# Definir ambiente padrão se não existir .env.local
if [ ! -f ".env.local" ]; then
    echo "🔧 Configurando ambiente padrão..."
    if [ -f "environments/development/.env.development" ]; then
        cp environments/development/.env.development .env.local
        echo "   ✅ Ambiente development ativado"
    fi
fi

echo -e "${GREEN}✅ Verificação concluída${NC}"

# FASE 4: Reinstalação (se necessário)
echo ""
echo -e "${BLUE}📦 FASE 4: Reinstalação de Dependências${NC}"
echo "========================================"

read -p "Reinstalar dependências? (recomendado) (Y/n): " reinstall

if [[ $reinstall != [nN] ]]; then
    echo "📦 Reinstalando dependências..."
    npm ci --silent
    echo -e "${GREEN}✅ Dependências reinstaladas${NC}"
fi

# RELATÓRIO FINAL
echo ""
echo -e "${GREEN}🎉 RESTAURAÇÃO CONCLUÍDA!${NC}"
echo "=========================="

echo -e "${BLUE}📊 Resumo da operação:${NC}"
echo "   📁 Backup restaurado: $BACKUP_DIR"
echo "   💾 Backup de segurança: $SAFETY_BACKUP"
echo "   🔧 Configurações: Restauradas"
echo "   📦 Dependências: $([ "$reinstall" != "n" ] && echo "Reinstaladas" || echo "Mantidas")"

echo ""
echo -e "${YELLOW}🔄 Próximos passos recomendados:${NC}"
echo "   1. Verificar ambiente ativo: npm run env:current"
echo "   2. Executar projeto: npm run dev"
echo "   3. Testar funcionalidades críticas"
echo "   4. Fazer novo backup se tudo estiver OK"

echo ""
echo -e "${GREEN}✅ Projeto restaurado com sucesso!${NC}"