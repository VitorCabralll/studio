#!/bin/bash

echo "🔧 CORREÇÃO ERRO 400 - AUTENTICAÇÃO FIREBASE"
echo "============================================"
echo ""

echo "📊 DIAGNÓSTICO ATUAL:"
echo "❌ Erro 400 (Bad Request) em signInWithPassword e signUp"
echo "🎯 Causa mais provável: App Check habilitado"
echo ""

echo "🛡️ VERIFICAÇÃO E DESATIVAÇÃO DO APP CHECK:"
echo ""

echo "PASSO 1: Abrir o Firebase Console"
echo "🌐 URL: https://console.firebase.google.com/project/lexai-ef0ab/appcheck"
echo ""

echo "PASSO 2: Verificar se há aplicativos listados"
echo "👀 Se a página estiver vazia = App Check não é o problema"
echo "📱 Se houver apps listados = App Check está causando o erro"
echo ""

echo "PASSO 3: Desativar App Check (se houver apps)"
echo "Para cada aplicativo listado:"
echo "  1. Clique no aplicativo"
echo "  2. Clique em 'Disable' ou 'Remove'"
echo "  3. Confirme a ação"
echo ""

echo "PASSO 4: Verificar outras configurações"
echo "🔐 Authentication > Settings > Authorized domains"
echo "   - Certifique-se que 'localhost' está na lista"
echo "   - Para desenvolvimento local"
echo ""

echo "🔑 Authentication > Sign-in method"
echo "   - Email/Password deve estar 'Enabled'"
echo "   - Google deve estar 'Enabled' (se usando)"
echo ""

echo "PASSO 5: Limpar cache e testar"
echo "🔄 Limpe cache do navegador"
echo "🧪 Teste em aba anônima"
echo "🔄 Reinicie o servidor de desenvolvimento"
echo ""

echo "📝 VERIFICAÇÃO RÁPIDA - COMANDOS ÚTEIS:"
echo ""

# Verificar se o servidor está rodando
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Servidor local rodando em http://localhost:3000"
else
    echo "❌ Servidor local não está rodando"
    echo "💡 Execute: npm run dev"
fi

echo ""

# Verificar configuração do .env.local
if [ -f ".env.local" ]; then
    echo "✅ Arquivo .env.local existe"
    
    # Verificar variáveis essenciais
    if grep -q "NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy" .env.local; then
        echo "✅ API Key configurada"
    else
        echo "❌ API Key não configurada"
    fi
    
    if grep -q "NEXT_PUBLIC_FIREBASE_PROJECT_ID=lexai-ef0ab" .env.local; then
        echo "✅ Project ID correto"
    else
        echo "❌ Project ID incorreto"
    fi
else
    echo "❌ Arquivo .env.local não encontrado"
fi

echo ""
echo "🎯 RESUMO DAS AÇÕES:"
echo "1. ✅ Firebase CLI configurado"
echo "2. 🌐 Acesse o link do App Check acima"
echo "3. ❌ Desative/remova apps do App Check"
echo "4. 🔄 Limpe cache e teste novamente"
echo ""

echo "📞 Se o erro persistir:"
echo "- Verifique se há problemas de billing no Firebase"
echo "- Verifique se as cotas não foram excedidas"
echo "- Considere recriar as credenciais do app"
echo ""

echo "🚀 Execute este diagnóstico após fazer as mudanças:"
echo "   node scripts/debug-auth.js"