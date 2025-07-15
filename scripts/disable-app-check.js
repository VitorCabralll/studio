#!/usr/bin/env node

/**
 * Script para Desativar App Check - Firebase
 * Usa a Firebase Admin SDK para verificar e desativar App Check
 */

const admin = require('firebase-admin');
const path = require('path');

console.log('🛡️ DESATIVANDO APP CHECK DO FIREBASE\n');

// Configurar Firebase Admin SDK
try {
  // Usar credenciais do ambiente
  const serviceAccount = {
    "type": "service_account",
    "project_id": process.env.FIREBASE_PROJECT_ID || "lexai-ef0ab",
    "private_key_id": "...",
    "private_key": process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": "...",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs"
  };

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID || "lexai-ef0ab"
    });
  }

  console.log('✅ Firebase Admin SDK inicializado');

} catch (error) {
  console.log('❌ Erro ao inicializar Firebase Admin SDK:', error.message);
  console.log('\n📝 SOLUÇÃO ALTERNATIVA:');
  console.log('Como o App Check não pode ser desativado via CLI facilmente,');
  console.log('você deve desativá-lo manualmente no Firebase Console:\n');
  
  console.log('1. 🌐 Acesse: https://console.firebase.google.com/project/lexai-ef0ab/appcheck');
  console.log('2. 🔧 Se houver aplicativos listados, clique em cada um');
  console.log('3. ❌ Desative ou delete as configurações do App Check');
  console.log('4. 💾 Salve as alterações');
  
  console.log('\n🔄 ALTERNATIVA - Configurar para Desenvolvimento:');
  console.log('Se preferir manter o App Check ativo:');
  console.log('1. 🌐 No mesmo console do App Check');
  console.log('2. 🔧 Configure um "Debug provider" para desenvolvimento');
  console.log('3. 📋 Copie o debug token gerado');
  console.log('4. 🔨 Adicione o token no código da aplicação');
  
  console.log('\n🎯 VERIFICAÇÃO RÁPIDA:');
  console.log('Para verificar se o App Check está causando o erro 400:');
  console.log('1. 🌐 Abra https://console.firebase.google.com/project/lexai-ef0ab/appcheck');
  console.log('2. 👀 Se estiver vazio ou sem apps = App Check não é o problema');
  console.log('3. 📱 Se houver apps listados = App Check pode estar causando o erro');
  
  process.exit(1);
}

// Tentar verificar o status do App Check via Admin SDK
async function checkAppCheckStatus() {
  try {
    console.log('🔍 Verificando status do App Check...');
    
    // O App Check não tem API direta no Admin SDK para listar/desativar
    // Mas podemos verificar se está configurado indiretamente
    
    console.log('⚠️ App Check deve ser desativado manualmente no console:');
    console.log('🌐 https://console.firebase.google.com/project/lexai-ef0ab/appcheck\n');
    
    return false;
  } catch (error) {
    console.log('❌ Erro ao verificar App Check:', error.message);
    return false;
  }
}

// Executar verificação
checkAppCheckStatus().then((success) => {
  if (!success) {
    console.log('📋 INSTRUÇÕES DETALHADAS PARA DESATIVAR APP CHECK:\n');
    
    console.log('PASSO 1: Acessar o Console');
    console.log('🌐 https://console.firebase.google.com/project/lexai-ef0ab/appcheck\n');
    
    console.log('PASSO 2: Verificar Apps Configurados');
    console.log('👀 Se houver aplicativos listados (web, Android, iOS)');
    console.log('📱 Clique em cada aplicativo listado\n');
    
    console.log('PASSO 3: Desativar ou Remover');
    console.log('❌ Para cada app: clique em "Disable" ou "Remove"');
    console.log('💾 Confirme a ação\n');
    
    console.log('PASSO 4: Verificar Lista Vazia');
    console.log('✅ A lista de apps deve ficar vazia');
    console.log('🔄 Isso indica que o App Check está desativado\n');
    
    console.log('PASSO 5: Testar Autenticação');
    console.log('🧪 Teste login/cadastro novamente');
    console.log('📊 Monitore os logs do navegador');
    console.log('🎯 O erro 400 deve desaparecer\n');
    
    console.log('❓ Se o erro persistir após desativar o App Check:');
    console.log('1. 🔄 Limpe cache do navegador');
    console.log('2. 🔄 Reinicie o servidor de desenvolvimento');
    console.log('3. 🧪 Teste em aba anônima/incógnita');
    console.log('4. 🔍 Verifique outros possíveis problemas no diagnóstico');
  }
}).catch(console.error);