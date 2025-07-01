import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { ServiceResult, ServiceError } from './user-service';
import { firebaseApp } from '@/lib/firebase';
import { cleanupDocumentData, DATA_RETENTION_CONFIG } from './data-cleanup';

const db = getFirestore(firebaseApp);

// Tipos para finalização de documentos
export interface DocumentFinalization {
  documentId: string;
  finalDocumentPath?: string;  // Caminho no Storage do documento final
  generatedContent: string;    // Conteúdo textual do documento gerado
  cleanupPolicy: 'immediate' | 'scheduled' | 'keep';
  userChoice?: boolean;        // Se usuário escolheu manter/descartar
  completedAt: Date;
}

export interface FinalizationOptions {
  saveToStorage: boolean;      // Salvar documento final no Storage
  cleanupExtractedTexts: 'immediate' | 'scheduled' | 'keep';
  retentionDays?: number;      // Dias para manter dados (se scheduled)
  notifyUser: boolean;         // Notificar usuário sobre limpeza
  userChoice?: boolean;        // Se foi escolha explícita do usuário
}

// Função utilitária para criar erros padronizados
function createFinalizationError(error: unknown, operation: string): ServiceError {
  if (error instanceof Error) {
    return {
      code: error.name || 'finalization-error',
      message: `Erro na finalização durante ${operation}: ${error.message}`,
      details: error.stack
    };
  }
  
  return {
    code: 'unknown',
    message: `Erro desconhecido na finalização durante ${operation}`,
    details: String(error)
  };
}

/**
 * Finaliza processo de geração de documento e aplica política de limpeza
 * @param documentId - ID do documento processado
 * @param generatedContent - Conteúdo final do documento
 * @param options - Opções de finalização e limpeza
 * @param userId - ID do usuário
 * @returns Resultado da finalização
 */
export async function finalizeDocumentGeneration(
  documentId: string,
  generatedContent: string,
  options: FinalizationOptions,
  userId: string
): Promise<ServiceResult<DocumentFinalization>> {
  try {
    // Validações
    if (!documentId || !generatedContent || !userId) {
      return {
        data: null,
        error: {
          code: 'invalid-argument',
          message: 'DocumentId, conteúdo gerado e userId são obrigatórios.'
        },
        success: false
      };
    }

    // 1. Salvar documento final no Firestore
    const finalDocumentData = {
      documentId,
      content: generatedContent,
      userId,
      status: 'completed',
      generatedAt: serverTimestamp(),
      metadata: {
        wordCount: generatedContent.split(/\s+/).length,
        charCount: generatedContent.length,
        storageEnabled: options.saveToStorage
      }
    };

    const documentRef = doc(db, 'documents', documentId);
    await setDoc(documentRef, finalDocumentData);

    // 2. Aplicar política de limpeza dos textos extraídos
    let cleanupResult: ServiceResult<boolean> | null = null;
    
    switch (options.cleanupExtractedTexts) {
      case 'immediate':
        // Limpar dados imediatamente
        cleanupResult = await cleanupDocumentData(documentId, true, options.userChoice || false);
        break;
      
      case 'scheduled':
        // Agendar limpeza automática
        cleanupResult = await cleanupDocumentData(documentId, false, false);
        break;
      
      case 'keep':
        // Manter dados indefinidamente (não recomendado para produção)
        console.log(`Dados de processamento mantidos indefinidamente para documento ${documentId}`);
        cleanupResult = { data: true, error: null, success: true };
        break;
    }

    // 3. Preparar resultado da finalização
    const finalization: DocumentFinalization = {
      documentId,
      finalDocumentPath: options.saveToStorage ? `users/${userId}/generated/${documentId}.docx` : undefined,
      generatedContent,
      cleanupPolicy: options.cleanupExtractedTexts,
      userChoice: options.userChoice,
      completedAt: new Date()
    };

    // 4. Log da operação
    console.log(`Documento ${documentId} finalizado com sucesso`);
    console.log(`Política de limpeza aplicada: ${options.cleanupExtractedTexts}`);
    
    if (cleanupResult && !cleanupResult.success) {
      console.warn(`Aviso: Falha na limpeza dos dados: ${cleanupResult.error?.message}`);
    }

    return { data: finalization, error: null, success: true };

  } catch (error) {
    console.error('Erro em finalizeDocumentGeneration:', error);
    return {
      data: null,
      error: createFinalizationError(error, 'finalizar geração de documento'),
      success: false
    };
  }
}

/**
 * Oferece opções de privacidade ao usuário após geração
 * @param documentId - ID do documento
 * @param userPreference - Preferência do usuário sobre retenção
 * @returns Resultado da aplicação da preferência
 */
export async function applyUserPrivacyPreference(
  documentId: string,
  userPreference: 'delete_now' | 'delete_after_30_days' | 'keep_data'
): Promise<ServiceResult<boolean>> {
  try {
    if (!documentId || !userPreference) {
      return {
        data: false,
        error: {
          code: 'invalid-argument',
          message: 'DocumentId e preferência do usuário são obrigatórios.'
        },
        success: false
      };
    }

    let cleanupResult: ServiceResult<boolean>;

    switch (userPreference) {
      case 'delete_now':
        // Limpeza imediata solicitada pelo usuário
        cleanupResult = await cleanupDocumentData(documentId, true, true);
        break;
      
      case 'delete_after_30_days':
        // Agendar limpeza automática em 30 dias
        cleanupResult = await cleanupDocumentData(documentId, false, false);
        break;
      
      case 'keep_data':
        // Usuário optou por manter dados (criar política de retenção indefinida)
        console.log(`Usuário optou por manter dados do documento ${documentId} indefinidamente`);
        cleanupResult = { data: true, error: null, success: true };
        break;
      
      default:
        return {
          data: false,
          error: {
            code: 'invalid-preference',
            message: 'Preferência de privacidade inválida.'
          },
          success: false
        };
    }

    if (cleanupResult.success) {
      console.log(`Preferência de privacidade aplicada com sucesso para documento ${documentId}: ${userPreference}`);
    }

    return cleanupResult;

  } catch (error) {
    console.error('Erro em applyUserPrivacyPreference:', error);
    return {
      data: false,
      error: createFinalizationError(error, 'aplicar preferência de privacidade'),
      success: false
    };
  }
}

/**
 * Gera relatório de privacidade para o usuário
 * @param userId - ID do usuário
 * @returns Relatório de dados armazenados e políticas aplicadas
 */
export async function generatePrivacyReport(userId: string): Promise<ServiceResult<any>> {
  try {
    // TODO: Implementar consulta real aos dados do usuário
    
    const report = {
      userId,
      message: 'Relatório de privacidade - implementação completa pendente',
      note: 'Esta funcionalidade será implementada com consultas reais ao Firestore'
    };

    return { data: report, error: null, success: true };

  } catch (error) {
    console.error('Erro em generatePrivacyReport:', error);
    return {
      data: null,
      error: createFinalizationError(error, 'gerar relatório de privacidade'),
      success: false
    };
  }
}