#!/bin/bash

# Script para configurar domínio local alternativo
echo "🔧 CONFIGURANDO DOMÍNIO LOCAL PARA FIREBASE AUTH"

# Opção 1: Adicionar entrada no /etc/hosts
echo ""
echo "📋 OPÇÃO 1: Usar domínio local personalizado"
echo "1. Execute: sudo nano /etc/hosts"
echo "2. Adicione a linha: 127.0.0.1 lexai.local"
echo "3. Salve o arquivo"
echo "4. No Firebase Console, adicione: lexai.local"
echo "5. Acesse: http://lexai.local:3000"

echo ""
echo "📋 OPÇÃO 2: Configurar Next.js na porta 80"
echo "1. Pare o servidor atual (Ctrl+C)"
echo "2. Execute: sudo npm run dev -- --port 80"
echo "3. No Firebase Console, adicione: localhost"
echo "4. Acesse: http://localhost"

echo ""
echo "📋 OPÇÃO 3: Usar 127.0.0.1"
echo "1. No Firebase Console, adicione: 127.0.0.1"
echo "2. Acesse: http://127.0.0.1:3000"

echo ""
echo "🎯 RECOMENDAÇÃO:"
echo "Tente primeiro adicionar apenas 'localhost' no Firebase Console"
echo "Firebase deveria aceitar localhost sem porta."