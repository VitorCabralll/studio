#!/bin/bash

# 📁 Script de Organização da Raiz - LexAI
# Organiza arquivos soltos em pastas apropriadas

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📁 Organizando Raiz do Projeto LexAI${NC}"
echo "====================================="

# Verificações de segurança
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Execute este script no diretório raiz do projeto${NC}"
    exit 1
fi

echo -e "${YELLOW}🔍 Analisando arquivos na raiz...${NC}"
echo "Arquivos atuais: $(ls -1 *.* 2>/dev/null | wc -l)"

# FASE 1: Backup de segurança
echo ""
echo -e "${BLUE}📦 FASE 1: Backup de Segurança${NC}"
echo "==============================="

BACKUP_DIR="backups/organization-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "💾 Criando backup em: $BACKUP_DIR"

# Backup de arquivos que serão movidos
cp *.md "$BACKUP_DIR/" 2>/dev/null || true
cp .env.example "$BACKUP_DIR/" 2>/dev/null || true
cp backup-users.json "$BACKUP_DIR/" 2>/dev/null || true
cp *.log "$BACKUP_DIR/" 2>/dev/null || true
cp tsconfig.tsbuildinfo "$BACKUP_DIR/" 2>/dev/null || true

echo -e "${GREEN}✅ Backup criado${NC}"

# FASE 2: Criar estrutura de pastas
echo ""
echo -e "${BLUE}📁 FASE 2: Criar Estrutura de Pastas${NC}"
echo "===================================="

echo "🏗️  Criando estrutura de pastas..."

# Criar pastas se não existirem
mkdir -p config
mkdir -p logs
mkdir -p backups/users

# Mover pasta docs se ela estiver na raiz (improvável, mas seguro)
if [ ! -d "docs" ]; then
    mkdir -p docs
fi

echo -e "${GREEN}✅ Estrutura de pastas criada${NC}"

# FASE 3: Mover documentação
echo ""
echo -e "${BLUE}📚 FASE 3: Organizar Documentação${NC}"
echo "=================================="

echo "📖 Movendo documentação para docs/..."

# Lista de arquivos de documentação para mover
DOC_FILES=(
    "SETUP.md"
    "CONTRIBUTING.md"
    "TESTE-COMPLETO.md"
    "GUIA-TESTES-INTERNOS.md"
    "ESTRUTURA-AMBIENTES.md"
    "INDICE-DOCUMENTACAO.md"
    "ANALISE-ARQUIVOS-RAIZ.md"
)

for file in "${DOC_FILES[@]}"; do
    if [ -f "$file" ]; then
        mv "$file" "docs/"
        echo "   📄 $file → docs/"
    fi
done

# Mover README.md e CLAUDE.md mantendo symlinks
if [ -f "README.md" ]; then
    mv "README.md" "docs/"
    ln -sf "docs/README.md" "README.md"
    echo "   📄 README.md → docs/ (com symlink)"
fi

if [ -f "CLAUDE.md" ]; then
    mv "CLAUDE.md" "docs/"
    ln -sf "docs/CLAUDE.md" "CLAUDE.md"
    echo "   📄 CLAUDE.md → docs/ (com symlink)"
fi

echo -e "${GREEN}✅ Documentação organizada${NC}"

# FASE 4: Mover configurações
echo ""
echo -e "${BLUE}⚙️ FASE 4: Organizar Configurações${NC}"
echo "=================================="

echo "🔧 Movendo templates de configuração..."

if [ -f ".env.example" ]; then
    mv ".env.example" "config/"
    echo "   📄 .env.example → config/"
fi

echo -e "${GREEN}✅ Configurações organizadas${NC}"

# FASE 5: Organizar backups
echo ""
echo -e "${BLUE}💾 FASE 5: Organizar Backups${NC}"
echo "============================="

echo "🗂️  Movendo backups..."

if [ -f "backup-users.json" ]; then
    mv "backup-users.json" "backups/users/"
    echo "   📄 backup-users.json → backups/users/"
fi

echo -e "${GREEN}✅ Backups organizados${NC}"

# FASE 6: Organizar logs
echo ""
echo -e "${BLUE}📊 FASE 6: Organizar Logs${NC}"
echo "=========================="

echo "🗒️  Movendo logs temporários..."

# Lista de arquivos de log/temporários
LOG_FILES=(
    "firestore-debug.log"
    "pglite-debug.log"
    "tsconfig.tsbuildinfo"
)

for file in "${LOG_FILES[@]}"; do
    if [ -f "$file" ]; then
        mv "$file" "logs/"
        echo "   📄 $file → logs/"
    fi
done

# Mover arquivo de erro de build
if [ -f "errobiuld.md" ]; then
    mv "errobiuld.md" "logs/"
    echo "   📄 errobiuld.md → logs/"
fi

echo -e "${GREEN}✅ Logs organizados${NC}"

# FASE 7: Limpeza
echo ""
echo -e "${BLUE}🧹 FASE 7: Limpeza${NC}"
echo "=================="

echo "🗑️  Removendo arquivos desnecessários..."

# Remover backups desnecessários
if [ -f ".eslintrc.json.backup" ]; then
    rm ".eslintrc.json.backup"
    echo "   🗑️  .eslintrc.json.backup removido"
fi

echo -e "${GREEN}✅ Limpeza concluída${NC}"

# FASE 8: Atualizar .gitignore
echo ""
echo -e "${BLUE}📝 FASE 8: Atualizar .gitignore${NC}"
echo "==============================="

echo "📋 Atualizando .gitignore para nova estrutura..."

# Adicionar entradas para logs se não existirem
if ! grep -q "# Logs organized" .gitignore 2>/dev/null; then
    cat >> .gitignore << 'EOF'

# Logs organized
/logs/*.log
/logs/*.tsbuildinfo
/logs/debug-*

# Backups locais
/backups/local-*
/backups/temp-*
EOF
    echo "   📄 .gitignore atualizado"
fi

echo -e "${GREEN}✅ .gitignore atualizado${NC}"

# RELATÓRIO FINAL
echo ""
echo -e "${GREEN}🎉 ORGANIZAÇÃO CONCLUÍDA!${NC}"
echo "=========================="

echo -e "${BLUE}📊 Resumo da organização:${NC}"

# Contar arquivos na raiz
ROOT_FILES=$(ls -1 *.* 2>/dev/null | wc -l)
echo "   📁 Arquivos na raiz agora: $ROOT_FILES"

# Mostrar estrutura organizada
echo ""
echo -e "${BLUE}📁 Nova estrutura:${NC}"
echo "   📚 docs/ - $(ls docs/ 2>/dev/null | wc -l) arquivos de documentação"
echo "   ⚙️  config/ - $(ls config/ 2>/dev/null | wc -l) arquivo(s) de configuração"
echo "   💾 backups/ - $(ls backups/*/ 2>/dev/null | wc -l) backup(s)"
echo "   📊 logs/ - $(ls logs/ 2>/dev/null | wc -l) arquivo(s) de log"

echo ""
echo -e "${YELLOW}🔗 Symlinks criados:${NC}"
echo "   📄 README.md → docs/README.md"
echo "   📄 CLAUDE.md → docs/CLAUDE.md"

echo ""
echo -e "${BLUE}💾 Backup salvo em: $BACKUP_DIR${NC}"

echo ""
echo -e "${GREEN}✅ Projeto muito mais organizado e profissional!${NC}"
echo -e "${YELLOW}🔄 Reinicie o servidor de desenvolvimento para aplicar mudanças${NC}"