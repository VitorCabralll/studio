import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken, isAdminConfigured } from '@/lib/firebase-admin';
import { withApiSecurity, handleOptionsRequest } from '@/lib/api-security';
import { authLogger } from '@/lib/auth-logger';
import { reportSecurity } from '@/lib/monitoring';

async function postHandler(request: NextRequest) {
  const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  try {
    // Verificar se Admin SDK está configurado
    if (!isAdminConfigured()) {
      authLogger.error('Firebase Admin SDK not configured', new Error('Admin SDK not configured'), {
        context: 'admin-verify-api',
        operation: 'admin_sdk_check',
        metadata: { clientIP, userAgent },
      });
      
      return NextResponse.json(
        { 
          error: 'Firebase Admin SDK não configurado',
          success: false 
        },
        { status: 500 }
      );
    }

    // Obter token do header Authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      authLogger.error('Missing or invalid authorization header', new Error('No auth header'), {
        context: 'admin-verify-api',
        operation: 'auth_header_validation',
        metadata: { 
          clientIP, 
          userAgent,
          hasAuthHeader: !!authHeader,
          authHeaderFormat: authHeader ? authHeader.substring(0, 10) + '...' : 'none'
        },
      });
      
      reportSecurity('Missing authorization header in admin verify', {
        component: 'admin-verify-api',
        metadata: { clientIP, userAgent },
      });
      
      return NextResponse.json(
        { 
          error: 'Token de autorização não fornecido',
          success: false 
        },
        { status: 401 }
      );
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    // Verificar token usando Firebase Admin
    const result = await verifyIdToken(idToken);
    
    if (!result.success) {
      authLogger.error('Token verification failed', result.error || new Error('Token verification failed'), {
        context: 'admin-verify-api',
        operation: 'token_verification',
        metadata: { 
          clientIP, 
          userAgent,
          tokenLength: idToken.length,
          errorMessage: result.error?.message
        },
      });
      
      reportSecurity('Failed token verification attempt', {
        component: 'admin-verify-api',
        metadata: { clientIP, userAgent, error: result.error?.message },
      });
      
      return NextResponse.json(
        { 
          error: result.error?.message || 'Token inválido',
          success: false 
        },
        { status: 401 }
      );
    }

    // Token válido - log de sucesso
    authLogger.info('Admin token verification successful', {
      context: 'admin-verify-api',
      operation: 'token_verification_success',
      userId: result.data.uid,
      metadata: { 
        clientIP, 
        userAgent,
        email: result.data.email,
        emailVerified: result.data.email_verified
      },
    });

    // Token válido - retornar dados do usuário
    return NextResponse.json({
      success: true,
      user: {
        uid: result.data.uid,
        email: result.data.email,
        email_verified: result.data.email_verified,
        claims: result.data.claims || {}
      }
    });

  } catch (error) {
    authLogger.error('Unexpected error in admin verify', error as Error, {
      context: 'admin-verify-api',
      operation: 'unexpected_error',
      metadata: { clientIP, userAgent },
    });
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        success: false 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return withApiSecurity(request, postHandler);
}

async function getHandler(request: NextRequest) {
  const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  
  authLogger.info('Admin API status check', {
    context: 'admin-verify-api',
    operation: 'status_check',
    metadata: { clientIP, configured: isAdminConfigured() },
  });
  
  return NextResponse.json({
    status: 'Firebase Admin API',
    configured: isAdminConfigured(),
    timestamp: new Date().toISOString()
  });
}

export async function GET(request: NextRequest) {
  return withApiSecurity(request, getHandler);
}

export async function OPTIONS(request: NextRequest) {
  return handleOptionsRequest(request);
}