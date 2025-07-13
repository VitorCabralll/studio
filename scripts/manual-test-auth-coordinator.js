/**
 * SCRIPT DE TESTE MANUAL PARA AuthCoordinator.testFirestoreAccess
 *
 * Como usar:
 * 1. Abra o terminal na raiz do projeto.
 * 2. Execute o comando: node scripts/manual-test-auth-coordinator.js
 * 3. Analise o output no console.
 */

// Mock das dependências do Firebase para isolar a função
const mockFirebase = {
  getDoc: async () => { throw new Error('getDoc not mocked'); },
};

// --- Lógica a ser testada (copiada de auth-coordinator.ts e adaptada para JS) ---

// Simula a função addNamespace para simplicidade
const addNamespace = (collection) => `dev_${collection}`;

// Define o ambiente como 'development' para o teste
process.env.NODE_ENV = 'development';

async function testFirestoreAccess(uid) {
  const MAX_RETRIES = 3;
  const INITIAL_BACKOFF = 10; // Usar um backoff menor para testes rápidos

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const collection = process.env.NODE_ENV === 'production' ? 'usuarios' : addNamespace('usuarios');
      
      console.log(`[Attempt ${attempt}/${MAX_RETRIES}] 🔍 Testing Firestore access for UID: ${uid}`);
      
      // A chamada real ao Firestore é substituída pelo nosso mock
      await mockFirebase.getDoc();
      
      console.log(`✅ Access confirmed on attempt ${attempt}.`);
      return true;

    } catch (error) {
      if (error.code === 'permission-denied') {
        console.warn(`[Attempt ${attempt}/${MAX_RETRIES}] ⚠️ Permission denied.`);
        
        if (attempt === MAX_RETRIES) {
          console.error('❌ Max retries reached. Access failed.');
          return false;
        }

        const backoffDelay = INITIAL_BACKOFF * Math.pow(2, attempt - 1);
        console.log(`⏳ Waiting ${backoffDelay}ms before next retry...`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));

      } else {
        console.log(`✅ Access ok (non-permission error): ${error.code}`);
        return true;
      }
    }
  }
  return false;
}

// --- Suíte de Testes Manuais ---

async function runTests() {
  console.log('\n--- INICIANDO SUÍTE DE TESTES PARA testFirestoreAccess ---\n');

  let failures = 0;

  // Teste 1: Sucesso na primeira tentativa
  console.log('\n--- [Cenário 1: Sucesso Imediato] ---');
  mockFirebase.getDoc = async () => Promise.resolve({ exists: () => true });
  let result = await testFirestoreAccess('user-success-1');
  if (result) {
    console.log('✅ PASSOU\n');
  } else {
    console.error('❌ FALHOU\n');
    failures++;
  }

  // Teste 2: Sucesso na segunda tentativa
  console.log('\n--- [Cenário 2: Sucesso com 1 Retentativa] ---');
  let attemptCounter = 0;
  mockFirebase.getDoc = async () => {
    attemptCounter++;
    if (attemptCounter < 2) {
      const error = new Error('Permission denied');
      error.code = 'permission-denied';
      throw error;
    }
    return Promise.resolve({ exists: () => true });
  };
  result = await testFirestoreAccess('user-success-2');
  if (result) {
    console.log('✅ PASSOU\n');
  } else {
    console.error('❌ FALHOU\n');
    failures++;
  }

  // Teste 3: Falha em todas as tentativas
  console.log('\n--- [Cenário 3: Falha Total] ---');
  mockFirebase.getDoc = async () => {
    const error = new Error('Permission denied');
    error.code = 'permission-denied';
    throw error;
  };
  result = await testFirestoreAccess('user-fail');
  if (!result) {
    console.log('✅ PASSOU (falhou como esperado)\n');
  } else {
    console.error('❌ FALHOU (deveria ter falhado)\n');
    failures++;
  }

  // Teste 4: Erro não relacionado à permissão
  console.log('\n--- [Cenário 4: Erro Não-Permissão] ---');
  mockFirebase.getDoc = async () => {
    const error = new Error('Service unavailable');
    error.code = 'unavailable';
    throw error;
  };
  result = await testFirestoreAccess('user-other-error');
  if (result) {
    console.log('✅ PASSOU (tratou erro corretamente)\n');
  } else {
    console.error('❌ FALHOU (deveria ter retornado true)\n');
    failures++;
  }

  // --- Relatório Final ---
  console.log('\n--- RESULTADO FINAL ---');
  if (failures === 0) {
    console.log(`✅ Todos os ${4} testes passaram com sucesso!`);
  } else {
    console.error(`❌ ${failures} de ${4} testes falharam.`);
  }
  console.log('-----------------------\n');
}

runTests();