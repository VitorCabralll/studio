#!/usr/bin/env node

/**
 * Script de diagnóstico para Firebase Auth
 * Identifica qual configuração está sendo usada e possíveis problemas
 */

console.log('🔍 DEBUG: Firebase Auth Configuration\n');

// Simular ambiente App Hosting
if (process.argv.includes('--app-hosting')) {
  process.env.FIREBASE_WEBAPP_CONFIG = JSON.stringify({
    "apiKey": "AIzaSyBlznzwe_cuk3X2QCXHYpqCx6UGh1HOxSI",
    "appId": "1:506027619372:web:00420c7e8002d88c970d89", 
    "authDomain": "lexai-ef0ab.firebaseapp.com",
    "databaseURL": "",
    "messagingSenderId": "506027619372",
    "projectId": "lexai-ef0ab",
    "storageBucket": "lexai-ef0ab.firebasestorage.app"
  });
  console.log('🚀 Simulando ambiente Firebase App Hosting');
}

// Carregar configuração
const { getFirebaseConfig } = require('./src/lib/firebase-config-simple.js');

try {
  const config = getFirebaseConfig();
  
  console.log('📄 Configuração Firebase detectada:');
  console.log('  apiKey:', config.apiKey ? `${config.apiKey.slice(0, 10)}...` : '❌ MISSING');
  console.log('  authDomain:', config.authDomain || '❌ MISSING');
  console.log('  projectId:', config.projectId || '❌ MISSING');
  console.log('  storageBucket:', config.storageBucket || '❌ MISSING');
  console.log('  messagingSenderId:', config.messagingSenderId || '❌ MISSING');
  console.log('  appId:', config.appId || '❌ MISSING');
  
  console.log('\n🔍 Análise de domínios:');
  
  if (config.authDomain === 'lexai-ef0ab.firebaseapp.com') {
    console.log('✅ authDomain CORRETO: lexai-ef0ab.firebaseapp.com');
  } else if (config.authDomain === 'lexai-ef0ab.web.app') {
    console.log('❌ authDomain INCORRETO: lexai-ef0ab.web.app (deveria ser .firebaseapp.com)');
  } else {
    console.log('❌ authDomain DESCONHECIDO:', config.authDomain);
  }
  
  console.log('\n🌐 URLs de teste esperadas:');
  console.log('  Produção: https://lexai--lexai-ef0ab.us-central1.hosted.app');
  console.log('  Auth Handler: https://lexai-ef0ab.firebaseapp.com/__/auth/handler');
  
  console.log('\n📊 Diagnóstico:');
  
  if (process.env.FIREBASE_WEBAPP_CONFIG) {
    console.log('✅ FIREBASE_WEBAPP_CONFIG detectado (App Hosting)');
    try {
      const webapp = JSON.parse(process.env.FIREBASE_WEBAPP_CONFIG);
      console.log('  - authDomain injetado:', webapp.authDomain);
    } catch (e) {
      console.log('❌ FIREBASE_WEBAPP_CONFIG inválido');
    }
  } else {
    console.log('⚠️  FIREBASE_WEBAPP_CONFIG não detectado (ambiente local)');
  }
  
  const missing = [];
  if (!config.apiKey) missing.push('apiKey');
  if (!config.authDomain) missing.push('authDomain');
  if (!config.projectId) missing.push('projectId');
  if (!config.storageBucket) missing.push('storageBucket');
  if (!config.messagingSenderId) missing.push('messagingSenderId');
  if (!config.appId) missing.push('appId');
  
  if (missing.length > 0) {
    console.log('❌ Configurações ausentes:', missing.join(', '));
  } else {
    console.log('✅ Todas as configurações obrigatórias presentes');
  }
  
} catch (error) {
  console.error('❌ Erro ao carregar configuração:', error.message);
}

console.log('\n💡 Para testar:');
console.log('  Local: node debug-auth-config.js');
console.log('  App Hosting: node debug-auth-config.js --app-hosting');