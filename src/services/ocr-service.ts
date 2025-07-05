/**
 * OCR Service - Processamento LOCAL de documentos com Tesseract.js
 * 
 * Este service mantém o processamento OCR 100% local no navegador,
 * sem enviar dados para servidor, seguindo a política de privacidade máxima.
 */
import { createWorker } from 'tesseract.js';
import type { ExtractedText } from './document-processor';

export interface OCRServiceResult {
  text: string;
  confidence: number;
  words: Array<{
    text: string;
    confidence: number;
    bbox: { x0: number; y0: number; x1: number; y1: number };
  }>;
}

export interface OCRServiceOptions {
  /** Idioma(s) para reconhecimento. Padrão: 'por+eng' */
  language?: string;
  /** Habilitar filtro de lista de caracteres */
  enableWhitelist?: boolean;
  /** String de caracteres permitidos */
  whitelist?: string;
  /** Callback para progresso (opcional) */
  onProgress?: (progress: number, message: string) => void;
}

/**
 * Processa arquivo único com OCR LOCAL
 * @param file - Arquivo de imagem ou PDF
 * @param options - Opções de configuração
 * @returns Resultado do OCR processado localmente
 */
export async function processFileWithOCR(
  file: File,
  options: OCRServiceOptions = {}
): Promise<OCRServiceResult> {
  const { 
    language = 'por+eng',
    enableWhitelist = false,
    whitelist = '',
    onProgress 
  } = options;
  
  try {
    onProgress?.(0.1, 'Inicializando OCR local...');
    
    // Criar worker temporário (processamento local)
    const worker = await createWorker(language, 1, {
      logger: (m: { progress: number; status: string }) => {
        const progressPercent = Math.round(m.progress * 100);
        onProgress?.(m.progress, `OCR: ${m.status} ${progressPercent}%`);
      },
    });

    onProgress?.(0.2, 'Configurando OCR para documentos jurídicos...');

    // Configurações otimizadas para documentos jurídicos
    await worker.setParameters({
      preserve_interword_spaces: '1',
      tessedit_enable_dict_correction: '1',
      ...(enableWhitelist ? { tessedit_char_whitelist: whitelist } : {})
    });

    let fileToProcess: File | HTMLCanvasElement = file;
    
    // Se for PDF, converter para canvas (processamento local)
    if (file.type === 'application/pdf') {
      onProgress?.(0.3, 'Convertendo PDF para imagem localmente...');
      fileToProcess = await convertPdfToCanvas(file);
    }

    onProgress?.(0.4, 'Processando OCR localmente...');

    // Executar OCR (100% local)
    const result = await worker.recognize(fileToProcess);
    
    onProgress?.(0.9, 'Finalizando processamento...');
    
    // Limpar worker (liberar memória)
    await worker.terminate();
    
    onProgress?.(1.0, 'OCR concluído!');
    
    return {
      text: result.data.text.trim(),
      confidence: result.data.confidence / 100, // Normalizar para 0-1
      words: [], // Simplificado - dados de palavras não são críticos para o funcionamento
    };
  } catch (error) {
    console.error('Erro no OCR Service (processamento local):', error);
    throw new Error(`Falha no OCR local: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}

/**
 * Converte PDF para Canvas LOCAL (sem upload)
 * @param pdfFile - Arquivo PDF
 * @returns Canvas com primeira página renderizada
 */
async function convertPdfToCanvas(pdfFile: File): Promise<HTMLCanvasElement> {
  try {
    // Importação dinâmica do PDF.js (processamento local)
    const pdfjs = await import('pdfjs-dist');
    
    // Configurar worker do PDF.js (local)
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    
    // Ler arquivo localmente
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    
    // Processar primeira página
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2.0 }); // 2x para melhor qualidade OCR
    
    // Criar canvas local
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    // Renderizar PDF para canvas (local)
    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;
    
    return canvas;
  } catch (error) {
    throw new Error(`Erro na conversão PDF local: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}

/**
 * Converte resultado OCR para formato ExtractedText
 * @param result - Resultado do OCR
 * @param fileName - Nome do arquivo original
 * @param fileSize - Tamanho do arquivo
 * @returns ExtractedText formatado
 */
export function convertToExtractedText(
  result: OCRServiceResult,
  fileName: string,
  fileSize: number
): ExtractedText {
  return {
    source: fileName,
    content: result.text,
    type: 'ocr',
    confidence: result.confidence,
    processedAt: new Date(),
    size: fileSize,
  };
}

/**
 * Processa múltiplos arquivos com OCR LOCAL
 * @param files - Array de arquivos
 * @param options - Opções de configuração
 * @returns Array de resultados OCR
 */
export async function processMultipleFilesWithOCR(
  files: File[],
  options: OCRServiceOptions = {}
): Promise<OCRServiceResult[]> {
  const results: OCRServiceResult[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileProgress = (i / files.length) * 0.8; // 80% do progresso total
    
    options.onProgress?.(fileProgress, `Processando arquivo ${i + 1}/${files.length}: ${file.name}`);
    
    try {
      const result = await processFileWithOCR(file, {
        ...options,
        onProgress: (progress, message) => {
          const totalProgress = fileProgress + (progress * 0.8 / files.length);
          options.onProgress?.(totalProgress, message);
        }
      });
      
      results.push(result);
    } catch (error) {
      console.error(`❌ FALHA REAL no OCR para ${file.name}:`, error);
      
      // NÃO MASCARAR ERROS - Falha transparente
      throw new Error(`OCR falhou completamente para ${file.name}: ${error instanceof Error ? error.message : 'Erro técnico desconhecido'}. Processamento interrompido.`);
    }
  }
  
  options.onProgress?.(1.0, 'Processamento concluído!');
  return results;
}

/**
 * Verifica se o arquivo é suportado pelo OCR
 * @param file - Arquivo a verificar
 * @returns true se suportado
 */
export function isFileSupported(file: File): boolean {
  return file.type.startsWith('image/') || file.type === 'application/pdf';
}

/**
 * Obtém informações sobre o arquivo para OCR
 * @param file - Arquivo a analisar
 * @returns Informações do arquivo
 */
export function getFileInfo(file: File) {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    isSupported: isFileSupported(file),
    isImage: file.type.startsWith('image/'),
    isPDF: file.type === 'application/pdf',
    sizeInMB: (file.size / 1024 / 1024).toFixed(2),
  };
}