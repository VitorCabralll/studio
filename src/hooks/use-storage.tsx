'use client';

import { useState, useCallback } from 'react';

import { useAuth } from './use-auth';
import { 
  uploadTemplate, 
  uploadMultipleTemplates, 
  deleteFile, 
  listUserFiles, 
  getFileDownloadURL,
  type UploadResult,
  type FileMetadata 
} from '@/services/storage-service';

interface UseStorageReturn {
  // Estado
  uploading: boolean;
  error: string | null;
  uploadProgress: number;
  userFiles: FileMetadata[];
  
  // Funções
  uploadSingleTemplate: (file: File, path: string) => Promise<UploadResult | null>;
  uploadTemplates: (files: File[], path: string) => Promise<UploadResult[] | null>;
  removeFile: (fullPath: string) => Promise<boolean>;
  refreshUserFiles: (path?: string) => Promise<void>;
  getDownloadURL: (fullPath: string) => Promise<string | null>;
  clearError: () => void;
}

/**
 * Hook para gerenciar operações do Firebase Storage
 * APENAS para templates de agentes e documentos gerados - NÃO para documentos do usuário
 * Fornece interface simplificada para upload, download e gerenciamento de templates
 */
export function useStorage(): UseStorageReturn {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [userFiles, setUserFiles] = useState<FileMetadata[]>([]);

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Upload de template único
  const uploadSingleTemplate = useCallback(async (
    file: File, 
    path: string
  ): Promise<UploadResult | null> => {
    if (!user) {
      setError('Usuário não autenticado');
      return null;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Simular progresso (Firebase Storage não fornece progresso detalhado facilmente)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const result = await uploadTemplate(file, path, user.uid);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success && result.data) {
        // Atualizar lista de arquivos
        await refreshUserFiles(path);
        return result.data;
      } else {
        setError(result.error?.message || 'Erro no upload');
        return null;
      }
    } catch (err) {
      setError('Erro inesperado durante upload');
      console.error('Erro em uploadSingleFile:', err);
      return null;
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [user]);

  // Upload de múltiplos templates
  const uploadTemplates = useCallback(async (
    files: File[], 
    path: string
  ): Promise<UploadResult[] | null> => {
    if (!user) {
      setError('Usuário não autenticado');
      return null;
    }

    if (!files || files.length === 0) {
      return [];
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Simular progresso para múltiplos arquivos
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 5, 90));
      }, 200);

      const result = await uploadMultipleTemplates(files, path, user.uid);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success && result.data) {
        // Atualizar lista de arquivos
        await refreshUserFiles(path);
        return result.data;
      } else {
        setError(result.error?.message || 'Erro no upload');
        return null;
      }
    } catch (err) {
      setError('Erro inesperado durante upload');
      console.error('Erro em uploadFiles:', err);
      return null;
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [user]);

  // Remover arquivo
  const removeFile = useCallback(async (fullPath: string): Promise<boolean> => {
    setError(null);

    try {
      const result = await deleteFile(fullPath);
      
      if (result.success) {
        // Atualizar lista removendo o arquivo
        setUserFiles(prev => prev.filter(file => file.fullPath !== fullPath));
        return true;
      } else {
        setError(result.error?.message || 'Erro ao remover arquivo');
        return false;
      }
    } catch (err) {
      setError('Erro inesperado ao remover arquivo');
      console.error('Erro em removeFile:', err);
      return false;
    }
  }, []);

  // Atualizar lista de arquivos do usuário
  const refreshUserFiles = useCallback(async (path?: string): Promise<void> => {
    if (!user) return;

    setError(null);

    try {
      const result = await listUserFiles(user.uid, path);
      
      if (result.success && result.data) {
        setUserFiles(result.data);
      } else {
        setError(result.error?.message || 'Erro ao carregar arquivos');
      }
    } catch (err) {
      setError('Erro inesperado ao carregar arquivos');
      console.error('Erro em refreshUserFiles:', err);
    }
  }, [user]);

  // Obter URL de download
  const getDownloadURL = useCallback(async (fullPath: string): Promise<string | null> => {
    setError(null);

    try {
      const result = await getFileDownloadURL(fullPath);
      
      if (result.success && result.data) {
        return result.data;
      } else {
        setError(result.error?.message || 'Erro ao obter URL de download');
        return null;
      }
    } catch (err) {
      setError('Erro inesperado ao obter URL');
      console.error('Erro em getDownloadURL:', err);
      return null;
    }
  }, []);

  return {
    // Estado
    uploading,
    error,
    uploadProgress,
    userFiles,
    
    // Funções
    uploadSingleTemplate,
    uploadTemplates,
    removeFile,
    refreshUserFiles,
    getDownloadURL,
    clearError
  };
}