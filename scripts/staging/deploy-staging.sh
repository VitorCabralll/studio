#!/bin/bash

# 🚀 Script de Deploy Staging - LexAI
# Deploys the app to staging environment with safety checks

echo "🚀 Iniciando deploy staging..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script no diretório raiz do projeto"
    exit 1
fi

# Verificar se Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI não encontrado. Instale com: npm install -g firebase-tools"
    exit 1
fi

# Verificar se está logado no Firebase
if ! firebase projects:list &> /dev/null; then
    echo "❌ Não logado no Firebase. Execute: firebase login"
    exit 1
fi

echo "✅ Pré-requisitos verificados"

# Backup do arquivo de ambiente atual
if [ -f ".env.local" ]; then
    cp .env.local .env.local.backup
    echo "📁 Backup do .env.local criado"
fi

# Usar configuração de staging
cp .env.staging .env.local
echo "🔧 Configuração de staging ativada"

# Executar build
echo "📦 Iniciando build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build falhou! Restaurando configuração original..."
    if [ -f ".env.local.backup" ]; then
        mv .env.local.backup .env.local
    fi
    exit 1
fi

echo "✅ Build concluído com sucesso"

# Deploy das regras do Firestore (staging)
echo "🔐 Atualizando regras do Firestore..."
cp firestore.staging.rules firestore.rules
firebase deploy --only firestore:rules

if [ $? -ne 0 ]; then
    echo "❌ Deploy das regras falhou!"
    # Restaurar regras originais
    git checkout firestore.rules 2>/dev/null || echo "Não foi possível restaurar regras originais"
    exit 1
fi

# Deploy do hosting
echo "🌐 Fazendo deploy do hosting..."
firebase deploy --only hosting

if [ $? -ne 0 ]; then
    echo "❌ Deploy do hosting falhou!"
    exit 1
fi

# Deploy das functions (se existirem)
if [ -d "functions" ]; then
    echo "⚡ Fazendo deploy das functions..."
    firebase deploy --only functions
fi

# Restaurar configuração original
if [ -f ".env.local.backup" ]; then
    mv .env.local.backup .env.local
    echo "🔄 Configuração original restaurada"
fi

# Restaurar regras originais
git checkout firestore.rules 2>/dev/null && echo "🔄 Regras originais restauradas"

echo "🎉 Deploy staging concluído com sucesso!"
echo "📱 URL: https://lexai-ef0ab.web.app"
echo "🔍 Verifique os logs em: https://console.firebase.google.com"

# Executar testes básicos
echo "🧪 Executando testes básicos..."
curl -s -o /dev/null -w "%{http_code}" https://lexai-ef0ab.web.app > /tmp/staging-test
STATUS_CODE=$(cat /tmp/staging-test)

if [ "$STATUS_CODE" = "200" ]; then
    echo "✅ Site acessível (HTTP $STATUS_CODE)"
else
    echo "⚠️ Site pode ter problemas (HTTP $STATUS_CODE)"
fi

echo "✅ Deploy staging finalizado!"