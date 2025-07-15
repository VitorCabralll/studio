#!/usr/bin/env node

/**
 * Teste de Configuração - Verificar se as chaves estão carregadas
 */

console.log('🔍 VERIFICAÇÃO DE CONFIGURAÇÃO - SISTEMA APP CHECK\n');

// Ler arquivo .env.local diretamente
const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf8');
const envLines = envContent.split('\n');
envLines.forEach(line => {
  if (line.includes('=') && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=');
    process.env[key.trim()] = value.trim();
  }
});

console.log('📋 STATUS DAS VARIÁVEIS DE AMBIENTE:\n');

// reCAPTCHA
const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
console.log(`✅ reCAPTCHA Site Key: ${recaptchaKey ? 'CONFIGURADA' : '❌ AUSENTE'}`);
if (recaptchaKey) {
  console.log(`   🔑 Valor: ${recaptchaKey.slice(0, 20)}...`);
}

// App Check Debug Token
const debugToken = process.env.NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN;
console.log(`✅ App Check Debug Token: ${debugToken ? 'CONFIGURADO' : '❌ AUSENTE'}`);
if (debugToken) {
  console.log(`   🔑 Valor: ${debugToken.slice(0, 20)}...`);
}

// Firebase Config
const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
console.log(`✅ Firebase API Key: ${firebaseApiKey ? 'CONFIGURADA' : '❌ AUSENTE'}`);

const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
console.log(`✅ Firebase Project ID: ${firebaseProjectId ? firebaseProjectId : '❌ AUSENTE'}`);

// Gemini API
const geminiKey = process.env.GOOGLE_AI_API_KEY;
console.log(`✅ Gemini API Key: ${geminiKey ? 'CONFIGURADA' : '❌ AUSENTE'}`);

console.log('\n' + '='.repeat(70));
console.log('🎯 RESULTADO DA VERIFICAÇÃO');
console.log('='.repeat(70));

const allConfigured = recaptchaKey && debugToken && firebaseApiKey && firebaseProjectId;

if (allConfigured) {
  console.log('\n✅ TODAS AS CONFIGURAÇÕES NECESSÁRIAS ESTÃO PRESENTES!');
  console.log('\n🚀 PRÓXIMOS PASSOS:');
  console.log('1. npm run dev (já está rodando)');
  console.log('2. Acesse http://localhost:3000');
  console.log('3. Teste login/signup');
  console.log('4. Verifique console do browser para logs App Check');
  console.log('\n📊 EXPECTATIVA:');
  console.log('• Console deve mostrar: "App Check: Token obtained successfully"');
  console.log('• Login/signup deve funcionar sem erros 400');
  console.log('• Identity Toolkit API error rate: 26% → 0%');
} else {
  console.log('\n❌ ALGUMAS CONFIGURAÇÕES ESTÃO AUSENTES!');
  console.log('\nCONFIGURAÇÕES FALTANDO:');
  if (!recaptchaKey) console.log('• reCAPTCHA Site Key');
  if (!debugToken) console.log('• App Check Debug Token');
  if (!firebaseApiKey) console.log('• Firebase API Key');
  if (!firebaseProjectId) console.log('• Firebase Project ID');
}

console.log('\n📞 LINKS PARA VERIFICAÇÃO:');
console.log('• App Check Console: https://console.firebase.google.com/project/lexai-ef0ab/appcheck');
console.log('• reCAPTCHA Console: https://www.google.com/recaptcha/admin');
console.log('• Firebase Console: https://console.firebase.google.com/project/lexai-ef0ab');

console.log('\n✨ Configuração verificada!');