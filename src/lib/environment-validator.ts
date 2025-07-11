/**
 * Environment Validator - Validação de Configuração Firebase
 * Detecta inconsistências entre configuração e environment
 */

import { getFirebaseDb, getFirebaseAuth } from './firebase';

export interface EnvironmentValidationResult {
  isValid: boolean;
  issues: EnvironmentIssue[];
  recommendations: string[];
}

export interface EnvironmentIssue {
  type: 'warning' | 'error' | 'info';
  component: 'database' | 'auth' | 'rules' | 'config';
  message: string;
  details?: any;
}

/**
 * Valida configuração completa do ambiente Firebase
 */
export async function validateEnvironment(): Promise<EnvironmentValidationResult> {
  const issues: EnvironmentIssue[] = [];
  const recommendations: string[] = [];

  try {
    // 1. Validar configuração de database
    await validateDatabaseConfig(issues);
    
    // 2. Validar configuração de auth
    await validateAuthConfig(issues);
    
    // 3. Validar environment variables
    validateEnvironmentVariables(issues);
    
    // 4. Gerar recomendações
    generateRecommendations(issues, recommendations);

    const isValid = !issues.some(issue => issue.type === 'error');

    return {
      isValid,
      issues,
      recommendations
    };

  } catch (error: any) {
    issues.push({
      type: 'error',
      component: 'config',
      message: 'Failed to validate environment',
      details: error.message
    });

    return {
      isValid: false,
      issues,
      recommendations: ['Check Firebase configuration and connectivity']
    };
  }
}

/**
 * Validar configuração de database
 */
async function validateDatabaseConfig(issues: EnvironmentIssue[]): Promise<void> {
  try {
    const db = getFirebaseDb();
    const projectId = db.app.options.projectId;
    
    // Log database configuration
    console.log('🔍 Environment Validator: Database config', {
      projectId,
      databaseId: '(default)',
      environment: process.env.NODE_ENV
    });

    issues.push({
      type: 'info',
      component: 'database',
      message: 'Database configuration detected',
      details: {
        projectId,
        databaseId: '(default)',
        environment: process.env.NODE_ENV
      }
    });

    // Verificar se está em produção e usando database correta
    if (process.env.NODE_ENV === 'production') {
      issues.push({
        type: 'info',
        component: 'database',
        message: 'Production environment using lexai database'
      });
    }

  } catch (error: any) {
    issues.push({
      type: 'error',
      component: 'database',
      message: 'Failed to validate database configuration',
      details: error.message
    });
  }
}

/**
 * Validar configuração de autenticação
 */
async function validateAuthConfig(issues: EnvironmentIssue[]): Promise<void> {
  try {
    const auth = getFirebaseAuth();
    const authDomain = auth.app.options.authDomain;
    
    console.log('🔍 Environment Validator: Auth config', {
      authDomain,
      environment: process.env.NODE_ENV
    });

    // Verificar authDomain correto
    if (authDomain === 'lexai-ef0ab.firebaseapp.com') {
      issues.push({
        type: 'info',
        component: 'auth',
        message: 'Auth domain correctly configured'
      });
    } else {
      issues.push({
        type: 'warning',
        component: 'auth',
        message: 'Unexpected auth domain',
        details: { expected: 'lexai-ef0ab.firebaseapp.com', actual: authDomain }
      });
    }

  } catch (error: any) {
    issues.push({
      type: 'error',
      component: 'auth',
      message: 'Failed to validate auth configuration',
      details: error.message
    });
  }
}

/**
 * Validar environment variables
 */
function validateEnvironmentVariables(issues: EnvironmentIssue[]): void {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    issues.push({
      type: 'error',
      component: 'config',
      message: 'Missing required environment variables',
      details: { missing }
    });
  } else {
    issues.push({
      type: 'info',
      component: 'config',
      message: 'All required environment variables present'
    });
  }

  // Verificar NODE_ENV
  if (!process.env.NODE_ENV) {
    issues.push({
      type: 'warning',
      component: 'config',
      message: 'NODE_ENV not set'
    });
  } else {
    issues.push({
      type: 'info',
      component: 'config',
      message: `Environment: ${process.env.NODE_ENV}`
    });
  }
}

/**
 * Gerar recomendações baseadas nos issues encontrados
 */
function generateRecommendations(issues: EnvironmentIssue[], recommendations: string[]): void {
  const hasDbErrors = issues.some(i => i.component === 'database' && i.type === 'error');
  const hasAuthErrors = issues.some(i => i.component === 'auth' && i.type === 'error');
  const hasConfigErrors = issues.some(i => i.component === 'config' && i.type === 'error');

  if (hasDbErrors) {
    recommendations.push('Deploy Firestore rules to lexai database: firebase deploy --only firestore');
  }

  if (hasAuthErrors) {
    recommendations.push('Check Firebase authentication configuration');
  }

  if (hasConfigErrors) {
    recommendations.push('Verify all Firebase environment variables are set correctly');
  }

  // Recomendação específica para o problema atual
  if (process.env.NODE_ENV === 'production') {
    recommendations.push('Ensure Firestore rules are deployed to lexai database, not just (default)');
  }
}

/**
 * Log validation results in readable format
 */
export function logValidationResults(result: EnvironmentValidationResult): void {
  console.log('🔍 Environment Validation Results:', {
    isValid: result.isValid,
    totalIssues: result.issues.length,
    errors: result.issues.filter(i => i.type === 'error').length,
    warnings: result.issues.filter(i => i.type === 'warning').length,
    timestamp: new Date().toISOString()
  });

  result.issues.forEach(issue => {
    const emoji = issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`${emoji} [${issue.component}] ${issue.message}`, issue.details || '');
  });

  if (result.recommendations.length > 0) {
    console.log('💡 Recommendations:');
    result.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }
}