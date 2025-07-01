import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject, 
  listAll,
  getMetadata,
  FirebaseStorage
} from 'firebase/storage';

import type { ServiceResult, ServiceError } from './user-service';
import { firebaseApp } from '@/lib/firebase';

// Inicializar Storage
const storage: FirebaseStorage = getStorage(firebaseApp);

// Tipos para operações de Storage
export interface UploadResult {
  downloadURL: string;
  fileName: string;
  fullPath: string;
  size: number;
}

export interface FileMetadata {
  name: string;
  fullPath: string;
  size: number;
  downloadURL: string;
  timeCreated: string;
  contentType?: string;
}

// Função utilitária para criar erros padronizados
function createStorageError(error: unknown, operation: string): ServiceError {
  if (error instanceof Error) {
    return {
      code: error.name || 'storage-error',
      message: `Erro no Storage durante ${operation}: ${error.message}`,
      details: error.stack
    };
  }
  
  return {
    code: 'unknown',
    message: `Erro desconhecido no Storage durante ${operation}`,
    details: String(error)
  };
}

/**
 * Upload de template para Firebase Storage
 * APENAS para templates de agentes (.docx) - NÃO para documentos do usuário
 * @param file - Arquivo de template (.docx)
 * @param path - Caminho no Storage (ex: 'templates' ou 'generated')
 * @param uid - ID do usuário (para organização)
 * @returns Resultado da operação com URL de download
 */
export async function uploadTemplate(
  file: File,
  path: string,
  uid: string
): Promise<ServiceResult<UploadResult>> {
  try {
    // Validações
    if (!file) {
      return {
        data: null,
        error: {
          code: 'invalid-argument',
          message: 'Arquivo é obrigatório.'
        },
        success: false
      };
    }

    // Validar que é um arquivo permitido (apenas templates .docx ou documentos gerados)
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/pdf' // PDF gerado
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return {
        data: null,
        error: {
          code: 'invalid-file-type',
          message: 'Apenas arquivos .docx (templates) e .pdf (gerados) são permitidos.'
        },
        success: false
      };
    }

    if (!uid || uid.trim() === '') {
      return {
        data: null,
        error: {
          code: 'invalid-argument',
          message: 'ID do usuário é obrigatório.'
        },
        success: false
      };
    }

    // Criar referência com path organizado por usuário
    const fileName = `${Date.now()}_${file.name}`;
    const fullPath = `users/${uid}/${path}/${fileName}`;
    const storageRef = ref(storage, fullPath);

    // Upload do arquivo
    const uploadResult = await uploadBytes(storageRef, file);
    
    // Obter URL de download
    const downloadURL = await getDownloadURL(uploadResult.ref);

    const result: UploadResult = {
      downloadURL,
      fileName: file.name,
      fullPath: uploadResult.ref.fullPath,
      size: file.size
    };

    return { data: result, error: null, success: true };

  } catch (error) {
    console.error('Erro em uploadFile:', error);
    return {
      data: null,
      error: createStorageError(error, 'upload de arquivo'),
      success: false
    };
  }
}

/**
 * Upload de múltiplos templates
 * APENAS para templates e documentos gerados - NÃO para documentos do usuário
 * @param files - Lista de arquivos de template
 * @param path - Caminho base no Storage
 * @param uid - ID do usuário
 * @returns Resultado com lista de uploads
 */
export async function uploadMultipleTemplates(
  files: File[],
  path: string,
  uid: string
): Promise<ServiceResult<UploadResult[]>> {
  try {
    if (!files || files.length === 0) {
      return {
        data: [],
        error: null,
        success: true
      };
    }

    // Upload paralelo de todos os arquivos
    const uploadPromises = files.map(file => uploadTemplate(file, path, uid));
    const results = await Promise.all(uploadPromises);

    // Verificar se houve erros
    const errors = results.filter(result => !result.success);
    if (errors.length > 0) {
      return {
        data: null,
        error: {
          code: 'batch-upload-error',
          message: `${errors.length} de ${files.length} arquivos falharam no upload.`,
          details: errors.map(e => e.error?.message).join('; ')
        },
        success: false
      };
    }

    // Extrair dados dos uploads bem-sucedidos
    const uploadData = results
      .filter(result => result.success && result.data)
      .map(result => result.data!);

    return { data: uploadData, error: null, success: true };

  } catch (error) {
    console.error('Erro em uploadMultipleFiles:', error);
    return {
      data: null,
      error: createStorageError(error, 'upload de múltiplos arquivos'),
      success: false
    };
  }
}

/**
 * Deletar arquivo do Storage
 * @param fullPath - Caminho completo do arquivo no Storage
 * @returns Resultado da operação
 */
export async function deleteFile(fullPath: string): Promise<ServiceResult<boolean>> {
  try {
    if (!fullPath || fullPath.trim() === '') {
      return {
        data: false,
        error: {
          code: 'invalid-argument',
          message: 'Caminho do arquivo é obrigatório.'
        },
        success: false
      };
    }

    const storageRef = ref(storage, fullPath);
    await deleteObject(storageRef);

    return { data: true, error: null, success: true };

  } catch (error) {
    console.error('Erro em deleteFile:', error);
    return {
      data: false,
      error: createStorageError(error, 'deletar arquivo'),
      success: false
    };
  }
}

/**
 * Listar arquivos de um usuário
 * @param uid - ID do usuário
 * @param path - Caminho específico (opcional)
 * @returns Lista de arquivos
 */
export async function listUserFiles(
  uid: string,
  path: string = ''
): Promise<ServiceResult<FileMetadata[]>> {
  try {
    if (!uid || uid.trim() === '') {
      return {
        data: null,
        error: {
          code: 'invalid-argument',
          message: 'ID do usuário é obrigatório.'
        },
        success: false
      };
    }

    const userPath = `users/${uid}${path ? `/${path}` : ''}`;
    const storageRef = ref(storage, userPath);
    const listResult = await listAll(storageRef);

    // Obter metadados e URLs de download para cada arquivo
    const filePromises = listResult.items.map(async (itemRef) => {
      const downloadURL = await getDownloadURL(itemRef);
      const metadata = await getMetadata(itemRef);
      
      return {
        name: itemRef.name,
        fullPath: itemRef.fullPath,
        size: metadata.size,
        downloadURL,
        timeCreated: metadata.timeCreated,
        contentType: metadata.contentType
      };
    });

    const files = await Promise.all(filePromises);

    return { data: files, error: null, success: true };

  } catch (error) {
    console.error('Erro em listUserFiles:', error);
    return {
      data: null,
      error: createStorageError(error, 'listar arquivos do usuário'),
      success: false
    };
  }
}

/**
 * Obter URL de download para um arquivo
 * @param fullPath - Caminho completo do arquivo
 * @returns URL de download
 */
export async function getFileDownloadURL(fullPath: string): Promise<ServiceResult<string>> {
  try {
    if (!fullPath || fullPath.trim() === '') {
      return {
        data: null,
        error: {
          code: 'invalid-argument',
          message: 'Caminho do arquivo é obrigatório.'
        },
        success: false
      };
    }

    const storageRef = ref(storage, fullPath);
    const downloadURL = await getDownloadURL(storageRef);

    return { data: downloadURL, error: null, success: true };

  } catch (error) {
    console.error('Erro em getFileDownloadURL:', error);
    return {
      data: null,
      error: createStorageError(error, 'obter URL de download'),
      success: false
    };
  }
}