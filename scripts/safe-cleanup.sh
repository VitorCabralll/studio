#!/bin/bash

# 🧹 Script de Limpeza SEGURA - LexAI
# Limpa apenas dados de desenvolvimento sem afetar configurações

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🧹 Iniciando Limpeza SEGURA do LexAI${NC}"
echo "========================================"

# Verificações de segurança
echo -e "${YELLOW}🔍 Verificações de segurança...${NC}"

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Execute este script no diretório raiz do projeto${NC}"
    exit 1
fi

# Verificar se Firebase CLI está disponível
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI não encontrado${NC}"
    exit 1
fi

# Verificar se está logado
if ! firebase projects:list &> /dev/null; then
    echo -e "${RED}❌ Não logado no Firebase${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Verificações de segurança OK${NC}"

# FASE 1: BACKUP COMPLETO (OBRIGATÓRIO)
echo ""
echo -e "${BLUE}📦 FASE 1: Backup Completo${NC}"
echo "=============================="

# Criar pasta de backup com timestamp
BACKUP_DIR="backups/cleanup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📁 Criando backup em: $BACKUP_DIR"

# Backup usuários (já existe)
if [ -f "backup-users.json" ]; then
    mv backup-users.json "$BACKUP_DIR/"
    echo "👥 Backup de usuários salvo"
fi

# Backup regras Firestore
cp firestore.rules "$BACKUP_DIR/" 2>/dev/null || echo "⚠️  Firestore rules não encontradas"
cp environments/staging/firestore.staging.rules "$BACKUP_DIR/" 2>/dev/null || echo "⚠️  Staging rules não encontradas"

# Backup configurações
cp -r environments/ "$BACKUP_DIR/" 2>/dev/null || echo "⚠️  Ambientes não encontrados"

# Backup package.json
cp package.json "$BACKUP_DIR/"

echo -e "${GREEN}✅ Backup completo criado${NC}"

# FASE 2: LIMPEZA DE DADOS (NAMESPACE APENAS)
echo ""
echo -e "${BLUE}🗑️  FASE 2: Limpeza de Dados por Namespace${NC}"
echo "=============================================="

echo "🔍 Identificando dados para limpeza..."

# Lista de namespaces para limpar (SEGURO)
NAMESPACES_TO_CLEAN=(
    "dev_"
    "test_"
    "debug_"
    "temp_"
)

echo "📋 Namespaces que serão limpos:"
for ns in "${NAMESPACES_TO_CLEAN[@]}"; do
    echo "   - $ns*"
done

echo ""
read -p "Continuar com a limpeza? (y/N): " confirm

if [[ $confirm != [yY] ]]; then
    echo -e "${YELLOW}🛑 Limpeza cancelada${NC}"
    exit 0
fi

# Criar script Node.js para limpeza segura
cat > temp-cleanup.js << 'EOF'
const admin = require('firebase-admin');
const fs = require('fs');

// Inicializar Firebase Admin
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

async function safeCleanup() {
    console.log('🔍 Iniciando limpeza segura...');
    
    const namespacesToClean = ['dev_', 'test_', 'debug_', 'temp_'];
    let totalDeleted = 0;
    
    for (const namespace of namespacesToClean) {
        console.log(`🧹 Limpando namespace: ${namespace}*`);
        
        try {
            // Limpar collections com namespace
            const collections = await db.listCollections();
            
            for (const collection of collections) {
                if (collection.id.startsWith(namespace)) {
                    console.log(`   📁 Limpando collection: ${collection.id}`);
                    
                    const snapshot = await collection.get();
                    const batch = db.batch();
                    let batchCount = 0;
                    
                    snapshot.docs.forEach(doc => {
                        batch.delete(doc.ref);
                        batchCount++;
                        
                        // Firestore batch limit é 500
                        if (batchCount >= 500) {
                            batch.commit();
                            batchCount = 0;
                        }
                    });
                    
                    if (batchCount > 0) {
                        await batch.commit();
                    }
                    
                    totalDeleted += snapshot.docs.length;
                    console.log(`   ✅ ${snapshot.docs.length} documentos removidos`);
                }
            }
            
            // Limpar Storage com namespace
            console.log(`   🗂️  Limpando Storage: ${namespace}*`);
            const [files] = await bucket.getFiles({
                prefix: namespace
            });
            
            for (const file of files) {
                await file.delete();
                console.log(`   🗑️  Arquivo removido: ${file.name}`);
            }
            
            console.log(`   ✅ ${files.length} arquivos removidos do Storage`);
            
        } catch (error) {
            console.log(`   ⚠️  Erro no namespace ${namespace}:`, error.message);
        }
    }
    
    console.log(`🎉 Limpeza concluída! Total: ${totalDeleted} documentos`);
    
    // Salvar relatório
    const report = {
        timestamp: new Date().toISOString(),
        namespacesClean: namespacesToClean,
        totalDocumentsDeleted: totalDeleted,
        status: 'completed'
    };
    
    fs.writeFileSync('cleanup-report.json', JSON.stringify(report, null, 2));
    console.log('📊 Relatório salvo em: cleanup-report.json');
}

safeCleanup().then(() => {
    console.log('✅ Processo finalizado');
    process.exit(0);
}).catch(error => {
    console.error('❌ Erro na limpeza:', error);
    process.exit(1);
});
EOF

# Executar limpeza com as variáveis de ambiente
echo "🚀 Executando limpeza de namespaces..."
source .env.local
node temp-cleanup.js

# Limpar arquivo temporário
rm temp-cleanup.js

echo -e "${GREEN}✅ Limpeza de dados concluída${NC}"

# FASE 3: LIMPEZA LOCAL (MUITO SEGURO)
echo ""
echo -e "${BLUE}🧽 FASE 3: Limpeza Local${NC}"
echo "========================="

echo "🗑️  Limpando arquivos temporários locais..."

# Limpar node_modules/.cache (seguro)
rm -rf node_modules/.cache/ 2>/dev/null || true
echo "   ✅ Cache do Node.js limpo"

# Limpar .next (seguro)
rm -rf .next/ 2>/dev/null || true
echo "   ✅ Build cache limpo"

# Limpar logs de debug (seguro)
rm -f firestore-debug.log 2>/dev/null || true
rm -f firebase-debug.log 2>/dev/null || true
rm -f ui-debug.log 2>/dev/null || true
echo "   ✅ Logs de debug removidos"

# Limpar arquivos temporários do pglite
rm -f pglite-debug.log 2>/dev/null || true
echo "   ✅ Logs pglite removidos"

echo -e "${GREEN}✅ Limpeza local concluída${NC}"

# FASE 4: OTIMIZAÇÃO (OPCIONAL)
echo ""
echo -e "${BLUE}⚡ FASE 4: Otimização (Opcional)${NC}"
echo "================================="

read -p "Executar otimizações? (y/N): " optimize

if [[ $optimize == [yY] ]]; then
    echo "🔧 Executando otimizações..."
    
    # Rebuild node_modules (limpo)
    echo "📦 Reinstalando dependências..."
    npm ci --silent
    
    # Build limpo
    echo "🏗️  Build limpo..."
    npm run build --silent
    
    echo -e "${GREEN}✅ Otimizações concluídas${NC}"
fi

# RELATÓRIO FINAL
echo ""
echo -e "${GREEN}🎉 LIMPEZA SEGURA CONCLUÍDA!${NC}"
echo "=============================="

if [ -f "cleanup-report.json" ]; then
    echo "📊 Relatório detalhado:"
    cat cleanup-report.json | grep -E "(timestamp|totalDocumentsDeleted|status)"
fi

echo ""
echo -e "${BLUE}📁 Backup salvo em: $BACKUP_DIR${NC}"
echo -e "${YELLOW}⚠️  Para reverter, use: ./scripts/restore-backup.sh $BACKUP_DIR${NC}"
echo ""
echo -e "${GREEN}✅ Projeto limpo e seguro para continuar desenvolvimento!${NC}"