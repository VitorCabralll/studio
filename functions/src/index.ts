/**
 * Firebase Functions para LexAI
 * Orquestrador de IA como Cloud Function
 */

import { onRequest } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';
import { getOrchestrator } from './orchestrator';
import { ProcessingInput } from './orchestrator/types';

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
    cors: {
      origin: [
        'https://lexai-ef0ab.web.app',
        'https://lexai-ef0ab.firebaseapp.com',
        'http://localhost:3000'
      ],
      methods: ['POST'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }
  },
  async (request, response) => {
    // Apenas POST permitido
    if (request.method !== 'POST') {
      response.status(405).json({ error: 'Método não permitido' });
      return;
    }

    try {
      const input: ProcessingInput = request.body;
      
      // Log da requisição
      console.log(`[FUNCTION] Processando documento:`, {
        taskType: input.taskType,
        documentType: input.documentType,
        timestamp: new Date().toISOString()
      });

      const orchestrator = getOrchestrator();
      const result = await orchestrator.processDocument(input);

      response.status(200).json(result);

    } catch (error) {
      console.error(`[FUNCTION] Erro no processamento:`, error);
      
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
    cors: {
      origin: [
        'https://lexai-ef0ab.web.app',
        'https://lexai-ef0ab.firebaseapp.com',
        'http://localhost:3000'
      ],
      methods: ['POST'],
      allowedHeaders: ['Content-Type', 'Authorization']
    },
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
      console.error(`[FUNCTION] Erro no teste de roteamento:`, error);
      
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
    cors: {
      origin: [
        'https://lexai-ef0ab.web.app',
        'https://lexai-ef0ab.firebaseapp.com',
        'http://localhost:3000'
      ],
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type']
    },
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
      console.error(`[FUNCTION] Erro no health check:`, error);
      
      response.status(500).json({
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Erro interno',
        timestamp: new Date().toISOString()
      });
    }
  }
);