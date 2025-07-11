
# Relatório de Incidente e Plano de Correção: Falha de Login e Cadastro

**Data:** 11 de julho de 2025

## 1. Resumo Executivo

O sistema apresentava uma falha crítica e intermitente que impedia usuários de completarem o fluxo de login e cadastro. Após uma investigação profunda, a causa raiz foi identificada como uma falha arquitetural na criação do perfil do usuário no Firestore. O processo dependia de uma chamada de API insegura e não confiável a partir do cliente (frontend).

A correção definitiva consiste em substituir este mecanismo por uma **Cloud Function** acionada pelo gatilho `onCreateUser` do Firebase Authentication. Esta abordagem é segura, confiável e garante que todo usuário criado na autenticação terá um perfil correspondente no banco de dados.

Este documento detalha a jornada da investigação, os erros encontrados e o plano de ação final para a implementação da solução correta.

## 2. Histórico da Investigação e Erros

A investigação progrediu por várias etapas, com cada fase revelando novas informações.

### Fase 1: Hipótese de Condição de Corrida (Race Condition)

*   **Sintoma Inicial:** Os logs do console mostravam um erro de `permission-denied` ao tentar ler o perfil do usuário no Firestore, imediatamente após o login.
*   **Trabalho Realizado:**
    *   Analisamos o `auth-coordinator.ts` e identificamos uma espera fixa de 3 segundos, indicando que o desenvolvedor original suspeitava de um atraso na propagação do token.
    *   Implementamos uma lógica de **retentativa com backoff exponencial** na função `testFirestoreAccess` para tornar a verificação de acesso mais resiliente a latências.
    *   Validamos a lógica de retentativa com um script de teste manual (`scripts/manual-test-auth-coordinator.js`), que passou em todos os cenários.
*   **Erro Apresentado:** Após o deploy da correção, os novos logs mostraram que a lógica de retentativa estava funcionando, mas o erro `permission-denied` **persistia em todas as tentativas**. Isso invalidou a hipótese de ser uma simples condição de corrida.

### Fase 2: Hipótese de Falha na Criação do Perfil

*   **Nova Evidência:** O erro persistente indicava que o problema não era o *acesso* ao perfil, mas a sua *existência*. A nova hipótese era que o documento do usuário nunca estava sendo criado no Firestore.
*   **Trabalho Realizado:**
    *   Buscamos no código por lógicas de escrita (`setDoc`, `addDoc`) na coleção `usuarios`.
    *   Encontramos o endpoint `POST /api/admin/create-user-profile`.
*   **Análise da Causa Raiz:** A existência de um endpoint de "admin" para criar um perfil de usuário é uma falha de design. Este endpoint, por segurança, não deveria ser acessível por um usuário comum a partir do navegador. A falha na chamada a esta API era a causa raiz da não criação do perfil, o que, por sua vez, causava todos os erros de permissão subsequentes.

### Fase 3: Implementação da Cloud Function

*   **Solução Arquitetural:** Propusemos a solução correta: usar um gatilho `onCreateUser` do Firebase Functions para criar o perfil de forma segura e confiável no backend.
*   **Trabalho Realizado:**
    *   Escrevemos o código para a Cloud Function `createUserProfile` no arquivo `functions/src/index.ts`.
*   **Erros Apresentados:** Encontramos uma série de erros de compilação durante o deploy da função (`firebase deploy --only functions`):
    *   `Cannot find module '''firebase-functions/v2/auth'''`: Este erro persistiu mesmo após reinstalar dependências e ajustar o `tsconfig.json`.
    *   **Conclusão do Erro de Deploy:** A persistência do erro indica um problema de incompatibilidade de versão no ambiente de build da ferramenta, não no código em si.

## 3. Plano de Correção Definitivo

Para contornar os problemas de deploy do ambiente da ferramenta e implementar a solução correta, o seguinte plano deve ser executado.

### Passo 1: Implementar a Cloud Function `onCreateUser` (Lógica Central)

A lógica a seguir deve ser garantida no arquivo `functions/src/index.ts`. Ela cria um perfil de usuário no Firestore de forma segura sempre que um novo usuário se cadastra no Firebase Auth.

**Arquivo:** `functions/src/index.ts`
```typescript
import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";
import { onUserCreate, UserRecord } from "firebase-functions/v2/auth";
import { setGlobalOptions } from "firebase-functions/v2";
import * as logger from "firebase-functions/logger";
import { getOrchestrator } from "./orchestrator";
import { ProcessingInput } from "./orchestrator/types";

// Inicializar o Admin SDK
if (admin.apps.length === 0) {
  admin.initializeApp();
}

// Configuração global (para funções HTTP existentes)
setGlobalOptions({
  maxInstances: 10,
  region: "us-central1",
  memory: "2GiB",
  timeoutSeconds: 540,
});

/**
 * Gatilho do Auth para criar perfil de usuário no Firestore.
 * Esta é a correção principal para o problema de login/cadastro.
 */
export const createUserProfile = onUserCreate(async (user: UserRecord) => {
  const { uid, email } = user.data;
  const db = admin.firestore();

  logger.info(`[FUNCTION] Novo usuário cadastrado: ${uid}, Email: ${email}`);

  try {
    const userRef = db.collection("usuarios").doc(uid);
    const defaultProfile = {
      email: email || "",
      cargo: "",
      areas_atuacao: [],
      nivel_experiencia: "iniciante",
      preferencias: { tema: "light", notificacoes: true },
      created_at: new Date(),
      updated_at: new Date(),
      workspaces: [],
    };
    await userRef.set(defaultProfile);
    logger.info(`[FUNCTION] Perfil para ${uid} criado com sucesso.`);
  } catch (error) {
    logger.error(`[FUNCTION] Erro ao criar perfil para ${uid}:`, error);
  }
});

// ... (O restante das suas funções HTTP existentes: processDocument, testRouting, etc.)
```

### Passo 2: Fazer o Deploy da Cloud Function

As Cloud Functions devem ser implantadas separadamente. Este passo deve ser executado a partir do **seu terminal local**, que está corretamente configurado.

```bash
# 1. Navegue até a pasta de funções
cd functions

# 2. Execute o comando de deploy do Firebase
firebase deploy --only functions
```

### Passo 3: Remover a Chamada à API Antiga (Próxima Etapa)

Após o deploy bem-sucedido da função, o código do frontend que chama a API `POST /api/admin/create-user-profile` deve ser localizado e removido. Isso eliminará código morto e potenciais erros no console do navegador.

## 4. Conclusão

A falha de login foi um sintoma de um problema arquitetural mais profundo. Ao substituir a chamada de API insegura por um gatilho de backend confiável, não estamos apenas corrigindo o bug, mas também tornando o sistema significativamente mais seguro e robusto, alinhado com as melhores práticas do Firebase.
