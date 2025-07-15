/**
 * Firebase Functions para LexAI
 * Orquestrador de IA como Cloud Function
 */

import * as admin from "firebase-admin";
import { onRequest } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';
import * as functions from 'firebase-functions/v1';
import * as logger from "firebase-functions/logger";

// Inicializar o Admin SDK
if (admin.apps.length === 0) {
  admin.initializeApp();
}

import { getOrchestrator } from './orchestrator';
import { ProcessingInput } from './orchestrator/types';

// Import reCAPTCHA Enterprise validation functions
export {
  validateRecaptchaEnterprise,
  verifyAppCheckTokenEnterprise
} from './recaptcha-enterprise-validator';

// Legacy reCAPTCHA v3 functions (deprecated)
export {
  validateRecaptcha,
  verifyAppCheckToken
} from './recaptcha-validator';

// Configuração global
setGlobalOptions({
  maxInstances: 10,
  region: 'us-central1',
  memory: '2GiB',
  timeoutSeconds: 540, // 9 minutos
});

/**
 * Endpoint principal para processamento de documentos
 */
export const processDocument = onRequest(
  {
    cors: [
      'https://lexai-ef0ab.web.app',
      'https://lexai-ef0ab.firebaseapp.com',
      'http://localhost:3000'
    ]
  },
  async (request, response) => {
    // Apenas POST permitido
    if (request.method !== 'POST') {
      response.status(405).json({ error: 'Método não permitido' });
      return;
    }

    try {
      const input: ProcessingInput = request.body;
      
      logger.info(`[FUNCTION] Processando documento:`, {
        taskType: input.taskType,
        documentType: input.documentType,
        timestamp: new Date().toISOString()
      });

      const orchestrator = getOrchestrator();
      const result = await orchestrator.processDocument(input);

      response.status(200).json(result);

    } catch (error) {
      logger.error(`[FUNCTION] Erro no processamento:`, error);
      
      response.status(500).json({
        success: false,
        error: {
          code: 'FUNCTION_ERROR',
          message: error instanceof Error ? error.message : 'Erro interno',
          retryable: true,
          timestamp: new Date()
        }
      });
    }
  }
);

/**
 * Endpoint para teste de roteamento
 */
export const testRouting = onRequest(
  {
    cors: [
      'https://lexai-ef0ab.web.app',
      'https://lexai-ef0ab.firebaseapp.com',
      'http://localhost:3000'
    ],
    memory: '512MiB',
    timeoutSeconds: 60
  },
  async (request, response) => {
    if (request.method !== 'POST') {
      response.status(405).json({ error: 'Método não permitido' });
      return;
    }

    try {
      const input: ProcessingInput = request.body;
      const orchestrator = getOrchestrator();
      const decision = await orchestrator.testRouting(input);

      response.status(200).json(decision);

    } catch (error) {
      logger.error(`[FUNCTION] Erro no teste de roteamento:`, error);
      
      response.status(500).json({
        error: error instanceof Error ? error.message : 'Erro interno'
      });
    }
  }
);

/**
 * Health check
 */
export const healthCheck = onRequest(
  {
    cors: [
      'https://lexai-ef0ab.web.app',
      'https://lexai-ef0ab.firebaseapp.com',
      'http://localhost:3000'
    ],
    memory: '256MiB',
    timeoutSeconds: 30
  },
  async (request, response) => {
    try {
      const orchestrator = getOrchestrator();
      const health = await orchestrator.healthCheck();
      const status = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        llmCount: 3,
        version: '2.0.0',
        providers: health
      };

      response.status(200).json(status);

    } catch (error) {
      logger.error(`[FUNCTION] Erro no health check:`, error);
      
      response.status(500).json({
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Erro interno',
        timestamp: new Date().toISOString()
      });
    }
  }
);

/**
 * Gatilho do Auth para criar perfil de usuário no Firestore
 * Acionado sempre que um novo usuário é criado.
 * Usa Firebase Functions v1 porque auth triggers não são suportados em v2.
 */
export const createUserProfile = functions.auth.user().onCreate(async (user) => {
  const { uid, email } = user;
  const db = admin.firestore();

  logger.info(`[FUNCTION] Novo usuário cadastrado: ${uid}, Email: ${email}`);

  try {
    const userRef = db.collection("usuarios").doc(uid);

    const defaultProfile = {
      // Campos obrigatórios da interface UserProfile
      cargo: "",
      areas_atuacao: [],
      primeiro_acesso: true,
      initial_setup_complete: false,
      data_criacao: new Date(),
      workspaces: [],
      
      // Campos opcionais úteis
      email: email || "",
      nivel_experiencia: "iniciante",
      preferencias: {
        tema: "light",
        notificacoes: true,
      },
      updated_at: new Date(),
    };

    await userRef.set(defaultProfile);

    logger.info(`[FUNCTION] Perfil para o usuário ${uid} criado com sucesso no Firestore.`);

  } catch (error: any) {
    logger.error(`[FUNCTION] Erro ao criar perfil para o usuário ${uid}:`, error);
    throw error;
  }
});