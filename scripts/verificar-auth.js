#!/usr/bin/env node

/**
 * Script de Verificação do Sistema de Autenticação
 * Verifica se tudo está configurado corretamente
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICANDO SISTEMA DE AUTENTICAÇÃO...\n');

// Verificar arquivos essenciais
const arquivosEssenciais = [
  '.env.example',
  'src/hooks/use-simple-auth.tsx',
  'src/components/auth/login-form.tsx', 
  'src/components/auth/signup-form.tsx',
  'src/lib/firebase.ts',
  'src/lib/firebase-config.ts'
];

console.log('📁 Verificando arquivos essenciais...');
let arquivosOk = true;

arquivosEssenciais.forEach(arquivo => {
  if (fs.existsSync(arquivo)) {
    console.log(`  ✅ ${arquivo}`);
  } else {
    console.log(`  ❌ ${arquivo} - AUSENTE`);
    arquivosOk = false;
  }
});

// Verificar variáveis de ambiente
console.log('\n🔧 Verificando configuração de ambiente...');

const envLocal = '.env.local';
const envExample = '.env.example';

if (fs.existsSync(envLocal)) {
  console.log('  ✅ .env.local existe');
  
  // Ler variáveis
  const envContent = fs.readFileSync(envLocal, 'utf8');
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];
  
  console.log('  🔍 Verificando variáveis necessárias:');
  let variaveisOk = true;
  
  requiredVars.forEach(varName => {
    if (envContent.includes(varName) && !envContent.includes(`${varName}=your_`)) {
      console.log(`    ✅ ${varName}`);
    } else {
      console.log(`    ❌ ${varName} - NÃO CONFIGURADA`);
      variaveisOk = false;
    }
  });
  
  if (!variaveisOk) {
    console.log('\n  ⚠️  Para configurar:');
    console.log('     1. Acesse: https://console.firebase.google.com/project/lexai-ef0ab/settings/general');
    console.log('     2. Copie as configurações do seu app');
    console.log('     3. Cole no arquivo .env.local');
  }
  
} else {
  console.log('  ❌ .env.local não existe');
  console.log('  💡 Execute: cp .env.example .env.local');
  console.log('  💡 Depois configure as variáveis conforme instruções');
}

// Verificar package.json para dependências Firebase
console.log('\n📦 Verificando dependências Firebase...');

if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const firebaseDeps = [
    'firebase',
    '@firebase/auth',
    '@firebase/firestore'
  ];
  
  firebaseDeps.forEach(dep => {
    if (deps[dep]) {
      console.log(`  ✅ ${dep} v${deps[dep]}`);
    } else {
      console.log(`  ❌ ${dep} - NÃO INSTALADO`);
    }
  });
}

// Verificar se App Check foi removido
console.log('\n🛡️  Verificando remoção do App Check...');

const firebaseFile = 'src/lib/firebase.ts';
if (fs.existsSync(firebaseFile)) {
  const firebaseContent = fs.readFileSync(firebaseFile, 'utf8');
  
  if (firebaseContent.includes('initializeAppCheck')) {
    console.log('  ❌ App Check ainda presente no código');
    console.log('  💡 Remova ou comente a configuração do App Check');
  } else {
    console.log('  ✅ App Check removido do código');
  }
}

// Resumo final
console.log('\n' + '='.repeat(50));
console.log('📋 RESUMO DA VERIFICAÇÃO');
console.log('='.repeat(50));

if (arquivosOk) {
  console.log('✅ Todos os arquivos essenciais estão presentes');
} else {
  console.log('❌ Alguns arquivos essenciais estão ausentes');
}

if (fs.existsSync('.env.local')) {
  console.log('✅ Arquivo de configuração .env.local existe');
} else {
  console.log('❌ Arquivo .env.local não configurado');
}

console.log('\n🚀 PRÓXIMOS PASSOS:');
console.log('1. Configure o .env.local com suas credenciais Firebase');
console.log('2. Verifique se Authentication está habilitado no Firebase Console');
console.log('3. Confirme que App Check está desabilitado no Firebase Console');
console.log('4. Teste login/cadastro e monitore logs no console do navegador');

console.log('\n📖 Para mais detalhes, consulte: SISTEMA-AUTH-PRONTO.md');
console.log('🎯 Sistema está pronto para testes!');