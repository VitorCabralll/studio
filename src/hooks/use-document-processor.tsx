'use client';

import { useState, useCallback } from 'react';

import { useAuth } from './use-auth';
import { 
  processUserDocuments,
  addUserInstruction,
  getExtractedTexts,
  type ExtractedText
} from '@/services/document-processor';

interface UseDocumentProcessorReturn {
  // Estado
  processing: boolean;
  progress: number;
  status: string;
  error: string | null;
  extractedTexts: ExtractedText[];
  
  // Funções
  processFiles: (files: File[], documentId: string) => Promise<ExtractedText[] | null>;
  addInstruction: (documentId: string, instruction: string) => Promise<boolean>;
  loadExtractedTexts: (documentId: string) => Promise<void>;
  clearError: () => void;
  clearTexts: () => void;
}

/**
 * Hook para processar documentos do usuário
 * Extrai texto via OCR local e salva apenas o texto (NUNCA os arquivos originais)
 * Garante privacidade total dos documentos do usuário
 */
export function useDocumentProcessor(): UseDocumentProcessorReturn {
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [extractedTexts, setExtractedTexts] = useState<ExtractedText[]>([]);

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Limpar textos extraídos
  const clearTexts = useCallback(() => {
    setExtractedTexts([]);
  }, []);

  // Callback para acompanhar progresso
  const handleProgress = useCallback((progressValue: number, statusMessage: string) => {
    setProgress(progressValue);
    setStatus(statusMessage);
  }, []);

  // Processar arquivos do usuário
  const processFiles = useCallback(async (
    files: File[], 
    documentId: string
  ): Promise<ExtractedText[] | null> => {
    if (!user) {
      setError('Usuário não autenticado');
      return null;
    }

    if (!files || files.length === 0) {
      return [];
    }

    setProcessing(true);
    setError(null);
    setProgress(0);
    setStatus('Preparando processamento...');

    try {
      const result = await processUserDocuments(
        files,
        documentId,
        user.uid,
        handleProgress
      );

      if (result.success && result.data) {
        setExtractedTexts(result.data);
        setStatus('Processamento concluído com sucesso!');
        
        // Limpar progresso após um tempo
        setTimeout(() => {
          setProgress(0);
          setStatus('');
        }, 3000);
        
        return result.data;
      } else {
        setError(result.error?.message || 'Erro no processamento');
        return null;
      }
    } catch (err) {
      setError('Erro inesperado durante processamento');
      console.error('Erro em processFiles:', err);
      return null;
    } finally {
      setProcessing(false);
    }
  }, [user, handleProgress]);

  // Adicionar instrução do usuário
  const addInstruction = useCallback(async (
    documentId: string,
    instruction: string
  ): Promise<boolean> => {
    if (!user) {
      setError('Usuário não autenticado');
      return false;
    }

    if (!instruction.trim()) {
      setError('Instrução não pode estar vazia');
      return false;
    }

    setError(null);

    try {
      const result = await addUserInstruction(documentId, instruction, user.uid);
      
      if (result.success) {
        // Adicionar instrução à lista local
        const instructionText: ExtractedText = {
          source: 'user_instruction',
          content: instruction.trim(),
          type: 'instruction',
          processedAt: new Date(),
          size: instruction.length
        };
        
        setExtractedTexts(prev => [...prev, instructionText]);
        return true;
      } else {
        setError(result.error?.message || 'Erro ao adicionar instrução');
        return false;
      }
    } catch (err) {
      setError('Erro inesperado ao adicionar instrução');
      console.error('Erro em addInstruction:', err);
      return false;
    }
  }, [user]);

  // Carregar textos extraídos salvos
  const loadExtractedTexts = useCallback(async (documentId: string): Promise<void> => {
    setError(null);

    try {
      const result = await getExtractedTexts(documentId);
      
      if (result.success && result.data) {
        setExtractedTexts(result.data);
      } else {
        setError(result.error?.message || 'Erro ao carregar textos');
      }
    } catch (err) {
      setError('Erro inesperado ao carregar textos');
      console.error('Erro em loadExtractedTexts:', err);
    }
  }, []);

  return {
    // Estado
    processing,
    progress,
    status,
    error,
    extractedTexts,
    
    // Funções
    processFiles,
    addInstruction,
    loadExtractedTexts,
    clearError,
    clearTexts
  };
}