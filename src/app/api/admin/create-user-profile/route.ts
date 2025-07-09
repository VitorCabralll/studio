import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { uid, email } = await request.json();
    
    if (!uid) {
      return NextResponse.json({ error: 'UID é obrigatório' }, { status: 400 });
    }
    
    const db = getFirebaseAdminDb();
    const userRef = db.collection('usuarios').doc(uid);
    
    // Verificar se já existe
    const doc = await userRef.get();
    if (doc.exists) {
      return NextResponse.json({ 
        message: 'Usuário já possui perfil', 
        exists: true 
      });
    }
    
    // Criar perfil padrão
    const defaultProfile = {
      cargo: '',
      areas_atuacao: [],
      nivel_experiencia: 'iniciante',
      preferencias: {
        tema: 'light',
        notificacoes: true
      },
      created_at: new Date(),
      updated_at: new Date(),
      workspaces: []
    };
    
    await userRef.set(defaultProfile);
    
    return NextResponse.json({ 
      message: 'Perfil criado com sucesso',
      uid,
      email,
      created: true
    });
    
  } catch (error) {
    console.error('Erro ao criar perfil:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Endpoint para criar perfil de usuário',
    usage: 'POST com { uid: string, email?: string }'
  });
}