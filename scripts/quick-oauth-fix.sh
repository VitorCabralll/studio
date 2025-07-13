#!/bin/bash

# Script para abrir diretamente a configuração OAuth
# Uso: bash scripts/quick-oauth-fix.sh

echo "🔧 Abrindo configuração OAuth do Google Cloud..."
echo ""
echo "📋 URLs para adicionar:"
echo "================================"
echo "✅ URIs de redirecionamento:"
echo "https://lexai-ef0ab.firebaseapp.com/__/auth/handler"
echo "https://lexai--lexai-ef0ab.us-central1.hosted.app/__/auth/handler"
echo "https://lexai-ef0ab.web.app/__/auth/handler"
echo ""
echo "✅ Origens JavaScript:"
echo "https://lexai-ef0ab.firebaseapp.com"
echo "https://lexai--lexai-ef0ab.us-central1.hosted.app"
echo "https://lexai-ef0ab.web.app"
echo ""
echo "🌐 Abrindo Google Cloud Console..."

# Tentar abrir no browser (funciona no macOS/Linux com GUI)
if command -v open > /dev/null; then
    open "https://console.cloud.google.com/apis/credentials?project=lexai-ef0ab"
elif command -v xdg-open > /dev/null; then
    xdg-open "https://console.cloud.google.com/apis/credentials?project=lexai-ef0ab"
else
    echo "⚠️  Abra manualmente:"
    echo "https://console.cloud.google.com/apis/credentials?project=lexai-ef0ab"
fi

echo ""
echo "📝 Depois de adicionar as URLs:"
echo "1. Clique em 'Salvar'"
echo "2. Aguarde 2-3 minutos"
echo "3. Teste: https://lexai--lexai-ef0ab.us-central1.hosted.app/signup"