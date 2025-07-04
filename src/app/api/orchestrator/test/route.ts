/**
 * Endpoint de teste para o orquestrador
 * Usado para verificar se o sistema está funcionando
 */

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Orquestrador funcionando corretamente',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Erro no endpoint de teste:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
}