'use client';

import { useState, useCallback } from 'react';

import { useAuth } from './use-auth';
import { authLogger } from '@/lib/auth-logger';
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
      authLogger.error('Failed to refresh user files', err as Error, {
        context: 'use-storage',
        operation: 'refresh_user_files',
        userId: user?.uid,
      });
    }
  }, [user]);

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
      authLogger.error('Failed to upload single file', err as Error, {
        context: 'use-storage',
        operation: 'upload_single_file',
        userId: user?.uid,
        metadata: { fileName: file.name, fileSize: file.size },
      });
      return null;
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [user, refreshUserFiles]);

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
      const result = await uploadMultipleTemplates(files, path, user.uid);

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
      authLogger.error('Failed to upload files', err as Error, {
        context: 'use-storage',
        operation: 'upload_files',
        userId: user?.uid,
        metadata: { fileCount: files.length },
      });
      return null;
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [user, refreshUserFiles]);

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
      authLogger.error('Failed to remove file', err as Error, {
        context: 'use-storage',
        operation: 'remove_file',
        userId: user?.uid,
        metadata: { fullPath },
      });
      return false;
    }
  }, []);

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
      authLogger.error('Failed to get download URL', err as Error, {
        context: 'use-storage',
        operation: 'get_download_url',
        userId: user?.uid,
        metadata: { fullPath },
      });
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
    clearError,
  };
}