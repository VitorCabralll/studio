import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken, isAdminConfigured } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    // Verificar se Admin SDK está configurado
    if (!isAdminConfigured) {
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
      return NextResponse.json(
        { 
          error: result.error?.message || 'Token inválido',
          success: false 
        },
        { status: 401 }
      );
    }

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
    console.error('Erro na verificação admin:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        success: false 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Firebase Admin API',
    configured: isAdminConfigured,
    timestamp: new Date().toISOString()
  });
}