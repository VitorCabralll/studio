/**
 * Utilitário para operações de clipboard com fallback
 * Trata erros de permissão e fornece alternativas quando necessário
 */

export interface ClipboardResult {
  success: boolean;
  error?: string;
  fallbackUsed?: boolean;
}

/**
 * Copia texto para o clipboard com tratamento robusto de erros
 * @param text - Texto a ser copiado
 * @param announceFunction - Função opcional para anunciar o resultado
 * @returns Promise com resultado da operação
 */
export async function copyToClipboard(
  text: string, 
  announceFunction?: (message: string) => void
): Promise<ClipboardResult> {
  // Verificar se o Clipboard API está disponível
  if (!navigator?.clipboard?.writeText) {
    return fallbackCopy(text, announceFunction);
  }

  try {
    await navigator.clipboard.writeText(text);
    announceFunction?.('Texto copiado para a área de transferência!');
    return { success: true };
  } catch (error) {
    console.warn('Clipboard API falhou:', error);
    
    // Tratar erros específicos
    if (error instanceof Error) {
      if (error.name === 'NotAllowedError') {
        announceFunction?.('Permissão de clipboard negada. Usando método alternativo...');
        return fallbackCopy(text, announceFunction);
      }
      
      if (error.name === 'SecurityError') {
        announceFunction?.('Erro de segurança. Verifique se está em HTTPS ou localhost.');
        return fallbackCopy(text, announceFunction);
      }
    }
    
    // Para outros erros, tentar fallback
    return fallbackCopy(text, announceFunction);
  }
}

/**
 * Método de fallback usando elemento textarea temporário
 * @param text - Texto a ser copiado
 * @param announceFunction - Função opcional para anunciar o resultado
 * @returns Resultado da operação
 */
function fallbackCopy(
  text: string, 
  announceFunction?: (message: string) => void
): ClipboardResult {
  try {
    // Criar elemento textarea temporário
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    // Tentar usar execCommand (método legado)
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    
    if (successful) {
      announceFunction?.('Texto copiado usando método alternativo!');
      return { success: true, fallbackUsed: true };
    } else {
      announceFunction?.('Não foi possível copiar automaticamente. Selecione e copie manualmente (Ctrl+C).');
      return { 
        success: false, 
        error: 'Fallback copy failed',
        fallbackUsed: true 
      };
    }
  } catch (error) {
    console.error('Fallback copy error:', error);
    announceFunction?.('Erro ao copiar. Tente selecionar e copiar manualmente (Ctrl+C).');
    return { 
      success: false, 
      error: 'Fallback copy failed',
      fallbackUsed: true 
    };
  }
}

/**
 * Verifica se o Clipboard API está disponível
 * @returns true se disponível, false caso contrário
 */
export function isClipboardAPIAvailable(): boolean {
  return !!(navigator?.clipboard?.writeText);
}

/**
 * Verifica se o contexto atual permite uso do clipboard
 * (HTTPS ou localhost)
 * @returns true se o contexto é seguro, false caso contrário
 */
export function isSecureContext(): boolean {
  return window.isSecureContext || window.location.hostname === 'localhost';
}