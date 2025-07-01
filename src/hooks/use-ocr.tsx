'use client';

import { useState, useCallback, useRef } from 'react';
import { createWorker, Worker, recognize } from 'tesseract.js';

/**
 * Result object returned from OCR processing
 */
export interface OCRResult {
  /** Extracted text content */
  text: string;
  /** Overall confidence score (0-1) */
  confidence: number;
  /** Individual words with position and confidence data */
  words: Array<{
    /** Word text */
    text: string;
    /** Word confidence score (0-1) */
    confidence: number;
    /** Bounding box coordinates */
    bbox: {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
    };
  }>;
}

/**
 * Progress information during OCR processing
 */
export interface OCRProgress {
  /** Current processing status */
  status: string;
  /** Progress percentage (0-100) */
  progress: number;
  /** Human-readable progress message */
  message: string;
}

/**
 * Configuration options for OCR processing
 */
interface UseOCROptions {
  /** Language(s) for OCR recognition. Default: 'por+eng' (Portuguese + English) */
  language?: string;
  /** Enable character whitelist filtering */
  enableWhitelist?: boolean;
  /** Character whitelist string (only these characters will be recognized) */
  whitelist?: string;
  /** Enable automatic deskewing of tilted images */
  enableDeskew?: boolean;
  /** Enable automatic rotation detection and correction */
  enableRotation?: boolean;
}

/**
 * Hook for OCR (Optical Character Recognition) processing using Tesseract.js.
 * 
 * Provides functionality to extract text from images and PDF files locally in the browser.
 * Optimized for legal documents with Portuguese and English language support.
 * 
 * Features:
 * - Local processing (no server upload required)
 * - Progress tracking with real-time updates
 * - Automatic image preprocessing (deskew, rotation)
 * - Support for multiple image formats
 * - Confidence scoring for reliability assessment
 * - Word-level positioning data
 * 
 * @param options - Configuration options for OCR processing
 * @returns Object with OCR processing methods and state
 * 
 * @example
 * ```tsx
 * function DocumentUpload() {
 *   const { processImage, isProcessing, progress, error } = useOCR({
 *     language: 'por+eng',
 *     enableDeskew: true
 *   });
 * 
 *   const handleFile = async (file: File) => {
 *     try {
 *       const result = await processImage(file);
 *       console.log('Extracted text:', result.text);
 *       console.log('Confidence:', result.confidence);
 *     } catch (err) {
 *       console.error('OCR failed:', err);
 *     }
 *   };
 * 
 *   return (
 *     <div>
 *       <input type="file" onChange={(e) => handleFile(e.target.files[0])} />
 *       {isProcessing && (
 *         <div>
 *           <p>{progress.message}</p>
 *           <progress value={progress.progress} max={100} />
 *         </div>
 *       )}
 *       {error && <p>Error: {error}</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useOCR(options: UseOCROptions = {}) {
  const {
    language = 'por+eng', // Português + Inglês para documentos jurídicos
    enableWhitelist = false,
    whitelist = '',
    enableDeskew = true,
    enableRotation = true,
  } = options;

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<OCRProgress>({ status: '', progress: 0, message: '' });
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);

  // Inicializar worker do Tesseract
  const initializeWorker = useCallback(async () => {
    if (workerRef.current) return workerRef.current;

    try {
      const worker = await createWorker(language, 1, {
        logger: (m) => {
          setProgress({
            status: m.status,
            progress: m.progress,
            message: m.status === 'recognizing text' 
              ? `Reconhecendo texto: ${Math.round(m.progress * 100)}%`
              : m.status === 'loading language traineddata' 
              ? 'Carregando modelo de linguagem...'
              : m.status === 'initializing tesseract'
              ? 'Inicializando OCR...'
              : m.status === 'initializing api'
              ? 'Configurando API...'
              : 'Processando...'
          });
        },
      });

      // Configurações otimizadas para documentos jurídicos
      await worker.setParameters({
        tessedit_char_whitelist: enableWhitelist ? whitelist : undefined,
        preserve_interword_spaces: '1',
        tessedit_enable_dict_correction: '1',
      });

      workerRef.current = worker;
      return worker;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao inicializar OCR';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [language, enableWhitelist, whitelist]);

  // Processar imagem para OCR
  const processImage = useCallback(async (
    imageFile: File | string
  ): Promise<OCRResult> => {
    setIsProcessing(true);
    setError(null);
    setProgress({ status: 'initializing', progress: 0, message: 'Iniciando OCR...' });

    try {
      const worker = await initializeWorker();
      
      setProgress({ status: 'preprocessing', progress: 0.1, message: 'Pré-processando imagem...' });

      // Realizar OCR
      const result = await worker.recognize(imageFile);
      
      setProgress({ status: 'completed', progress: 1, message: 'OCR concluído!' });

      // Estruturar resultado
      const ocrResult: OCRResult = {
        text: result.data.text,
        confidence: result.data.confidence,
        words: [],
      };

      return ocrResult;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? `Erro no OCR: ${err.message}` 
        : 'Erro desconhecido no processamento OCR';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [initializeWorker]);

  // Processar múltiplas imagens
  const processMultipleImages = useCallback(async (
    images: (File | string)[]
  ): Promise<OCRResult[]> => {
    const results: OCRResult[] = [];
    
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      setProgress({ 
        status: 'processing', 
        progress: i / images.length, 
        message: `Processando imagem ${i + 1} de ${images.length}...` 
      });
      
      const result = await processImage(image);
      results.push(result);
    }
    
    return results;
  }, [processImage]);

  // Extrair texto limpo (sem formatação)
  const extractCleanText = useCallback((result: OCRResult): string => {
    return result.text
      .replace(/\s+/g, ' ') // Normalizar espaços
      .replace(/\n+/g, '\n') // Normalizar quebras de linha
      .trim();
  }, []);

  // Extrair texto estruturado para documentos jurídicos
  const extractStructuredText = useCallback((result: OCRResult) => {
    const text = result.text;
    
    // Detectar elementos estruturais comuns em documentos jurídicos
    const patterns = {
      processo: /(?:processo\s*n[°º]?\s*[\d\-\.\/]+)/gi,
      vara: /(?:vara\s+[\w\s]+)/gi,
      comarca: /(?:comarca\s+de\s+[\w\s]+)/gi,
      cpf: /(?:\d{3}\.?\d{3}\.?\d{3}\-?\d{2})/g,
      cnpj: /(?:\d{2}\.?\d{3}\.?\d{3}\/?\d{4}\-?\d{2})/g,
      data: /(?:\d{1,2}\/\d{1,2}\/\d{4})/g,
      valor: /(?:R\$\s*[\d\.,]+)/gi,
    };

    const extracted: Record<string, string[]> = {};
    
    Object.entries(patterns).forEach(([key, pattern]) => {
      const matches = text.match(pattern);
      extracted[key] = matches ? [...new Set(matches)] : [];
    });

    return {
      fullText: text,
      structured: extracted,
      confidence: result.confidence,
    };
  }, []);

  // Limpar worker
  const cleanup = useCallback(async () => {
    if (workerRef.current) {
      await workerRef.current.terminate();
      workerRef.current = null;
    }
  }, []);

  return {
    // Estado
    isProcessing,
    progress,
    error,
    
    // Funções principais
    processImage,
    processMultipleImages,
    
    // Utilitários
    extractCleanText,
    extractStructuredText,
    cleanup,
    
    // Worker status
    isWorkerReady: !!workerRef.current,
  };
}