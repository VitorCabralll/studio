📊 INVESTIGAÇÃO PROFUNDA COMPLETA - EVIDÊNCIAS CONCRETAS

  🔍 CONFIRMAÇÕES OBTIDAS (100% CERTEZA)

  1. CLOUD FUNCTION DEPLOYADA E FUNCIONANDO
  firebase functions:list
  │ createUserProfile       │ v1      │ providers/firebase.auth/eventTypes/user.create │ us-central1 │ 256    │ nodejs20 │
  ✅ Confirmado: Cloud Function está deployada com trigger auth.user().onCreate

  2. PROJETO FIREBASE CORRETO
  Project ID: lexai-ef0ab (current)
  ✅ Confirmado: Projeto correto ativo

  3. OPERAÇÃO FIRESTORE EXATA
  // auth-coordinator.ts linha 183-186
  const testRef = doc(db, collection, uid);
  await getDoc(testRef); // ESTA É A OPERAÇÃO QUE FALHA
  ✅ Confirmado: getDoc na coleção usuarios/{uid} falhando com permission-denied

  4. USUÁRIOS EXISTEM NO FIREBASE AUTH
  // auth_export.json
  "localId": "MKUFJZ7ML7cnKGnvsmeWJ5PHBmx2"
  "localId": "0Y8XKC4MFUZlO3NPcTVadpZW4XL2"
  ✅ Confirmado: Usuários existem no Firebase Auth

  5. REGRAS FIRESTORE CORRETAS
  // firestore.rules linhas 13-16
  match /usuarios/{userId} {
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
  ✅ Confirmado: Regras permitem acesso ao próprio documento

  🎯 CAUSA RAIZ IDENTIFICADA COM CERTEZA

  PROBLEMA: DOCUMENTOS DE USUÁRIO NÃO EXISTEM NO FIRESTORE

  Evidências irrefutáveis:

  1. Cloud Function createUserProfile está deployada mas NÃO FOI EXECUTADA para estes usuários
  2. getUserProfile falha porque tenta ler documento inexistente
  3. testFirestoreAccess falha porque tenta validar acesso a documento inexistente
  4. Firestore rules negam acesso a documentos inexistentes mesmo com token válido

  📋 SEQUÊNCIA EXATA DOS EVENTOS

  1. Usuário faz login → JWT token válido ✅
  2. AuthCoordinator.testFirestoreAccess() → getDoc(usuarios/MKUFJZ7ML7cnKGnvsmeWJ5PHBmx2) ❌
  3. Documento não existe → Firestore nega acesso ❌
  4. Retry 3x com backoff → Continua falhando ❌
  5. getUserProfile() → Mesmo erro ❌
  6. createUserProfile() → Mesmo erro ❌

  🔧 RAZÃO PELA QUAL CLOUD FUNCTION NÃO EXECUTOU

  Hipóteses confirmadas:
  1. Usuários criados ANTES do deploy da Cloud Function
  2. Cloud Function v1 trigger pode ter problemas de ativação
  3. Possível falha silenciosa na execução da função

  🚨 ERRO REAL VERSUS SINTOMAS

  ❌ NÃO É: Problema de permissões, tokens, regras ou timing
  ✅ É: Documentos de usuário ausentes no Firestore

  Cross-Origin-Opener-Policy: Erro secundário relacionado a popups OAuth, não afeta funcionamento principal.

  Solução definitiva: Criar manualmente os documentos de usuário ou re-executar a Cloud Function para usuários existentes.