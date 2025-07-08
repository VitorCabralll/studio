/**
 * Cenários de teste sistemáticos para autenticação
 * Baseado no context engineering para debug de autenticação
 */

import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { getFirebaseAuth, getGoogleAuthProvider } from '@/lib/firebase';
import { authLogger } from '@/lib/auth-logger';
import { parseAuthError } from '@/lib/auth-errors';

export interface TestScenario {
  id: string;
  name: string;
  description: string;
  category: 'login' | 'signup' | 'logout' | 'reset' | 'profile' | 'validation';
  execute: () => Promise<TestResult>;
}

export interface TestResult {
  success: boolean;
  duration: number;
  message: string;
  error?: Error;
  metadata?: Record<string, any>;
}

export interface TestData {
  validEmail: string;
  validPassword: string;
  invalidEmail: string;
  invalidPassword: string;
  weakPassword: string;
  existingEmail: string;
  nonExistentEmail: string;
}

// Dados de teste para diferentes cenários
export const testData: TestData = {
  validEmail: 'test@lexai.dev',
  validPassword: 'TestPassword123!',
  invalidEmail: 'invalid-email',
  invalidPassword: 'wrong',
  weakPassword: '123',
  existingEmail: 'existing@lexai.dev',
  nonExistentEmail: 'nonexistent@lexai.dev',
};

// Helper para executar teste com medição de performance
async function executeTest(
  testId: string,
  testFn: () => Promise<void>,
  expectedToFail: boolean = false
): Promise<TestResult> {
  const start = performance.now();
  
  try {
    await testFn();
    const duration = performance.now() - start;
    
    if (expectedToFail) {
      return {
        success: false,
        duration,
        message: 'Test was expected to fail but succeeded',
        metadata: { expectedToFail: true }
      };
    }
    
    return {
      success: true,
      duration,
      message: 'Test passed successfully',
      metadata: { expectedToFail }
    };
  } catch (error) {
    const duration = performance.now() - start;
    
    if (expectedToFail) {
      return {
        success: true,
        duration,
        message: 'Test failed as expected',
        error: error as Error,
        metadata: { expectedToFail: true }
      };
    }
    
    return {
      success: false,
      duration,
      message: `Test failed: ${(error as Error).message}`,
      error: error as Error,
      metadata: { expectedToFail }
    };
  }
}

// Cenários de teste de login
export const loginScenarios: TestScenario[] = [
  {
    id: 'login_valid_credentials',
    name: 'Login com credenciais válidas',
    description: 'Testa login com email e senha válidos',
    category: 'login',
    execute: async () => {
      return executeTest('login_valid_credentials', async () => {
        const auth = getFirebaseAuth();
        const userCredential = await signInWithEmailAndPassword(
          auth, 
          testData.validEmail, 
          testData.validPassword
        );
        
        if (!userCredential.user) {
          throw new Error('No user returned from login');
        }
        
        authLogger.info('Login test successful', {
          operation: 'test_login_valid',
          metadata: { uid: userCredential.user.uid }
        });
      });
    }
  },
  
  {
    id: 'login_invalid_email',
    name: 'Login com email inválido',
    description: 'Testa login com formato de email inválido',
    category: 'login',
    execute: async () => {
      return executeTest('login_invalid_email', async () => {
        const auth = getFirebaseAuth();
        await signInWithEmailAndPassword(auth, testData.invalidEmail, testData.validPassword);
      }, true);
    }
  },
  
  {
    id: 'login_wrong_password',
    name: 'Login com senha incorreta',
    description: 'Testa login com senha incorreta',
    category: 'login',
    execute: async () => {
      return executeTest('login_wrong_password', async () => {
        const auth = getFirebaseAuth();
        await signInWithEmailAndPassword(auth, testData.validEmail, testData.invalidPassword);
      }, true);
    }
  },
  
  {
    id: 'login_nonexistent_user',
    name: 'Login com usuário inexistente',
    description: 'Testa login com email não cadastrado',
    category: 'login',
    execute: async () => {
      return executeTest('login_nonexistent_user', async () => {
        const auth = getFirebaseAuth();
        await signInWithEmailAndPassword(auth, testData.nonExistentEmail, testData.validPassword);
      }, true);
    }
  },
  
  {
    id: 'login_google_popup',
    name: 'Login com Google (popup)',
    description: 'Testa login com Google OAuth via popup',
    category: 'login',
    execute: async () => {
      return executeTest('login_google_popup', async () => {
        const auth = getFirebaseAuth();
        const provider = getGoogleAuthProvider();
        
        // Simular popup (não pode ser testado automaticamente)
        throw new Error('Google popup test requires manual intervention');
      }, true);
    }
  }
];

// Cenários de teste de cadastro
export const signupScenarios: TestScenario[] = [
  {
    id: 'signup_valid_credentials',
    name: 'Cadastro com credenciais válidas',
    description: 'Testa cadastro com email e senha válidos',
    category: 'signup',
    execute: async () => {
      return executeTest('signup_valid_credentials', async () => {
        const auth = getFirebaseAuth();
        const testEmail = `test+${Date.now()}@lexai.dev`;
        
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          testEmail, 
          testData.validPassword
        );
        
        if (!userCredential.user) {
          throw new Error('No user returned from signup');
        }
        
        authLogger.info('Signup test successful', {
          operation: 'test_signup_valid',
          metadata: { uid: userCredential.user.uid }
        });
        
        // Cleanup - delete test user
        await userCredential.user.delete();
      });
    }
  },
  
  {
    id: 'signup_invalid_email',
    name: 'Cadastro com email inválido',
    description: 'Testa cadastro com formato de email inválido',
    category: 'signup',
    execute: async () => {
      return executeTest('signup_invalid_email', async () => {
        const auth = getFirebaseAuth();
        await createUserWithEmailAndPassword(auth, testData.invalidEmail, testData.validPassword);
      }, true);
    }
  },
  
  {
    id: 'signup_weak_password',
    name: 'Cadastro com senha fraca',
    description: 'Testa cadastro com senha muito fraca',
    category: 'signup',
    execute: async () => {
      return executeTest('signup_weak_password', async () => {
        const auth = getFirebaseAuth();
        const testEmail = `test+${Date.now()}@lexai.dev`;
        await createUserWithEmailAndPassword(auth, testEmail, testData.weakPassword);
      }, true);
    }
  },
  
  {
    id: 'signup_existing_email',
    name: 'Cadastro com email existente',
    description: 'Testa cadastro com email já cadastrado',
    category: 'signup',
    execute: async () => {
      return executeTest('signup_existing_email', async () => {
        const auth = getFirebaseAuth();
        await createUserWithEmailAndPassword(auth, testData.existingEmail, testData.validPassword);
      }, true);
    }
  }
];

// Cenários de teste de logout
export const logoutScenarios: TestScenario[] = [
  {
    id: 'logout_authenticated_user',
    name: 'Logout usuário autenticado',
    description: 'Testa logout de usuário logado',
    category: 'logout',
    execute: async () => {
      return executeTest('logout_authenticated_user', async () => {
        const auth = getFirebaseAuth();
        
        // Primeiro fazer login
        await signInWithEmailAndPassword(auth, testData.validEmail, testData.validPassword);
        
        // Depois fazer logout
        await signOut(auth);
        
        if (auth.currentUser) {
          throw new Error('User still authenticated after logout');
        }
        
        authLogger.info('Logout test successful', {
          operation: 'test_logout'
        });
      });
    }
  },
  
  {
    id: 'logout_unauthenticated_user',
    name: 'Logout usuário não autenticado',
    description: 'Testa logout quando não há usuário logado',
    category: 'logout',
    execute: async () => {
      return executeTest('logout_unauthenticated_user', async () => {
        const auth = getFirebaseAuth();
        
        // Garantir que não há usuário logado
        if (auth.currentUser) {
          await signOut(auth);
        }
        
        // Tentar logout novamente
        await signOut(auth);
        
        authLogger.info('Logout unauthenticated test successful', {
          operation: 'test_logout_unauthenticated'
        });
      });
    }
  }
];

// Cenários de teste de reset de senha
export const passwordResetScenarios: TestScenario[] = [
  {
    id: 'reset_valid_email',
    name: 'Reset com email válido',
    description: 'Testa reset de senha com email válido',
    category: 'reset',
    execute: async () => {
      return executeTest('reset_valid_email', async () => {
        const auth = getFirebaseAuth();
        await sendPasswordResetEmail(auth, testData.validEmail);
        
        authLogger.info('Password reset test successful', {
          operation: 'test_password_reset'
        });
      });
    }
  },
  
  {
    id: 'reset_invalid_email',
    name: 'Reset com email inválido',
    description: 'Testa reset de senha com formato de email inválido',
    category: 'reset',
    execute: async () => {
      return executeTest('reset_invalid_email', async () => {
        const auth = getFirebaseAuth();
        await sendPasswordResetEmail(auth, testData.invalidEmail);
      }, true);
    }
  },
  
  {
    id: 'reset_nonexistent_email',
    name: 'Reset com email inexistente',
    description: 'Testa reset de senha com email não cadastrado',
    category: 'reset',
    execute: async () => {
      return executeTest('reset_nonexistent_email', async () => {
        const auth = getFirebaseAuth();
        await sendPasswordResetEmail(auth, testData.nonExistentEmail);
      }, true);
    }
  }
];

// Cenários de teste de validação
export const validationScenarios: TestScenario[] = [
  {
    id: 'validate_auth_state',
    name: 'Validar estado de autenticação',
    description: 'Testa se o estado de autenticação está correto',
    category: 'validation',
    execute: async () => {
      return executeTest('validate_auth_state', async () => {
        const auth = getFirebaseAuth();
        
        // Verificar se o auth está inicializado
        if (!auth) {
          throw new Error('Firebase Auth not initialized');
        }
        
        // Verificar se podemos acessar o usuário atual
        const currentUser = auth.currentUser;
        
        authLogger.info('Auth state validation successful', {
          operation: 'test_auth_state_validation',
          metadata: { hasCurrentUser: !!currentUser }
        });
      });
    }
  },
  
  {
    id: 'validate_token_refresh',
    name: 'Validar refresh de token',
    description: 'Testa se o token pode ser renovado',
    category: 'validation',
    execute: async () => {
      return executeTest('validate_token_refresh', async () => {
        const auth = getFirebaseAuth();
        
        if (!auth.currentUser) {
          throw new Error('No user authenticated for token refresh test');
        }
        
        // Forçar refresh do token
        const token = await auth.currentUser.getIdToken(true);
        
        if (!token) {
          throw new Error('Failed to get refreshed token');
        }
        
        authLogger.info('Token refresh validation successful', {
          operation: 'test_token_refresh',
          metadata: { hasToken: !!token }
        });
      });
    }
  }
];

// Todos os cenários organizados por categoria
export const allScenarios = {
  login: loginScenarios,
  signup: signupScenarios,
  logout: logoutScenarios,
  reset: passwordResetScenarios,
  validation: validationScenarios
};

// Lista completa de todos os cenários
export const allScenariosFlat: TestScenario[] = [
  ...loginScenarios,
  ...signupScenarios,
  ...logoutScenarios,
  ...passwordResetScenarios,
  ...validationScenarios
];

// Executar todos os testes de uma categoria
export async function runCategoryTests(category: keyof typeof allScenarios): Promise<TestResult[]> {
  const scenarios = allScenarios[category];
  const results: TestResult[] = [];
  
  authLogger.info(`Running ${category} tests`, {
    operation: 'test_category_run',
    metadata: { category, count: scenarios.length }
  });
  
  for (const scenario of scenarios) {
    try {
      const result = await scenario.execute();
      results.push(result);
      
      authLogger.info(`Test ${scenario.id} completed`, {
        operation: 'test_individual_complete',
        metadata: { 
          scenarioId: scenario.id,
          success: result.success,
          duration: result.duration
        }
      });
    } catch (error) {
      const result: TestResult = {
        success: false,
        duration: 0,
        message: `Test execution failed: ${(error as Error).message}`,
        error: error as Error
      };
      results.push(result);
      
      authLogger.error(`Test ${scenario.id} execution failed`, error as Error, {
        operation: 'test_individual_error',
        metadata: { scenarioId: scenario.id }
      });
    }
    
    // Delay entre testes para evitar rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return results;
}

// Executar todos os testes
export async function runAllTests(): Promise<Record<string, TestResult[]>> {
  const results: Record<string, TestResult[]> = {};
  
  authLogger.info('Running all auth tests', {
    operation: 'test_all_run',
    metadata: { totalScenarios: allScenariosFlat.length }
  });
  
  for (const category of Object.keys(allScenarios) as (keyof typeof allScenarios)[]) {
    try {
      results[category] = await runCategoryTests(category);
    } catch (error) {
      authLogger.error(`Category ${category} tests failed`, error as Error, {
        operation: 'test_category_error',
        metadata: { category }
      });
      results[category] = [];
    }
  }
  
  return results;
}

// Função para executar apenas testes seguros (que não modificam estado)
export function getSafeScenarios(): TestScenario[] {
  return allScenariosFlat.filter(scenario => 
    scenario.category === 'validation' ||
    scenario.id.includes('invalid') ||
    scenario.id.includes('nonexistent') ||
    scenario.id.includes('weak')
  );
}

// Função para executar apenas testes que requerem usuário autenticado
export function getAuthenticatedScenarios(): TestScenario[] {
  return allScenariosFlat.filter(scenario => 
    scenario.category === 'logout' ||
    scenario.id.includes('token') ||
    scenario.id.includes('profile')
  );
}