import { doc, getDoc, setDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import type { ServiceResult, ServiceError } from './user-service';
import { getFirebaseDb, getFirebaseAuth } from '@/lib/firebase';
import { enforceMaximumPrivacy } from './privacy-enforcer';
import { processFileWithOCR, convertToExtractedText, isFileSupported } from './ocr-service';

// 🛡️ Função utilitária para validar token JWT antes de consultas Firestore
async function validateAuthToken(): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = getFirebaseAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    // Forçar refresh do token para garantir que está válido
    await currentUser.getIdToken(true);
    console.log('✅ Token JWT válido obtido para consulta Firestore');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao validar token JWT:', error);
    return { success: false, error: 'Falha na validação do token de autenticação' };
  }
}

// Tipos para processamento de documentos
export interface ExtractedText {
  source: string;           // Nome do arquivo original (sem o arquivo em si)
  content: string;          // Texto extraído via OCR
  type: 'ocr' | 'instruction' | 'auxiliary';
  confidence?: number;      // Confiança do OCR (0-1)
  processedAt: Date;
  size: number;            // Tamanho original do arquivo (para estatísticas)
}

export interface DocumentProcessingResult {
  documentId: string;
  extractedTexts: ExtractedText[];
  totalSources: number;
  totalCharacters: number;
  processingStartTime: Date;
}

export interface SecureDocumentResult {
  documentId: string;
  generatedContent: string;
  dataDiscarded: boolean;
  securityLevel: 'maximum_privacy';
  processingTime: number;
}

// Função utilitária para criar erros padronizados
function createProcessorError(error: unknown, operation: string): ServiceError {
  if (error instanceof Error) {
    return {
      code: error.name || 'processor-error',
      message: `Erro no processamento durante ${operation}: ${error.message}`,
      details: error.stack
    };
  }
  
  return {
    code: 'unknown',
    message: `Erro desconhecido no processamento durante ${operation}`,
    details: String(error)
  };
}

/**
 * Salva texto extraído no Firestore (SEM o arquivo original)
 * @param documentId - ID do documento sendo processado
 * @param extractedTexts - Textos extraídos dos arquivos
 * @param userId - ID do usuário
 * @returns Resultado da operação
 */
export async function saveExtractedTexts(
  documentId: string,
  extractedTexts: ExtractedText[],
  userId: string
): Promise<ServiceResult<DocumentProcessingResult>> {
  try {
    // Validações
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

    if (!extractedTexts || extractedTexts.length === 0) {
      return {
        data: null,
        error: {
          code: 'invalid-argument',
          message: 'Textos extraídos são obrigatórios.'
        },
        success: false
      };
    }

    // Preparar dados para o Firestore
    const documentData = {
      extractedTexts: extractedTexts.map(text => ({
        ...text,
        processedAt: serverTimestamp()
      })),
      metadata: {
        totalSources: extractedTexts.length,
        totalCharacters: extractedTexts.reduce((sum, text) => sum + text.content.length, 0),
        lastProcessed: serverTimestamp()
      },
      userId,
      status: 'texts_extracted'
    };

    // Salvar no Firestore
    const docRef = doc(getFirebaseDb(), 'document_processing', documentId);
    await setDoc(docRef, documentData, { merge: true });

    const result: DocumentProcessingResult = {
      documentId,
      extractedTexts,
      totalSources: extractedTexts.length,
      totalCharacters: extractedTexts.reduce((sum, text) => sum + text.content.length, 0),
      processingStartTime: new Date()
    };

    return { data: result, error: null, success: true };

  } catch (error) {
    console.error('Erro em saveExtractedTexts:', error);
    return {
      data: null,
      error: createProcessorError(error, 'salvar textos extraídos'),
      success: false
    };
  }
}

/**
 * Adiciona texto de instrução personalizada do usuário
 * @param documentId - ID do documento
 * @param instruction - Instrução do usuário
 * @param userId - ID do usuário
 * @returns Resultado da operação
 */
export async function addUserInstruction(
  documentId: string,
  instruction: string,
  userId: string
): Promise<ServiceResult<boolean>> {
  try {
    // Validações
    if (!documentId || !instruction.trim() || !userId) {
      return {
        data: false,
        error: {
          code: 'invalid-argument',
          message: 'DocumentId, instrução e userId são obrigatórios.'
        },
        success: false
      };
    }

    const instructionText: ExtractedText = {
      source: 'user_instruction',
      content: instruction.trim(),
      type: 'instruction',
      processedAt: new Date(),
      size: instruction.length
    };

    // Adicionar à lista de textos extraídos
    const docRef = doc(getFirebaseDb(), 'document_processing', documentId);
    await setDoc(docRef, {
      extractedTexts: arrayUnion({
        ...instructionText,
        processedAt: serverTimestamp()
      }),
      userId
    }, { merge: true });

    return { data: true, error: null, success: true };

  } catch (error) {
    console.error('Erro em addUserInstruction:', error);
    return {
      data: false,
      error: createProcessorError(error, 'adicionar instrução do usuário'),
      success: false
    };
  }
}

/**
 * Processa arquivos do usuário: extrai texto via OCR e descarta os arquivos
 * Esta função coordena todo o fluxo de processamento sem salvar arquivos
 * @param files - Arquivos selecionados pelo usuário
 * @param documentId - ID do documento sendo criado
 * @param userId - ID do usuário
 * @param onProgress - Callback para acompanhar progresso
 * @returns Textos extraídos (arquivos são descartados)
 */
export async function processUserDocuments(
  files: File[],
  documentId: string,
  userId: string,
  onProgress?: (progress: number, status: string) => void
): Promise<ServiceResult<ExtractedText[]>> {
  try {
    if (!files || files.length === 0) {
      return { data: [], error: null, success: true };
    }

    const extractedTexts: ExtractedText[] = [];
    const totalFiles = files.length;

    onProgress?.(0, 'Iniciando processamento...');

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const progress = Math.round(((i + 1) / totalFiles) * 100);
      
      onProgress?.(progress, `Processando ${file.name}...`);

      try {
        let extractedText: ExtractedText;
        
        if (file.type.startsWith('text/')) {
          // Arquivos de texto - leitura direta
          console.log(`📄 Lendo arquivo de texto: ${file.name}`);
          const textContent = await file.text();
          extractedText = {
            source: file.name,
            content: textContent,
            type: 'ocr',
            confidence: 1.0,
            processedAt: new Date(),
            size: file.size
          };
        } else if (isFileSupported(file)) {
          // Arquivos de imagem/PDF - OCR REAL LOCAL
          console.log(`🔍 Processando ${file.name} com OCR local...`);
          
          const ocrResult = await processFileWithOCR(file, {
            language: 'por+eng',
            onProgress: (progress, message) => {
              const overallProgress = Math.round(((i + progress) / totalFiles) * 100);
              onProgress?.(overallProgress, `${message} (${file.name})`);
            }
          });
          
          extractedText = convertToExtractedText(ocrResult, file.name, file.size);
          
          console.log(`✅ OCR concluído: ${file.name} (${(ocrResult.confidence * 100).toFixed(1)}% confiança)`);
        } else {
          // Tipo não suportado
          throw new Error(`Tipo de arquivo não suportado: ${file.type}`);
        }

        extractedTexts.push(extractedText);

        // IMPORTANTE: O arquivo File não é salvo em lugar nenhum
        // Apenas o texto extraído é mantido - MÁXIMA PRIVACIDADE

      } catch (fileError) {
        console.error(`❌ FALHA no processamento de ${file.name}:`, fileError);
        
        // Registrar falha mas continuar com outros arquivos
        const errorDetails = fileError instanceof Error ? fileError.message : 'Erro técnico não identificado';
        
        const errorText: ExtractedText = {
          source: file.name,
          content: '', // Texto vazio para falhas reais
          type: 'ocr',
          confidence: 0,
          processedAt: new Date(),
          size: file.size
        };

        extractedTexts.push(errorText);
        
        // Log detalhado para debugging
        console.warn(`⚠️ Arquivo ${file.name} falhou: ${errorDetails} (${file.type}, ${(file.size / 1024 / 1024).toFixed(2)}MB)`);
      }
    }

    onProgress?.(100, 'Processamento concluído!');

    // Salvar textos extraídos no Firestore
    const saveResult = await saveExtractedTexts(documentId, extractedTexts, userId);
    
    if (!saveResult.success) {
      return {
        data: null,
        error: saveResult.error,
        success: false
      };
    }

    return { data: extractedTexts, error: null, success: true };

  } catch (error) {
    console.error('Erro em processUserDocuments:', error);
    return {
      data: null,
      error: createProcessorError(error, 'processar documentos do usuário'),
      success: false
    };
  }
}

/**
 * Recupera textos extraídos de um documento
 * @param documentId - ID do documento
 * @returns Textos extraídos salvos
 */
export async function getExtractedTexts(documentId: string): Promise<ServiceResult<ExtractedText[]>> {
  try {
    // 🛡️ Validar token JWT antes da consulta
    const authValidation = await validateAuthToken();
    if (!authValidation.success) {
      return {
        data: null,
        error: {
          code: 'unauthenticated',
          message: authValidation.error || 'Falha na autenticação'
        },
        success: false
      };
    }

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

    const docRef = doc(getFirebaseDb(), 'document_processing', documentId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { data: [], error: null, success: true };
    }

    const data = docSnap.data();
    const extractedTexts = data.extractedTexts || [];

    return { data: extractedTexts, error: null, success: true };

  } catch (error) {
    console.error('Erro em getExtractedTexts:', error);
    return {
      data: null,
      error: createProcessorError(error, 'recuperar textos extraídos'),
      success: false
    };
  }
}

/**
 * Finaliza documento com aplicação AUTOMÁTICA de privacidade máxima
 * Esta função SEMPRE descarta dados imediatamente após geração
 * @param documentId - ID do documento processado
 * @param generatedContent - Conteúdo final do documento gerado
 * @param userId - ID do usuário
 * @param processingStartTime - Quando o processamento começou
 * @returns Resultado seguro da finalização
 */
export async function finalizeDocumentSecurely(
  documentId: string,
  generatedContent: string,
  userId: string,
  processingStartTime: Date
): Promise<ServiceResult<SecureDocumentResult>> {
  try {
    const finalizationStart = new Date();
    
    console.log(`🔒 Iniciando finalização segura para documento ${documentId}`);

    // Salvar apenas o documento final no Firestore
    const finalDocumentData = {
      documentId,
      content: generatedContent,
      userId,
      status: 'completed',
      generatedAt: serverTimestamp(),
      securityLevel: 'maximum_privacy',
      dataRetentionPolicy: 'zero_retention',
      metadata: {
        wordCount: generatedContent.split(/\s+/).length,
        charCount: generatedContent.length,
        processingTime: finalizationStart.getTime() - processingStartTime.getTime()
      }
    };

    const documentRef = doc(getFirebaseDb(), 'documents', documentId);
    await setDoc(documentRef, finalDocumentData);

    // 2. APLICAR ENFORCEMENT AUTOMÁTICO DE PRIVACIDADE MÁXIMA
    console.log(`🚨 Aplicando enforcement de privacidade máxima para documento ${documentId}`);
    
    const enforcementResult = await enforceMaximumPrivacy(
      documentId,
      userId,
      processingStartTime
    );

    if (!enforcementResult.success) {
      // FALHA CRÍTICA DE SEGURANÇA
      console.error(`🚨 FALHA CRÍTICA: Não foi possível garantir privacidade máxima para documento ${documentId}`);
      
      return {
        data: null,
        error: {
          code: 'security-critical-failure',
          message: '🚨 FALHA CRÍTICA DE SEGURANÇA: Dados podem estar retidos no sistema',
          details: enforcementResult.error?.details
        },
        success: false
      };
    }

    // 3. Sucesso - documento gerado e dados descartados com segurança
    const result: SecureDocumentResult = {
      documentId,
      generatedContent,
      dataDiscarded: true,
      securityLevel: 'maximum_privacy',
      processingTime: finalizationStart.getTime() - processingStartTime.getTime()
    };

    console.log(`✅ FINALIZAÇÃO SEGURA CONCLUÍDA: Documento ${documentId} gerado e dados descartados em ${result.processingTime}ms`);
    
    return { data: result, error: null, success: true };

  } catch (error) {
    console.error(`🚨 ERRO CRÍTICO na finalização segura: ${error}`);
    return {
      data: null,
      error: createProcessorError(error, 'finalizar documento com segurança máxima'),
      success: false
    };
  }
}