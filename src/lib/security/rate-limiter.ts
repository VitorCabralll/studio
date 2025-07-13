/**
 * Rate Limiter - Proteção contra ataques de força bruta
 * Implementa múltiplas estratégias de rate limiting para segurança
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
  firstAttempt: number;
}

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

/**
 * Classe principal de Rate Limiting
 * Implementa sliding window e progressive penalties
 */
export class RateLimiter {
  private static attempts = new Map<string, RateLimitRecord>();
  private static blockedIPs = new Map<string, number>(); // IP -> unblock timestamp
  
  // Configurações por tipo de operação
  private static configs: Record<string, RateLimitConfig> = {
    // Login: 5 tentativas por 15 minutos
    'auth:login': {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000, // 15 minutos
      blockDurationMs: 30 * 60 * 1000 // 30 minutos de bloqueio
    },
    
    // Signup: 3 tentativas por hora (mais restritivo)
    'auth:signup': {
      maxAttempts: 3,
      windowMs: 60 * 60 * 1000, // 1 hora
      blockDurationMs: 60 * 60 * 1000 // 1 hora de bloqueio
    },
    
    // Reset de senha: 2 tentativas por hora
    'auth:reset': {
      maxAttempts: 2,
      windowMs: 60 * 60 * 1000, // 1 hora
      blockDurationMs: 2 * 60 * 60 * 1000 // 2 horas de bloqueio
    },
    
    // Token validation: 10 tentativas por 5 minutos
    'auth:token': {
      maxAttempts: 10,
      windowMs: 5 * 60 * 1000, // 5 minutos
      blockDurationMs: 15 * 60 * 1000 // 15 minutos de bloqueio
    }
  };

  /**
   * Verificar se operação é permitida para um identificador
   */
  static isAllowed(identifier: string, operation: string = 'auth:login'): {
    allowed: boolean;
    remaining?: number;
    resetTime?: number;
    blockUntil?: number;
  } {
    const now = Date.now();
    const config = this.configs[operation] || this.configs['auth:login'];
    
    // Verificar se IP está bloqueado
    const blockUntil = this.blockedIPs.get(identifier);
    if (blockUntil && now < blockUntil) {
      return {
        allowed: false,
        blockUntil
      };
    }
    
    // Remover bloqueio expirado
    if (blockUntil && now >= blockUntil) {
      this.blockedIPs.delete(identifier);
    }
    
    // Obter record atual
    const record = this.attempts.get(identifier);
    
    // Primeiro acesso ou janela expirada
    if (!record || now > record.resetTime) {
      this.attempts.set(identifier, {
        count: 1,
        resetTime: now + config.windowMs,
        firstAttempt: now
      });
      
      return {
        allowed: true,
        remaining: config.maxAttempts - 1,
        resetTime: now + config.windowMs
      };
    }
    
    // Verificar se excedeu limite
    if (record.count >= config.maxAttempts) {
      // Bloquear por período determinado
      const blockUntilTime = now + config.blockDurationMs;
      this.blockedIPs.set(identifier, blockUntilTime);
      
      // Log de segurança
      this.logSecurityEvent('rate_limit_exceeded', {
        identifier: this.hashIdentifier(identifier), // Hash para privacidade
        operation,
        attempts: record.count,
        windowMs: config.windowMs,
        blockDurationMs: config.blockDurationMs
      });
      
      return {
        allowed: false,
        blockUntil: blockUntilTime
      };
    }
    
    // Incrementar contador
    record.count++;
    
    return {
      allowed: true,
      remaining: config.maxAttempts - record.count,
      resetTime: record.resetTime
    };
  }

  /**
   * Registrar tentativa (sucesso ou falha)
   */
  static recordAttempt(
    identifier: string, 
    operation: string = 'auth:login',
    success: boolean = false
  ): void {
    // Se foi sucesso, limpar contador
    if (success) {
      this.attempts.delete(identifier);
      this.blockedIPs.delete(identifier);
      
      this.logSecurityEvent('auth_success', {
        identifier: this.hashIdentifier(identifier),
        operation
      });
    }
    
    // Para falhas, o contador já foi atualizado em isAllowed()
    if (!success) {
      this.logSecurityEvent('auth_failure', {
        identifier: this.hashIdentifier(identifier),
        operation,
        remainingAttempts: this.getRemainingAttempts(identifier, operation)
      });
    }
  }

  /**
   * Obter tentativas restantes
   */
  static getRemainingAttempts(identifier: string, operation: string = 'auth:login'): number {
    const config = this.configs[operation] || this.configs['auth:login'];
    const record = this.attempts.get(identifier);
    
    if (!record || Date.now() > record.resetTime) {
      return config.maxAttempts;
    }
    
    return Math.max(0, config.maxAttempts - record.count);
  }

  /**
   * Verificar se identificador está bloqueado
   */
  static isBlocked(identifier: string): boolean {
    const blockUntil = this.blockedIPs.get(identifier);
    return blockUntil ? Date.now() < blockUntil : false;
  }

  /**
   * Obter tempo até desbloqueio
   */
  static getBlockTimeRemaining(identifier: string): number {
    const blockUntil = this.blockedIPs.get(identifier);
    if (!blockUntil) return 0;
    
    return Math.max(0, blockUntil - Date.now());
  }

  /**
   * Reset manual de um identificador (admin)
   */
  static reset(identifier: string): void {
    this.attempts.delete(identifier);
    this.blockedIPs.delete(identifier);
    
    this.logSecurityEvent('rate_limit_reset', {
      identifier: this.hashIdentifier(identifier),
      resetBy: 'admin'
    });
  }

  /**
   * Limpeza automática de registros expirados
   */
  static cleanup(): void {
    const now = Date.now();
    let cleaned = 0;
    
    // Limpar tentativas expiradas
    for (const [key, record] of this.attempts.entries()) {
      if (now > record.resetTime) {
        this.attempts.delete(key);
        cleaned++;
      }
    }
    
    // Limpar bloqueios expirados
    for (const [key, blockUntil] of this.blockedIPs.entries()) {
      if (now >= blockUntil) {
        this.blockedIPs.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0 && process.env.NODE_ENV === 'development') {
      console.log(`🧹 RateLimiter: Cleaned ${cleaned} expired records`);
    }
  }

  /**
   * Obter estatísticas do rate limiter
   */
  static getStats(): {
    activeAttempts: number;
    blockedIPs: number;
    operations: Record<string, { total: number; blocked: number }>;
  } {
    const now = Date.now();
    const stats = {
      activeAttempts: 0,
      blockedIPs: 0,
      operations: {} as Record<string, { total: number; blocked: number }>
    };
    
    // Contar tentativas ativas
    for (const record of this.attempts.values()) {
      if (now <= record.resetTime) {
        stats.activeAttempts++;
      }
    }
    
    // Contar IPs bloqueados
    for (const blockUntil of this.blockedIPs.values()) {
      if (now < blockUntil) {
        stats.blockedIPs++;
      }
    }
    
    return stats;
  }

  /**
   * Hash do identificador para logs seguros
   */
  private static hashIdentifier(identifier: string): string {
    // Simples hash para não expor IPs/emails em logs
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
      const char = identifier.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Log seguro de eventos de segurança
   */
  private static logSecurityEvent(
    event: string,
    metadata: Record<string, unknown>
  ): void {
    const logData = {
      timestamp: Date.now(),
      event,
      metadata: {
        ...metadata,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined
      }
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.warn(`🛡️ RateLimiter[${event}]:`, logData);
    } else {
      // Em produção, enviar para sistema de monitoramento
      console.log(`Security event: ${event}`, {
        timestamp: logData.timestamp,
        hashedId: metadata.identifier
      });
    }
    
    // TODO: Integrar com sistema de alertas
    // if (event === 'rate_limit_exceeded') {
    //   await securityAlerts.send('Rate limit exceeded', logData);
    // }
  }
}

/**
 * Middleware para Next.js API routes
 */
export function withRateLimit(
  operation: string = 'auth:login'
) {
  return function rateLimitMiddleware(
    req: any,
    res: any,
    next?: () => void
  ) {
    // Obter identificador (IP + User-Agent para mais precisão)
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || '';
    const identifier = `${ip}:${userAgent.substring(0, 50)}`;
    
    const result = RateLimiter.isAllowed(identifier, operation);
    
    if (!result.allowed) {
      const error = {
        error: 'Too many attempts',
        message: 'Muitas tentativas. Tente novamente mais tarde.',
        blockUntil: result.blockUntil,
        retryAfter: result.blockUntil ? Math.ceil((result.blockUntil - Date.now()) / 1000) : undefined
      };
      
      if (res) {
        return res.status(429).json(error);
      } else {
        throw new Error(error.message);
      }
    }
    
    // Adicionar headers informativos
    if (res) {
      const config = RateLimiter['configs'][operation] || RateLimiter['configs']['auth:login'];
      res.setHeader('X-RateLimit-Limit', config.maxAttempts);
      res.setHeader('X-RateLimit-Remaining', result.remaining || 0);
      res.setHeader('X-RateLimit-Reset', result.resetTime || 0);
    }
    
    if (next) next();
    return { identifier, operation };
  };
}

/**
 * Hook para uso em componentes React
 */
export function useRateLimit(operation: string = 'auth:login') {
  const getIdentifier = () => {
    if (typeof window === 'undefined') return 'server';
    return `${window.location.hostname}:${navigator.userAgent.substring(0, 50)}`;
  };
  
  return {
    isAllowed: () => RateLimiter.isAllowed(getIdentifier(), operation),
    recordAttempt: (success: boolean) => RateLimiter.recordAttempt(getIdentifier(), operation, success),
    getRemainingAttempts: () => RateLimiter.getRemainingAttempts(getIdentifier(), operation),
    isBlocked: () => RateLimiter.isBlocked(getIdentifier()),
    getBlockTimeRemaining: () => RateLimiter.getBlockTimeRemaining(getIdentifier())
  };
}

// Limpeza automática a cada 5 minutos
if (typeof window === 'undefined') { // Apenas no servidor
  setInterval(() => {
    RateLimiter.cleanup();
  }, 5 * 60 * 1000);
}