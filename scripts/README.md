# 📁 Scripts do LexAI

Esta pasta contém scripts utilitários para desenvolvimento, deploy e manutenção do projeto LexAI.

## 📋 Scripts Disponíveis

### 🔄 **Gerenciamento de Ambiente**

#### `switch-env.sh`
**Função**: Troca entre ambientes de desenvolvimento, staging e produção.

```bash
# Trocar para desenvolvimento
./scripts/switch-env.sh development
# ou usar o npm script
npm run env:dev

# Trocar para staging
./scripts/switch-env.sh staging
npm run env:staging

# Trocar para produção (requer confirmação)
./scripts/switch-env.sh production
npm run env:prod

# Ver ambiente atual
npm run env:current
```

**Características**:
- ✅ Backup automático do ambiente atual
- ✅ Validações de segurança
- ✅ Avisos especiais para produção
- ✅ Interface colorida e clara

---

### 🧹 **Manutenção e Limpeza**

#### `safe-cleanup.sh`
**Função**: Limpeza segura de dados de desenvolvimento sem afetar configurações.

```bash
./scripts/safe-cleanup.sh
```

**O que limpa**:
- Cache do Next.js (.next)
- Node modules (opcional)
- Logs temporários
- Arquivos de build

**O que preserva**:
- Configurações de ambiente
- Código fonte
- Documentação

#### `restore-backup.sh`
**Função**: Restaura projeto a partir de backup em caso de problemas.

```bash
./scripts/restore-backup.sh [pasta-backup]

# Exemplo
./scripts/restore-backup.sh backups/backup-20241211-143000
```

**Características**:
- ✅ Backup de segurança antes de restaurar
- ✅ Validações de integridade
- ✅ Reinstalação de dependências
- ✅ Verificações pós-restauração

---

### 📊 **Análise e Otimização**

#### `optimize-build.js`
**Função**: Analisa e otimiza o build de produção.

```bash
node scripts/optimize-build.js
```

**Funcionalidades**:
- 📊 Análise de tamanho dos chunks
- 🗜️ Estimativa de compressão gzip
- 💡 Recomendações de otimização
- 📋 Relatório de performance

---

### 👥 **Gerenciamento de Usuários**

#### `create-user-profile.js`
**Função**: Cria perfis padrão para usuários existentes no Firebase.

```bash
node scripts/create-user-profile.js
```

**⚠️ ATENÇÃO**: Este script precisa ser corrigido antes do uso:
- Remover referência hardcoded ao `serviceAccountKey.json`
- Usar variáveis de ambiente para configuração
- Atualizar para usar Firebase Admin SDK corretamente

---

### 🚀 **Deploy**

#### `staging/deploy-staging.sh`
**Função**: Deploy para ambiente de staging.

```bash
./scripts/staging/deploy-staging.sh
# ou usar o npm script
npm run deploy:staging
```

**⚠️ ATENÇÃO**: Este script precisa ser corrigido:
- Corrigir paths dos arquivos de ambiente
- Adicionar regras de Firestore para staging
- Melhorar lógica de backup/restore

---

## 🔧 Scripts NPM Relacionados

No `package.json`, temos os seguintes scripts que usam estes arquivos:

```json
{
  "scripts": {
    "env:dev": "./scripts/switch-env.sh development",
    "env:staging": "./scripts/switch-env.sh staging", 
    "env:prod": "./scripts/switch-env.sh production",
    "env:current": "grep 'NEXT_PUBLIC_APP_ENV=' .env.local 2>/dev/null || echo 'Nenhum ambiente configurado'",
    "deploy:staging": "./scripts/staging/deploy-staging.sh"
  }
}
```

## 📝 Status dos Scripts

| Script | Status | Prioridade de Correção |
|--------|--------|----------------------|
| `switch-env.sh` | ✅ **Funcionando** | - |
| `safe-cleanup.sh` | ✅ **Funcionando** | - |
| `restore-backup.sh` | ✅ **Funcionando** | Baixa |
| `optimize-build.js` | ✅ **Funcionando** | Baixa (melhorias) |
| `create-user-profile.js` | ⚠️ **Precisa correção** | **Alta** |
| `staging/deploy-staging.sh` | ⚠️ **Precisa correção** | **Alta** |

## 🚨 Correções Urgentes Necessárias

### 1. `create-user-profile.js`
```javascript
// ❌ Problema atual
const serviceAccount = require('./serviceAccountKey.json');

// ✅ Correção necessária
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  })
});
```

### 2. `staging/deploy-staging.sh`
```bash
# ❌ Problema atual
cp .env.staging .env.local

# ✅ Correção necessária  
cp environments/staging/.env.staging .env.local
```

## 📚 Próximos Passos

1. **Corrigir scripts problemáticos** (create-user-profile.js e deploy-staging.sh)
2. **Adicionar testes** para scripts críticos
3. **Melhorar optimize-build.js** com webpack-bundle-analyzer
4. **Criar script de setup inicial** para novos desenvolvedores

---

## 🔗 Links Úteis

- [Documentação Firebase Admin](https://firebase.google.com/docs/admin/setup)
- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Guia de Ambientes](../docs/desenvolvimento/environment-setup.md)