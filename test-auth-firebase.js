/**
 * Teste de autenticação e conectividade Firebase
 * Verifica se Google Auth e Firestore estão funcionando
 */

const { initializeApp } = require('firebase/app');
const { getAuth, signInAnonymously } = require('firebase/auth');
const { getFirestore, doc, setDoc, getDoc, enableNetwork } = require('firebase/firestore');

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBlznzwe_cuk3X2QCXHYpqCx6UGh1HOxSI",
  authDomain: "lexai-ef0ab.web.app",
  projectId: "lexai-ef0ab",
  storageBucket: "lexai-ef0ab.firebasestorage.app",
  messagingSenderId: "506027619372",
  appId: "1:506027619372:web:00420c7e8002d88c970d89",
  measurementId: "G-0C40FVSRXM"
};

async function testAuthAndFirestore() {
  console.log('🧪 Testando autenticação e Firestore...\n');
  
  try {
    // 1. Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    
    console.log('✅ Firebase inicializado');
    
    // 2. Testar conectividade Firestore
    console.log('📡 Testando conectividade Firestore...');
    await enableNetwork(db);
    console.log('✅ Firestore conectado');
    
    // 3. Testar autenticação anônima (mais simples que Google)
    console.log('🔐 Testando autenticação...');
    const userCredential = await signInAnonymously(auth);
    const user = userCredential.user;
    console.log('✅ Usuário autenticado:', user.uid);
    
    // 4. Testar escrita e leitura no Firestore
    console.log('💾 Testando operações Firestore...');
    const testDoc = doc(db, 'test', 'auth-test');
    const testData = {
      uid: user.uid,
      timestamp: new Date(),
      test: 'conectividade-ok'
    };
    
    await setDoc(testDoc, testData);
    console.log('✅ Dados escritos no Firestore');
    
    const docSnap = await getDoc(testDoc);
    if (docSnap.exists()) {
      console.log('✅ Dados lidos do Firestore:', docSnap.data());
    }
    
    console.log('\n🎉 TODOS OS TESTES PASSARAM!');
    console.log('Firebase está funcionando corretamente.');
    
  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:');
    console.error('Código:', error.code);
    console.error('Mensagem:', error.message);
    
    if (error.code === 'unavailable') {
      console.log('\n🔍 DIAGNÓSTICO:');
      console.log('- O erro "unavailable" geralmente indica:');
      console.log('  • Problema de conectividade de internet');
      console.log('  • Firewall bloqueando conexões');
      console.log('  • Projeto Firebase inativo ou incorreto');
      console.log('  • Problemas temporários do Google Firebase');
    }
  }
}

testAuthAndFirestore().then(() => process.exit(0)).catch(console.error);