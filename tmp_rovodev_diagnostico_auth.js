#!/usr/bin/env node

/**
 * Diagnóstico Completo do Problema de Autenticação
 * Analisa logs, configurações e identifica a causa raiz
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO COMPLETO - PROBLEMA DE AUTENTICAÇÃO\n');

// 1. Analisar o log de erros
function analisarLog() {
  console.log('📋 ANÁLISE DO LOG DE ERROS:');
  
  try {
    const logContent = fs.readFileSync('log.md', 'utf8');
    
    // Extrair erros principais
    const errosAppCheck = logContent.match(/AppCheck.*error/gi) || [];
    const erros401 = logContent.match(/401.*Unauthorized/gi) || [];
    const errosRecaptcha = logContent.match(/recaptcha.*error/gi) || [];
    const errosToken = logContent.match(/firebase-app-check-token-is-invalid/gi) || [];
    
    console.log(`   🔴 Erros App Check: ${errosAppCheck.length}`);
    console.log(`   🔴 Erros 401 Unauthorized: ${erros401.length}`);
    console.log(`   🔴 Erros reCAPTCHA: ${errosRecaptcha.length}`);
    console.log(`   🔴 Erros Token Inválido: ${errosToken.length}`);
    
    // Identificar padrão principal
    if (errosRecaptcha.length > 0 && errosToken.length > 0) {
      console.log('   ⚠️  PROBLEMA IDENTIFICADO: App Check com reCAPTCHA falhando');
      return 'app-check-recaptcha';
    } else if (erros401.length > 0) {
      console.log('   ⚠️  PROBLEMA IDENTIFICADO: Autenticação 401');
      return 'auth-401';
    }
    
  } catch (error) {
    console.log('   ❌ Erro ao ler log:', error.message);
  }
  
  return 'unknown';
}

// 2. Verificar configuração do ambiente
function verificarConfiguracao() {
  console.log('\n🔧 VERIFICAÇÃO DE CONFIGURAÇÃO:');
  
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    
    // Verificar variáveis críticas
    const temRecaptcha = envContent.includes('NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Ld79nMrAAAAAE');
    const temDebugToken = envContent.includes('NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN=');
    const ambienteAtual = envContent.match(/NEXT_PUBLIC_APP_ENV=(\w+)/)?.[1];
    
    console.log(`   🌍 Ambiente: ${ambienteAtual}`);
    console.log(`   🔑 reCAPTCHA configurado: ${temRecaptcha ? '✅' : '❌'}`);
    console.log(`   🐛 Debug Token configurado: ${temDebugToken ? '✅' : '❌'}`);
    
    return {
      ambiente: ambienteAtual,
      recaptcha: temRecaptcha,
      debugToken: temDebugToken
    };
    
  } catch (error) {
    console.log('   ❌ Erro ao ler .env.local:', error.message);
    return null;
  }
}

// 3. Verificar código App Check
function verificarAppCheck() {
  console.log('\n🛡️ VERIFICAÇÃO APP CHECK:');
  
  try {
    const appCheckContent = fs.readFileSync('src/lib/app-check.ts', 'utf8');
    
    const temEmergencyDisable = appCheckContent.includes('EMERGENCY_DISABLE_APP_CHECK');
    const temRecaptchaProvider = appCheckContent.includes('ReCaptchaV3Provider');
    const temGracefulDegradation = appCheckContent.includes('graceful degradation');
    
    console.log(`   🚨 Emergency disable: ${temEmergencyDisable ? '✅' : '❌'}`);
    console.log(`   🔐 reCAPTCHA Provider: ${temRecaptchaProvider ? '✅' : '❌'}`);
    console.log(`   🔄 Graceful degradation: ${temGracefulDegradation ? '✅' : '❌'}`);
    
    return {
      emergencyDisable: temEmergencyDisable,
      recaptchaProvider: temRecaptchaProvider,
      gracefulDegradation: temGracefulDegradation
    };
    
  } catch (error) {
    console.log('   ❌ Erro ao ler app-check.ts:', error.message);
    return null;
  }
}

// 4. Executar diagnóstico completo
async function executarDiagnostico() {
  const tipoErro = analisarLog();
  const config = verificarConfiguracao();
  const appCheck = verificarAppCheck();
  
  console.log('\n🎯 DIAGNÓSTICO FINAL:');
  console.log('=' .repeat(50));
  
  if (tipoErro === 'app-check-recaptcha') {
    console.log('🔴 PROBLEMA: App Check com reCAPTCHA falhando');
    console.log('\n📋 CAUSA RAIZ:');
    
    if (config?.ambiente === 'development') {
      console.log('   • Ambiente de desenvolvimento com App Check ativo');
      console.log('   • reCAPTCHA não funciona corretamente em localhost');
      console.log('   • Debug token pode estar inválido ou mal configurado');
    }
    
    console.log('\n💡 SOLUÇÕES RECOMENDADAS (em ordem de prioridade):');
    console.log('\n1. 🚨 SOLUÇÃO IMEDIATA - Desabilitar App Check temporariamente:');
    console.log('   export EMERGENCY_DISABLE_APP_CHECK=true');
    console.log('   npm run dev');
    
    console.log('\n2. 🔧 SOLUÇÃO PERMANENTE - Configurar corretamente:');
    console.log('   • Verificar reCAPTCHA no console Google');
    console.log('   • Configurar domínios corretos (localhost, *.firebaseapp.com)');
    console.log('   • Usar debug token para desenvolvimento');
    
    console.log('\n3. 🛡️ SOLUÇÃO ALTERNATIVA - Desabilitar no Firebase Console:');
    console.log('   • https://console.firebase.google.com/project/lexai-ef0ab/appcheck');
    console.log('   • Remover todas as configurações de App Check');
    
  } else {
    console.log('🟡 PROBLEMA: Não foi possível identificar a causa exata');
    console.log('   Recomenda-se investigação manual adicional');
  }
}

// Executar diagnóstico
executarDiagnostico().catch(console.error);