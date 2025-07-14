// Teste simples de autenticação
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword, connectAuthEmulator } = require('firebase/auth');
const { getFirestore, doc, getDoc, setDoc, connectFirestoreEmulator } = require('firebase/firestore');

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

async function testAuth() {
  try {
    console.log('🔄 Testando autenticação...');
    
    // Usar usuário real
    const userCredential = await signInWithEmailAndPassword(auth, 'vitorcabral711@gmail.com', 'senha123');
    const user = userCredential.user;
    
    console.log('✅ Login bem-sucedido:', user.uid);
    
    // Testar acesso ao Firestore
    console.log('🔄 Testando acesso ao Firestore...');
    const userDoc = doc(db, 'usuarios', user.uid);
    
    // Tentar criar perfil
    await setDoc(userDoc, {
      name: 'Usuário Teste',
      email: user.email,
      cargo: 'Desenvolvedor',
      areas_atuacao: ['Tecnologia'],
      primeiro_acesso: false,
      initial_setup_complete: true,
      data_criacao: new Date(),
      workspaces: []
    });
    
    console.log('✅ Documento criado com sucesso');
    
    // Tentar ler perfil
    const docSnap = await getDoc(userDoc);
    if (docSnap.exists()) {
      console.log('✅ Documento lido com sucesso:', docSnap.data());
    } else {
      console.log('❌ Documento não encontrado');
    }
    
    console.log('🎉 Teste concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testAuth();