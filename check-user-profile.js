// Verificar se perfil do usuário foi criado no Firestore
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBlznzwe_cuk3X2QCXHYpqCx6UGh1HOxSI",
  authDomain: "lexai-ef0ab.firebaseapp.com",
  projectId: "lexai-ef0ab",
  storageBucket: "lexai-ef0ab.firebasestorage.app",
  messagingSenderId: "506027619372",
  appId: "1:506027619372:web:00420c7e8002d88c970d89"
};

async function checkUserProfile() {
  try {
    console.log('🔍 VERIFICANDO PERFIL DO USUÁRIO...\n');
    
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    
    const userId = 'GO5ws1xUjUdPgDFxsrJO3zVFgav1';
    
    console.log('📋 Verificando perfil para:', userId);
    
    // Verificar se documento existe
    const userDoc = doc(db, 'usuarios', userId);
    const docSnap = await getDoc(userDoc);
    
    if (docSnap.exists()) {
      console.log('✅ PERFIL ENCONTRADO!');
      console.log('📄 Dados do perfil:');
      console.log(JSON.stringify(docSnap.data(), null, 2));
    } else {
      console.log('❌ PERFIL NÃO ENCONTRADO');
      console.log('🔍 Documento não existe em: /usuarios/' + userId);
    }
    
    // Verificar se consegue fazer login
    console.log('\n🔐 Testando login...');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, '1@gmail.com', 'senha123');
      const user = userCredential.user;
      console.log('✅ LOGIN FUNCIONOU!');
      console.log('👤 UID:', user.uid);
      console.log('📧 Email:', user.email);
      console.log('🔗 Email verificado:', user.emailVerified);
    } catch (loginError) {
      console.log('❌ LOGIN FALHOU:', loginError.code, loginError.message);
    }
    
  } catch (error) {
    console.error('💥 ERRO:', error);
  }
}

checkUserProfile()
  .then(() => {
    console.log('\n🎉 VERIFICAÇÃO CONCLUÍDA');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ VERIFICAÇÃO FALHOU:', error);
    process.exit(1);
  });