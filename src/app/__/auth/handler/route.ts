/**
 * Firebase Auth Handler para Next.js App Router
 * Necessário para Google OAuth funcionar corretamente
 */

import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Redirecionar para Firebase Auth Handler
  const searchParams = request.nextUrl.searchParams;
  
  // Construir URL completa do Firebase Auth Handler
  const firebaseAuthHandler = new URL('/__/auth/handler', 'https://lexai-ef0ab.firebaseapp.com');
  
  // Preservar todos os parâmetros de query
  searchParams.forEach((value, key) => {
    firebaseAuthHandler.searchParams.set(key, value);
  });
  
  // Redirecionar para o handler real do Firebase
  return Response.redirect(firebaseAuthHandler.toString(), 302);
}

export async function POST(request: NextRequest) {
  return GET(request);
}