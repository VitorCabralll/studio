// Debug script para testar conexão direta com Firestore
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc, connectFirestoreEmulator } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBlznzwe_cuk3X2QCXHYpqCx6UGh1HOxSI",
  authDomain: "lexai-ef0ab.firebaseapp.com",
  projectId: "lexai-ef0ab",
  storageBucket: "lexai-ef0ab.firebasestorage.app",
  messagingSenderId: "506027619372",
  appId: "1:506027619372:web:00420c7e8002d88c970d89"
};

async function debugFirestore() {
  try {
    console.log('🔍 DEBUGANDO FIRESTORE CONNECTION...\n');
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('📊 Configuração:');
    console.log('- Project ID:', app.options.projectId);
    console.log('- Auth Domain:', app.options.authDomain);
    console.log('- Database:', 'projects/lexai-ef0ab/databases/(default)');
    
    // Test 1: Tentar escrever sem autenticação
    console.log('\n1️⃣ Testando escrita SEM autenticação (deve funcionar com rules abertas)...');
    
    try {
      const testDoc = doc(db, 'test', 'debug-test');
      await setDoc(testDoc, {
        message: 'Teste de conexão direta',
        timestamp: new Date().toISOString(),
        rules: 'completely open'
      });
      console.log('✅ SUCESSO: Escrita funcionou SEM autenticação!');
      
      // Test 2: Tentar ler o documento
      console.log('\n2️⃣ Testando leitura...');
      const docSnap = await getDoc(testDoc);
      if (docSnap.exists()) {
        console.log('✅ SUCESSO: Leitura funcionou!');
        console.log('📄 Dados:', docSnap.data());
      } else {
        console.log('❌ ERRO: Documento não encontrado');
      }
      
    } catch (error) {
      console.error('❌ ERRO na operação Firestore:', error.code, error.message);
      console.error('🔍 Detalhes completos:', error);
    }
    
    // Test 3: Tentar acessar collection usuarios
    console.log('\n3️⃣ Testando acesso à collection usuarios...');
    
    try {
      const usuarioDoc = doc(db, 'usuarios', 'test-user');
      await setDoc(usuarioDoc, {
        name: 'Usuário de Teste',
        email: 'teste@teste.com',
        timestamp: new Date().toISOString()
      });
      console.log('✅ SUCESSO: Escrita em usuarios funcionou!');
      
      const usuarioSnap = await getDoc(usuarioDoc);
      if (usuarioSnap.exists()) {
        console.log('✅ SUCESSO: Leitura de usuarios funcionou!');
        console.log('📄 Dados:', usuarioSnap.data());
      }
      
    } catch (error) {
      console.error('❌ ERRO na collection usuarios:', error.code, error.message);
      console.error('🔍 Detalhes completos:', error);
    }
    
    console.log('\n🎉 DEBUG CONCLUÍDO!');
    
  } catch (error) {
    console.error('💥 ERRO FATAL:', error);
  }
}

debugFirestore()
  .then(() => {
    console.log('\n✅ DEBUG FINALIZADO');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ DEBUG FALHOU:', error);
    process.exit(1);
  });