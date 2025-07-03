// Teste simples do servidor Next.js
const { spawn } = require('child_process');

console.log('🚀 Iniciando servidor Next.js...');

const nextDev = spawn('npm', ['run', 'dev'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env, NODE_ENV: 'development' }
});

let started = false;

nextDev.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('📋 STDOUT:', output);
  
  if (output.includes('Ready in') && !started) {
    started = true;
    console.log('✅ Servidor iniciado com sucesso!');
    
    // Teste de conectividade
    setTimeout(() => {
      const http = require('http');
      const req = http.get('http://localhost:3000', (res) => {
        console.log('✅ Conectividade OK - Status:', res.statusCode);
        process.exit(0);
      });
      
      req.on('error', (err) => {
        console.log('❌ Erro de conectividade:', err.message);
        process.exit(1);
      });
      
      req.setTimeout(5000, () => {
        console.log('❌ Timeout na conexão');
        process.exit(1);
      });
    }, 2000);
  }
});

nextDev.stderr.on('data', (data) => {
  const error = data.toString();
  console.log('🚨 STDERR:', error);
  
  if (error.includes('Error:') || error.includes('TypeError:')) {
    console.log('❌ Erro crítico detectado!');
    process.exit(1);
  }
});

nextDev.on('close', (code) => {
  console.log(`🔴 Processo encerrado com código ${code}`);
});

// Timeout geral
setTimeout(() => {
  console.log('⏰ Timeout geral - matando processo');
  nextDev.kill();
  process.exit(1);
}, 30000);