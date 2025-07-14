// Script para limpar todos os usuários do Firebase Auth
const admin = require('firebase-admin');

// Inicializar Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://lexai-ef0ab-default-rtdb.firebaseio.com'
});

async function deleteAllUsers() {
  try {
    console.log('🧹 Iniciando limpeza de usuários...');
    
    // Listar todos os usuários
    const listUsers = await admin.auth().listUsers();
    console.log(`📊 Encontrados ${listUsers.users.length} usuários`);
    
    if (listUsers.users.length === 0) {
      console.log('✅ Nenhum usuário para deletar');
      return;
    }
    
    // Deletar todos os usuários
    const deletePromises = listUsers.users.map(user => {
      console.log(`🗑️ Deletando usuário: ${user.email || user.uid}`);
      return admin.auth().deleteUser(user.uid);
    });
    
    await Promise.all(deletePromises);
    console.log('✅ Todos os usuários deletados com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao deletar usuários:', error);
  }
}

// Executar limpeza
deleteAllUsers()
  .then(() => {
    console.log('🎉 Limpeza concluída!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Erro na limpeza:', error);
    process.exit(1);
  });