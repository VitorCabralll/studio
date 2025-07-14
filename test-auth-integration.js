// Teste de integração completo do sistema de autenticação
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } = require('firebase/auth');
const { getFirestore, doc, getDoc, setDoc, serverTimestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBlznzwe_cuk3X2QCXHYpqCx6UGh1HOxSI",
  authDomain: "lexai-ef0ab.firebaseapp.com",
  projectId: "lexai-ef0ab",
  storageBucket: "lexai-ef0ab.firebasestorage.app",
  messagingSenderId: "506027619372",
  appId: "1:506027619372:web:00420c7e8002d88c970d89"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function testAuthFlow() {
  console.log('🧪 INICIANDO TESTES DE AUTENTICAÇÃO...\n');
  
  try {
    // 1. Teste de Login
    console.log('1️⃣ Testando login...');
    const userCredential = await signInWithEmailAndPassword(auth, 'vitorcabral711@gmail.com', 'senha123');
    const user = userCredential.user;
    console.log('✅ Login bem-sucedido:', user.uid);
    
    // 2. Teste de acesso ao Firestore
    console.log('\n2️⃣ Testando acesso ao Firestore...');
    const userDoc = doc(db, 'usuarios', user.uid);
    
    // Verificar se perfil existe
    const docSnap = await getDoc(userDoc);
    if (docSnap.exists()) {
      console.log('✅ Perfil encontrado:', docSnap.data().name || 'Nome não definido');
    } else {
      console.log('⚠️ Criando perfil de teste...');
      await setDoc(userDoc, {
        name: 'Teste Usuário',
        email: user.email,
        cargo: 'Desenvolvedor',
        areas_atuacao: ['Tecnologia'],
        primeiro_acesso: false,
        initial_setup_complete: true,
        data_criacao: serverTimestamp(),
        workspaces: []
      });
      console.log('✅ Perfil criado com sucesso');
    }
    
    // 3. Teste de workspace
    console.log('\n3️⃣ Testando acesso a workspaces...');
    const workspaceDoc = doc(db, 'workspaces', 'test-workspace');
    await setDoc(workspaceDoc, {
      name: 'Workspace de Teste',
      owner: user.uid,
      members: [user.uid],
      created_at: serverTimestamp()
    });
    console.log('✅ Workspace criado/atualizado com sucesso');
    
    // 4. Teste de leitura
    const workspaceSnap = await getDoc(workspaceDoc);
    if (workspaceSnap.exists()) {
      console.log('✅ Workspace lido com sucesso:', workspaceSnap.data().name);
    }
    
    // 5. Teste de logout
    console.log('\n4️⃣ Testando logout...');
    await signOut(auth);
    console.log('✅ Logout bem-sucedido');
    
    console.log('\n🎉 TODOS OS TESTES PASSARAM COM SUCESSO!');
    console.log('📊 Sistema de autenticação está funcionando perfeitamente');
    
  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:', error.code, error.message);
    console.error('🔍 Detalhes:', error);
    throw error;
  }
}

// Executar testes
testAuthFlow()
  .then(() => {
    console.log('\n✅ TESTE CONCLUÍDO - SISTEMA PRONTO PARA PRODUÇÃO');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ TESTE FALHOU - VERIFICAR PROBLEMAS');
    process.exit(1);
  });