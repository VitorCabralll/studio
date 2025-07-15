#!/usr/bin/env node

/**
 * Script de Configuração Completa - App Check
 * Automatiza a configuração do Firebase App Check para LexAI
 */

const fs = require('fs');
const path = require('path');

console.log('🛡️ CONFIGURAÇÃO COMPLETA DO APP CHECK\n');

// Configurações baseadas no ambiente
const environments = {
  development: {
    description: 'Ambiente de desenvolvimento local',
    appCheckProvider: 'Debug Token',
    recaptchaRequired: false,
    debugTokenRequired: true
  },
  staging: {
    description: 'Ambiente de teste/homologação',
    appCheckProvider: 'reCAPTCHA v3',
    recaptchaRequired: true,
    debugTokenRequired: true
  },
  production: {
    description: 'Ambiente de produção',
    appCheckProvider: 'reCAPTCHA v3',
    recaptchaRequired: true,
    debugTokenRequired: false
  }
};

console.log('📋 AMBIENTES SUPORTADOS:\n');
Object.entries(environments).forEach(([env, config]) => {
  console.log(`${env.toUpperCase()}:`);
  console.log(`  - ${config.description}`);
  console.log(`  - Provider: ${config.appCheckProvider}`);
  console.log(`  - reCAPTCHA: ${config.recaptchaRequired ? 'Obrigatório' : 'Opcional'}`);
  console.log(`  - Debug Token: ${config.debugTokenRequired ? 'Obrigatório' : 'Não usado'}\n`);
});

console.log('🔧 PASSOS PARA CONFIGURAÇÃO COMPLETA:\n');

console.log('PASSO 1: Configurar reCAPTCHA v3');
console.log('════════════════════════════════════');
console.log('1.1. Acesse: https://www.google.com/recaptcha/admin');
console.log('1.2. Clique em "+" para criar novo site');
console.log('1.3. Configure:');
console.log('     - Rótulo: "LexAI - Sistema Jurídico"');
console.log('     - Tipo: reCAPTCHA v3');
console.log('     - Domínios:');
console.log('       * localhost (para desenvolvimento)');
console.log('       * lexai-ef0ab.web.app (Firebase Hosting)');
console.log('       * seu-dominio-personalizado.com');
console.log('1.4. Anote a "Chave do site" gerada\n');

console.log('PASSO 2: Configurar App Check no Firebase');
console.log('═══════════════════════════════════════════');
console.log('2.1. Acesse: https://console.firebase.google.com/project/lexai-ef0ab/appcheck');
console.log('2.2. Na aba "Apps", clique em "Add app"');
console.log('2.3. Selecione a app web "LexAI"');
console.log('2.4. Configure reCAPTCHA v3:');
console.log('     - Cole a "Chave do site" do reCAPTCHA');
console.log('     - Clique em "Save"');
console.log('2.5. Para desenvolvimento, clique em "Add debug token"');
console.log('     - Anote o debug token gerado\n');

console.log('PASSO 3: Configurar Variáveis de Ambiente');
console.log('═══════════════════════════════════════════');

// Verificar arquivo .env.local atual
const envPath = '.env.local';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  console.log('3.1. Arquivo .env.local encontrado');
  
  // Verificar se já tem as variáveis do App Check
  const hasRecaptcha = envContent.includes('NEXT_PUBLIC_RECAPTCHA_SITE_KEY');
  const hasDebugToken = envContent.includes('NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN');
  
  if (hasRecaptcha && hasDebugToken) {
    console.log('     ✅ Variáveis App Check já configuradas');
  } else {
    console.log('     ⚠️ Variáveis App Check faltando');
    console.log('3.2. Adicione as seguintes linhas ao .env.local:');
    console.log('');
    if (!hasRecaptcha) {
      console.log('     NEXT_PUBLIC_RECAPTCHA_SITE_KEY=sua-chave-recaptcha-aqui');
    }
    if (!hasDebugToken) {
      console.log('     NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN=seu-debug-token-aqui');
    }
  }
} else {
  console.log('3.1. ❌ Arquivo .env.local não encontrado');
  console.log('3.2. Crie o arquivo .env.local com o conteúdo:');
  console.log('');
  console.log('     # App Check Configuration');
  console.log('     NEXT_PUBLIC_RECAPTCHA_SITE_KEY=sua-chave-recaptcha-aqui');
  console.log('     NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN=seu-debug-token-aqui');
}

console.log('\n');

console.log('PASSO 4: Ativar App Check para APIs');
console.log('═══════════════════════════════════════');
console.log('4.1. Na aba "APIs" do App Check:');
console.log('     - Firebase Authentication: Clique em "Enforce"');
console.log('     - Cloud Firestore: Clique em "Enforce"');
console.log('4.2. ⚠️ CUIDADO: Isso pode quebrar a aplicação se não configurado corretamente');
console.log('4.3. Recomendação: Comece com "Monitor" em vez de "Enforce"');
console.log('     - Monitor = coleta métricas sem bloquear');
console.log('     - Enforce = bloqueia requisições sem token válido\n');

console.log('PASSO 5: Testar Configuração');
console.log('═══════════════════════════════════');
console.log('5.1. Execute o servidor de desenvolvimento:');
console.log('     npm run dev');
console.log('5.2. Abra o console do navegador');
console.log('5.3. Procure por logs do App Check:');
console.log('     - "App Check: Successfully initialized"');
console.log('     - "App Check: Token obtained successfully"');
console.log('5.4. Teste login/cadastro normalmente');
console.log('5.5. Verifique se não há erros 400\n');

console.log('PASSO 6: Monitoramento e Produção');
console.log('═══════════════════════════════════════');
console.log('6.1. No App Check console, monitore:');
console.log('     - "Verified requests" (deve aumentar)');
console.log('     - "Unverified requests" (deve ser zero ou baixo)');
console.log('6.2. Para produção:');
console.log('     - Remova NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN');
console.log('     - Mantenha apenas NEXT_PUBLIC_RECAPTCHA_SITE_KEY');
console.log('     - Mude de "Monitor" para "Enforce"\n');

// Verificação de dependências
console.log('🔍 VERIFICAÇÃO DE DEPENDÊNCIAS:\n');

const packageJsonPath = 'package.json';
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const requiredDeps = {
    'firebase': 'v10+',
  };
  
  console.log('Firebase SDK:');
  Object.entries(requiredDeps).forEach(([dep, version]) => {
    if (deps[dep]) {
      console.log(`  ✅ ${dep}: ${deps[dep]} (${version} requerido)`);
    } else {
      console.log(`  ❌ ${dep}: Não instalado (${version} requerido)`);
      console.log(`     Execute: npm install ${dep}@latest`);
    }
  });
}

console.log('\n📚 LINKS ÚTEIS:\n');
console.log('🔗 Firebase App Check: https://firebase.google.com/docs/app-check');
console.log('🔗 reCAPTCHA Admin: https://www.google.com/recaptcha/admin');
console.log('🔗 Firebase Console: https://console.firebase.google.com/project/lexai-ef0ab');
console.log('🔗 App Check Console: https://console.firebase.google.com/project/lexai-ef0ab/appcheck');

console.log('\n🚨 AVISOS IMPORTANTES:\n');
console.log('⚠️ 1. Teste SEMPRE em desenvolvimento antes de ativar em produção');
console.log('⚠️ 2. Debug tokens são apenas para desenvolvimento - NUNCA em produção');
console.log('⚠️ 3. App Check pode bloquear usuários legítimos se mal configurado');
console.log('⚠️ 4. Mantenha backup das chaves reCAPTCHA');
console.log('⚠️ 5. Monitore métricas após ativação');

console.log('\n✅ CONFIGURAÇÃO MANUAL NECESSÁRIA:');
console.log('Este script fornece as instruções, mas você deve:');
console.log('1. Configurar reCAPTCHA manualmente no console Google');
console.log('2. Configurar App Check manualmente no console Firebase');
console.log('3. Adicionar as chaves no .env.local');
console.log('4. Testar a configuração');

console.log('\n🎯 Após seguir todos os passos, execute:');
console.log('   npm run dev');
console.log('   # Teste login/cadastro e verifique logs do console');
console.log('\nSe tudo estiver funcionando, o erro 400 deve estar resolvido! 🎉');