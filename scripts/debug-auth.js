#!/usr/bin/env node

/**
 * Script de Debug - Autenticação Firebase
 * Identifica problemas específicos de configuração
 */

console.log('🔍 DIAGNÓSTICO DE AUTENTICAÇÃO FIREBASE\n');

// Verificar se existem problemas conhecidos com erro 400
console.log('📋 PROBLEMAS COMUNS QUE CAUSAM ERRO 400:\n');

console.log('1. 🛡️  APP CHECK HABILITADO');
console.log('   - Firebase Console > Project Settings > App Check');
console.log('   - Verificar se App Check está habilitado');
console.log('   - Se sim, desabilitar ou configurar adequadamente\n');

console.log('2. 🔑 CONFIGURAÇÃO DE API KEY');
console.log('   - Verificar se a API key é válida');
console.log('   - Verificar se não está restrita incorretamente');
console.log('   - Firebase Console > Project Settings > General\n');

console.log('3. 🌐 DOMÍNIO DE AUTENTICAÇÃO');
console.log('   - Verificar authDomain no .env.local');
console.log('   - Deve ser: lexai-ef0ab.firebaseapp.com');
console.log('   - Firebase Console > Authentication > Settings > Authorized domains\n');

console.log('4. 🔒 AUTENTICAÇÃO HABILITADA');
console.log('   - Firebase Console > Authentication > Sign-in method');
console.log('   - Verificar se Email/Password está habilitado');
console.log('   - Verificar se Google OAuth está habilitado\n');

console.log('5. 📱 CONFIGURAÇÃO DO PROJETO');
console.log('   - Verificar se o projeto lexai-ef0ab está ativo');
console.log('   - Verificar se não há problemas de billing');
console.log('   - Verificar cotas de uso\n');

// Verificar arquivo .env.local
const fs = require('fs');
const envPath = '.env.local';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  console.log('🔧 ANÁLISE DO .env.local:');
  
  // Verificar API Key
  const apiKeyMatch = envContent.match(/NEXT_PUBLIC_FIREBASE_API_KEY=(.+)/);
  if (apiKeyMatch && apiKeyMatch[1] && apiKeyMatch[1] !== 'your_api_key') {
    console.log('  ✅ API Key configurada');
  } else {
    console.log('  ❌ API Key não configurada ou inválida');
  }
  
  // Verificar Auth Domain
  const authDomainMatch = envContent.match(/NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=(.+)/);
  if (authDomainMatch && authDomainMatch[1] === 'lexai-ef0ab.firebaseapp.com') {
    console.log('  ✅ Auth Domain correto');
  } else {
    console.log('  ❌ Auth Domain incorreto ou não configurado');
  }
  
  // Verificar Project ID
  const projectIdMatch = envContent.match(/NEXT_PUBLIC_FIREBASE_PROJECT_ID=(.+)/);
  if (projectIdMatch && projectIdMatch[1] === 'lexai-ef0ab') {
    console.log('  ✅ Project ID correto');
  } else {
    console.log('  ❌ Project ID incorreto ou não configurado');
  }
  
} else {
  console.log('❌ Arquivo .env.local não encontrado');
}

console.log('\n' + '='.repeat(60));
console.log('🎯 AÇÕES RECOMENDADAS PARA RESOLVER ERRO 400:');
console.log('='.repeat(60));

console.log('\n1. 🚨 VERIFICAR APP CHECK (MAIS PROVÁVEL):');
console.log('   a. Acesse: https://console.firebase.google.com/project/lexai-ef0ab/appcheck');
console.log('   b. Se App Check estiver habilitado, DESABILITE temporariamente');
console.log('   c. Ou configure corretamente para desenvolvimento');

console.log('\n2. 🔑 VERIFICAR AUTHENTICATION:');
console.log('   a. Acesse: https://console.firebase.google.com/project/lexai-ef0ab/authentication/providers');
console.log('   b. Certifique-se que Email/Password está habilitado');
console.log('   c. Certifique-se que Google está habilitado (se usando)');

console.log('\n3. 🌐 VERIFICAR DOMÍNIOS AUTORIZADOS:');
console.log('   a. Acesse: Authentication > Settings > Authorized domains');
console.log('   b. Adicione: localhost (para desenvolvimento)');
console.log('   c. Verifique se o domínio de produção está listado');

console.log('\n4. 🔄 LIMPAR CACHE:');
console.log('   a. Limpe cache do navegador');
console.log('   b. Teste em aba anônima');
console.log('   c. Reinicie o servidor de desenvolvimento');

console.log('\n📞 Se o problema persistir:');
console.log('   - Verifique logs detalhados no Console do Firebase');
console.log('   - Verifique se há problemas de billing/quotas');
console.log('   - Considere recriar as credenciais do app');

console.log('\n🏁 Execute este diagnóstico após cada mudança e teste novamente.');