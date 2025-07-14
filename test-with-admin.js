// Teste com Firebase Admin (ignora regras de segurança)
const admin = require('firebase-admin');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBlznzwe_cuk3X2QCXHYpqCx6UGh1HOxSI",
  authDomain: "lexai-ef0ab.firebaseapp.com",
  projectId: "lexai-ef0ab",
  storageBucket: "lexai-ef0ab.firebasestorage.app",
  messagingSenderId: "506027619372",
  appId: "1:506027619372:web:00420c7e8002d88c970d89"
};

async function testWithAdmin() {
  try {
    console.log('🔧 TESTANDO COM FIREBASE ADMIN...\n');
    
    // Inicializar Admin (ignora regras)
    try {
      admin.initializeApp({
        projectId: 'lexai-ef0ab'
      });
      console.log('✅ Admin inicializado');
    } catch (error) {
      console.log('⚠️ Admin já estava inicializado');
    }
    
    const adminDb = admin.firestore();
    
    // Teste 1: Escrever via Admin
    console.log('\n1️⃣ Testando escrita via Admin...');
    const adminDoc = adminDb.collection('test').doc('admin-test');
    await adminDoc.set({
      message: 'Teste via Admin SDK',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      bypassed: 'security rules'
    });
    console.log('✅ Escrita via Admin funcionou!');
    
    // Teste 2: Ler via Admin
    console.log('\n2️⃣ Testando leitura via Admin...');
    const adminDocSnap = await adminDoc.get();
    if (adminDocSnap.exists) {
      console.log('✅ Leitura via Admin funcionou!');
      console.log('📄 Dados:', adminDocSnap.data());
    }
    
    // Teste 3: Verificar perfil do usuário via Admin
    console.log('\n3️⃣ Verificando perfil do usuário via Admin...');
    const userId = 'GO5ws1xUjUdPgDFxsrJO3zVFgav1';
    const userDoc = adminDb.collection('usuarios').doc(userId);
    const userDocSnap = await userDoc.get();
    
    if (userDocSnap.exists) {
      console.log('✅ Perfil encontrado via Admin!');
      console.log('📄 Dados:', userDocSnap.data());
    } else {
      console.log('❌ Perfil não encontrado via Admin');
      
      // Criar perfil via Admin
      console.log('🔧 Criando perfil via Admin...');
      await userDoc.set({
        name: 'Usuário Teste',
        email: '1@gmail.com',
        cargo: 'Desenvolvedor',
        areas_atuacao: ['Tecnologia'],
        primeiro_acesso: false,
        initial_setup_complete: true,
        data_criacao: admin.firestore.FieldValue.serverTimestamp(),
        workspaces: []
      });
      console.log('✅ Perfil criado via Admin!');
    }
    
    // Teste 4: Tentar ler via cliente (deve falhar se regras não funcionam)
    console.log('\n4️⃣ Testando leitura via cliente...');
    const clientApp = initializeApp(firebaseConfig);
    const clientDb = getFirestore(clientApp);
    
    try {
      const clientDoc = doc(clientDb, 'test', 'admin-test');
      const clientDocSnap = await getDoc(clientDoc);
      console.log('✅ Leitura via cliente funcionou! (regras estão abertas)');
    } catch (error) {
      console.log('❌ Leitura via cliente falhou:', error.code);
      console.log('🔍 Isso confirma que as regras não estão aplicadas');
    }
    
  } catch (error) {
    console.error('💥 ERRO:', error);
  }
}

testWithAdmin()
  .then(() => {
    console.log('\n🎉 TESTE ADMIN CONCLUÍDO');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ TESTE ADMIN FALHOU:', error);
    process.exit(1);
  });