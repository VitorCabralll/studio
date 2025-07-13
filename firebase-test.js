// Teste isolado Firebase
console.log('🔥 Testando configuração Firebase...');

// Simular ambiente Next.js
process.env.NODE_ENV = 'development';

try {
  // Carregar variáveis manualmente
  const fs = require('fs');
  const envContent = fs.readFileSync('.env.local', 'utf8');
  envContent.split('\n').forEach(line => {
    if (line && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim().replace(/"/g, '');
      }
    }
  });
  
  console.log('📋 Variáveis carregadas:');
  console.log('- FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅' : '❌');
  console.log('- FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅' : '❌');
  console.log('- FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? '✅' : '❌');
  
  // Testar Firebase config
  const { getFirebaseConfig } = require('./src/lib/firebase-config-simple.js');
  const config = getFirebaseConfig();
  
  console.log('✅ Firebase config OK:', !!config.projectId);
  
  // Testar inicialização básica
  const { initializeApp } = require('firebase/app');
  const app = initializeApp(config);
  
  console.log('✅ Firebase app inicializado:', !!app);
  
} catch (error) {
  console.log('❌ Erro Firebase:', error.message);
  console.log('📋 Stack:', error.stack.split('\n').slice(0, 5).join('\n'));
}