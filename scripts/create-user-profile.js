const admin = require('firebase-admin');

// Inicializar Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://lexai-ef0ab-default-rtdb.firebaseio.com/'
});

const db = admin.firestore();

/**
 * Criar perfil padrão para usuário existente
 */
async function createUserProfile(uid, email) {
  try {
    const userRef = db.collection('usuarios').doc(uid);
    
    // Verificar se já existe
    const doc = await userRef.get();
    if (doc.exists) {
      console.log(`✅ Usuário ${uid} já possui perfil`);
      return;
    }
    
    // Criar perfil padrão
    const defaultProfile = {
      cargo: '',
      areas_atuacao: [],
      nivel_experiencia: 'iniciante',
      preferencias: {
        tema: 'light',
        notificacoes: true
      },
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
      workspaces: []
    };
    
    await userRef.set(defaultProfile);
    console.log(`✅ Perfil criado para usuário ${uid} (${email})`);
    
  } catch (error) {
    console.error(`❌ Erro ao criar perfil para ${uid}:`, error);
  }
}

/**
 * Criar perfis para todos os usuários existentes
 */
async function createProfilesForExistingUsers() {
  try {
    // Listar todos os usuários do Firebase Auth
    const listUsersResult = await admin.auth().listUsers();
    
    console.log(`📋 Encontrados ${listUsersResult.users.length} usuários`);
    
    for (const user of listUsersResult.users) {
      await createUserProfile(user.uid, user.email);
    }
    
    console.log('✅ Processo concluído');
    
  } catch (error) {
    console.error('❌ Erro no processo:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  createProfilesForExistingUsers()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { createUserProfile, createProfilesForExistingUsers };