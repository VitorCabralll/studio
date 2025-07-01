import { 
  getFirestore, 
  doc, 
  getDoc,
  setDoc,
  deleteDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';

import type { ServiceResult, ServiceError } from './user-service';
import { firebaseApp } from '@/lib/firebase';

const db = getFirestore(firebaseApp);

// Configurações de retenção - PRIVACIDADE MÁXIMA
const DATA_RETENTION_CONFIG = {
  // MUDANÇA: Descarte imediato como padrão (zero retenção)
  DEFAULT_RETENTION_DAYS: 0,
  
  // MUDANÇA: Sempre descartar dados imediatamente após geração
  IMMEDIATE_CLEANUP_ON_COMPLETION: true,
  
  // Mantém opção para casos especiais, mas padrão é descarte
  ALLOW_USER_CHOICE: true,
  
  // Limpeza automática para casos de falha
  AUTO_CLEANUP_ENABLED: true,
  
  // NOVO: Política de privacidade máxima ativada
  MAXIMUM_PRIVACY_MODE: true,
  
  // NOVO: Aviso obrigatório sobre descarte imediato
  NOTIFY_IMMEDIATE_CLEANUP: true
};

// Tipos para controle de ciclo de vida
export interface DataRetentionPolicy {
  documentId: string;
  retentionDays: number;
  autoCleanup: boolean;
  userRequested: boolean;
  createdAt: Date;
  expiresAt: Date;
}

export interface CleanupResult {
  documentsProcessed: number;
  documentsDeleted: number;
  bytesFreed: number;
  errors: string[];
}

// Função utilitária para criar erros padronizados
function createCleanupError(error: unknown, operation: string): ServiceError {
  if (error instanceof Error) {
    return {
      code: error.name || 'cleanup-error',
      message: `Erro na limpeza durante ${operation}: ${error.message}`,
      details: error.stack
    };
  }
  
  return {
    code: 'unknown',
    message: `Erro desconhecido na limpeza durante ${operation}`,
    details: String(error)
  };
}

/**
 * Limpa dados de processamento após geração do documento
 * @param documentId - ID do documento processado
 * @param immediate - Se deve limpar imediatamente ou agendar
 * @param userRequested - Se foi solicitado pelo usuário
 * @returns Resultado da operação
 */
export async function cleanupDocumentData(
  documentId: string,
  immediate: boolean = false,
  userRequested: boolean = false
): Promise<ServiceResult<boolean>> {
  try {
    // Validações
    if (!documentId || documentId.trim() === '') {
      return {
        data: false,
        error: {
          code: 'invalid-argument',
          message: 'ID do documento é obrigatório.'
        },
        success: false
      };
    }

    if (immediate || userRequested) {
      // Limpeza imediata: deletar dados de processamento
      const processingDocRef = doc(db, 'document_processing', documentId);
      await deleteDoc(processingDocRef);
      
      console.log(`Dados de processamento removidos para documento ${documentId}`);
      return { data: true, error: null, success: true };
    } else {
      // Agendar limpeza: criar política de retenção
      const retentionPolicy: DataRetentionPolicy = {
        documentId,
        retentionDays: DATA_RETENTION_CONFIG.DEFAULT_RETENTION_DAYS,
        autoCleanup: DATA_RETENTION_CONFIG.AUTO_CLEANUP_ENABLED,
        userRequested: false,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + (DATA_RETENTION_CONFIG.DEFAULT_RETENTION_DAYS * 24 * 60 * 60 * 1000))
      };

      const retentionDocRef = doc(db, 'data_retention', documentId);
      await setDoc(retentionDocRef, {
        ...retentionPolicy,
        createdAt: serverTimestamp(),
        expiresAt: serverTimestamp() // Será calculado pela Cloud Function
      });

      console.log(`Política de retenção criada para documento ${documentId} (${DATA_RETENTION_CONFIG.DEFAULT_RETENTION_DAYS} dias)`);
      return { data: true, error: null, success: true };
    }

  } catch (error) {
    console.error('Erro em cleanupDocumentData:', error);
    return {
      data: false,
      error: createCleanupError(error, 'limpar dados do documento'),
      success: false
    };
  }
}

/**
 * Executa limpeza automática de dados expirados
 * Esta função seria chamada por uma Cloud Function agendada
 * @returns Resultado da limpeza em lote
 */
export async function runAutomaticCleanup(): Promise<ServiceResult<CleanupResult>> {
  try {
    const now = new Date();
    const result: CleanupResult = {
      documentsProcessed: 0,
      documentsDeleted: 0,
      bytesFreed: 0,
      errors: []
    };

    // Buscar documentos com data de expiração vencida
    const retentionQuery = query(
      collection(db, 'data_retention'),
      where('expiresAt', '<=', Timestamp.fromDate(now)),
      where('autoCleanup', '==', true)
    );

    const retentionSnapshot = await getDocs(retentionQuery);
    result.documentsProcessed = retentionSnapshot.size;

    // Processar cada documento para limpeza
    for (const retentionDoc of retentionSnapshot.docs) {
      try {
        const retentionData = retentionDoc.data() as DataRetentionPolicy;
        const documentId = retentionData.documentId;

        // Deletar dados de processamento
        const processingDocRef = doc(db, 'document_processing', documentId);
        await deleteDoc(processingDocRef);

        // Deletar política de retenção
        await deleteDoc(retentionDoc.ref);

        result.documentsDeleted++;
        
        // Estimativa de bytes liberados (baseado no tamanho médio dos textos extraídos)
        result.bytesFreed += 50000; // ~50KB por documento (estimativa)

        console.log(`Dados limpos automaticamente para documento ${documentId}`);

      } catch (docError) {
        const errorMessage = `Erro ao limpar documento ${retentionDoc.id}: ${docError}`;
        result.errors.push(errorMessage);
        console.error(errorMessage);
      }
    }

    console.log(`Limpeza automática concluída: ${result.documentsDeleted}/${result.documentsProcessed} documentos limpos`);
    return { data: result, error: null, success: true };

  } catch (error) {
    console.error('Erro em runAutomaticCleanup:', error);
    return {
      data: null,
      error: createCleanupError(error, 'executar limpeza automática'),
      success: false
    };
  }
}

/**
 * Permite ao usuário solicitar limpeza imediata dos seus dados
 * @param userId - ID do usuário
 * @param documentIds - IDs específicos dos documentos (opcional)
 * @returns Resultado da limpeza solicitada pelo usuário
 */
export async function requestUserDataCleanup(
  userId: string,
  documentIds?: string[]
): Promise<ServiceResult<CleanupResult>> {
  try {
    // Validações
    if (!userId || userId.trim() === '') {
      return {
        data: null,
        error: {
          code: 'invalid-argument',
          message: 'ID do usuário é obrigatório.'
        },
        success: false
      };
    }

    const result: CleanupResult = {
      documentsProcessed: 0,
      documentsDeleted: 0,
      bytesFreed: 0,
      errors: []
    };

    if (documentIds && documentIds.length > 0) {
      // Limpar documentos específicos
      result.documentsProcessed = documentIds.length;
      
      for (const documentId of documentIds) {
        try {
          const cleanupResult = await cleanupDocumentData(documentId, true, true);
          if (cleanupResult.success) {
            result.documentsDeleted++;
            result.bytesFreed += 50000; // Estimativa
          } else {
            result.errors.push(`Erro ao limpar documento ${documentId}: ${cleanupResult.error?.message}`);
          }
        } catch (docError) {
          result.errors.push(`Erro ao limpar documento ${documentId}: ${docError}`);
        }
      }
    } else {
      // Limpar todos os dados do usuário
      const processingQuery = query(
        collection(db, 'document_processing'),
        where('userId', '==', userId)
      );

      const processingSnapshot = await getDocs(processingQuery);
      result.documentsProcessed = processingSnapshot.size;

      for (const processingDoc of processingSnapshot.docs) {
        try {
          await deleteDoc(processingDoc.ref);
          result.documentsDeleted++;
          result.bytesFreed += 50000; // Estimativa
        } catch (docError) {
          result.errors.push(`Erro ao limpar documento ${processingDoc.id}: ${docError}`);
        }
      }
    }

    console.log(`Limpeza solicitada pelo usuário ${userId} concluída: ${result.documentsDeleted}/${result.documentsProcessed} documentos limpos`);
    return { data: result, error: null, success: true };

  } catch (error) {
    console.error('Erro em requestUserDataCleanup:', error);
    return {
      data: null,
      error: createCleanupError(error, 'processar solicitação de limpeza do usuário'),
      success: false
    };
  }
}

/**
 * Verifica status de retenção de dados para um documento
 * @param documentId - ID do documento
 * @returns Informações sobre retenção
 */
export async function getDataRetentionStatus(documentId: string): Promise<ServiceResult<DataRetentionPolicy | null>> {
  try {
    if (!documentId || documentId.trim() === '') {
      return {
        data: null,
        error: {
          code: 'invalid-argument',
          message: 'ID do documento é obrigatório.'
        },
        success: false
      };
    }

    const retentionDocRef = doc(db, 'data_retention', documentId);
    const retentionSnapshot = await getDoc(retentionDocRef);

    if (!retentionSnapshot.exists()) {
      return { data: null, error: null, success: true };
    }

    const retentionData = retentionSnapshot.data() as DataRetentionPolicy;
    return { data: retentionData, error: null, success: true };

  } catch (error) {
    console.error('Erro em getDataRetentionStatus:', error);
    return {
      data: null,
      error: createCleanupError(error, 'obter status de retenção'),
      success: false
    };
  }
}

// Exportar configurações para uso em outros módulos
export { DATA_RETENTION_CONFIG };