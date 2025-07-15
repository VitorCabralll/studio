# 🔧 Guia de Manutenção - Sistema de Autenticação LexAI

> **Manual completo para operação, monitoramento e troubleshooting**

---

## 🚀 **Deployment e Go-Live**

### **Checklist Pré-Produção**
```bash
# 1. Verificar configurações
✅ .env.local configurado com todas as variáveis
✅ reCAPTCHA v3 configurado e testado
✅ Firebase App Check ativo
✅ Regras Firestore seguras implementadas
✅ Testes de integração passando

# 2. Deploy das regras de segurança
firebase deploy --only firestore:rules

# 3. Verificar App Check no console
# - Authentication: Enforce ativo
# - Cloud Firestore: Enforce ativo
# - Métricas de verificação funcionando
```

### **Configuração de Produção**
```env
# .env.production
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LcXXXXXXXXXXXXX...
# Remover: NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN
```

---

## 📊 **Monitoramento e Observabilidade**

### **Métricas Principais**

**1. App Check**
```
📍 Console: https://console.firebase.google.com/project/lexai-ef0ab/appcheck

Métricas Críticas:
- Verified requests: > 95%
- Unverified requests: < 5%
- Token generation errors: < 1%
```

**2. Authentication**
```
📍 Console: https://console.firebase.google.com/project/lexai-ef0ab/authentication

Métricas de Sucesso:
- Login success rate: > 95%
- Signup completion rate: > 90%
- Password reset completion: > 80%
```

**3. Firestore**
```
📍 Console: https://console.firebase.google.com/project/lexai-ef0ab/firestore

Segurança:
- Denied reads/writes: monitorar spikes
- Unauthorized attempts: < 1%
- Rule evaluation errors: 0
```

### **Dashboards e Alertas**

**Google Cloud Monitoring**
```javascript
// Exemplo de métrica customizada
const authMetrics = {
  loginSuccess: 'firebase.auth.signin.success',
  loginFailure: 'firebase.auth.signin.failure',
  appCheckSuccess: 'firebase.appcheck.token.success',
  appCheckFailure: 'firebase.appcheck.token.failure'
};

// Alertas recomendados
const alerts = [
  {
    metric: 'login_failure_rate',
    threshold: '> 10% in 5 minutes',
    action: 'Notify security team'
  },
  {
    metric: 'app_check_rejection_rate', 
    threshold: '> 5% in 10 minutes',
    action: 'Check reCAPTCHA configuration'
  }
];
```

---

## 🔍 **Troubleshooting Guide**

### **Problemas Comuns**

#### **1. Erro 400 - Bad Request**
```bash
# Sintomas
- Falha em login/signup
- Console: "POST identitytoolkit.googleapis.com 400"
- User message: "Erro de verificação"

# Diagnóstico
1. Verificar App Check status:
   window.__lexai_app_check_status()

2. Verificar reCAPTCHA:
   # Console deve mostrar: "App Check: Token obtained successfully"

3. Verificar debug token (desenvolvimento):
   # .env.local deve ter NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN

# Soluções
- Produção: Verificar reCAPTCHA site key
- Desenvolvimento: Adicionar debug token
- Emergência: Temporariamente "Monitor" em vez de "Enforce"
```

#### **2. Permission Denied - Firestore**
```bash
# Sintomas
- Erro ao carregar perfil do usuário
- Console: "FirebaseError: Missing or insufficient permissions"

# Diagnóstico
1. Verificar autenticação:
   const user = getAuth().currentUser;
   console.log('User ID:', user?.uid);

2. Verificar regras Firestore:
   firebase firestore:rules:get

3. Testar regra específica:
   # Firebase console > Firestore > Rules > Simulator

# Soluções
- Verificar se usuário está logado
- Validar regras de segurança
- Verificar estrutura de dados
```

#### **3. reCAPTCHA Errors**
```bash
# Sintomas
- "reCAPTCHA verification failed"
- App Check initialization errors
- Token generation failures

# Diagnóstico
1. Verificar chave reCAPTCHA:
   # Console Google reCAPTCHA > Site Settings

2. Verificar domínios autorizados:
   # Deve incluir localhost e domínio de produção

3. Verificar tipo reCAPTCHA:
   # Deve ser v3, não v2

# Soluções
- Regenerar chaves reCAPTCHA
- Adicionar domínios faltantes
- Verificar rate limiting
```

#### **4. Performance Issues**
```bash
# Sintomas
- Login lento (> 3 segundos)
- Timeouts em authentication
- UI não responsiva

# Diagnóstico
1. Network timing:
   # DevTools > Network > Auth requests

2. App Check overhead:
   # Verificar se token está sendo cached

3. Firestore queries:
   # Verificar índices e query efficiency

# Soluções
- Implementar token caching
- Otimizar queries Firestore
- Considerar retry strategy tuning
```

---

## 🔄 **Operações de Manutenção**

### **Rotinas Diárias**
```bash
# 1. Verificar métricas de saúde
curl -s https://lexai.com/api/health/auth | jq

# 2. Monitorar logs de erro
firebase functions:log --only auth-errors

# 3. Verificar App Check status
# Console Firebase > App Check > Verificar % verified
```

### **Rotinas Semanais**
```bash
# 1. Análise de métricas
# - Taxa de conversão signup
# - Tempo médio de login
# - Distribuição de erros por tipo

# 2. Limpeza de logs antigos
# - Remover logs > 30 dias
# - Arquivar métricas de auditoria

# 3. Review de regras de segurança
# - Verificar se ainda adequadas
# - Testar cenários edge cases
```

### **Rotinas Mensais**
```bash
# 1. Auditoria de segurança
# - Review de acessos
# - Análise de tentativas de brute force
# - Verificação de contas suspensas

# 2. Performance review
# - Análise de latência p95
# - Otimização de queries
# - Review de retry strategies

# 3. Backup e disaster recovery test
# - Teste de restauração de backup
# - Validação de procedimentos de emergência
```

---

## 🚨 **Procedimentos de Emergência**

### **Desabilitar App Check (Emergência)**
```bash
# Se App Check está causando problemas críticos

# OPÇÃO 1: Console Firebase
1. Acesse: console.firebase.google.com/project/lexai-ef0ab/appcheck
2. Para cada API (Auth, Firestore):
   - Clique em "..." > "Monitor" (em vez de "Enforce")
3. Isso mantém métricas mas não bloqueia requests

# OPÇÃO 2: Via código (emergency flag)
# Em src/lib/app-check.ts, adicionar:
if (process.env.EMERGENCY_DISABLE_APP_CHECK === 'true') {
  return null; // Disables App Check completely
}

# OPÇÃO 3: Google Cloud Console
1. Acesse: console.cloud.google.com/apis/library
2. Procure "Firebase App Check API"
3. Clique "Disable" (último recurso)
```

### **Rollback de Regras Firestore**
```bash
# Se novas regras causaram problemas

# 1. Rollback via Firebase CLI
firebase firestore:rules:get > rules-backup.txt
firebase firestore:rules:set rules-previous.txt

# 2. Regras temporárias permissivas (CUIDADO!)
# firestore.rules temporário:
match /{document=**} {
  allow read, write: if request.auth != null; // Temporário!
}

# 3. Deploy e monitoramento
firebase deploy --only firestore:rules
# Monitorar logs por 15 minutos
# Implementar correção adequada ASAP
```

### **Incident Response**
```bash
# 1. Identificação (< 5 min)
- Verificar status pages
- Analisar métricas em tempo real
- Identificar scope do problema

# 2. Contenção (< 15 min)
- Implementar workaround se disponível
- Comunicar stakeholders
- Ativar rollback se necessário

# 3. Resolução (< 1 hora)
- Implementar fix definitivo
- Testar solução
- Deploy gradual

# 4. Pós-incident (< 24 horas)
- Post-mortem
- Documentar lições aprendidas
- Implementar prevenções
```

---

## 📚 **Comandos Úteis**

### **Diagnóstico Rápido**
```bash
# Status geral do sistema
node scripts/debug-auth.js

# Testar conectividade Firebase
firebase use lexai-ef0ab
firebase firestore:rules:get

# Verificar App Check configuration
curl -s "https://console.firebase.google.com/project/lexai-ef0ab/appcheck"

# Logs de autenticação
firebase functions:log --only auth
```

### **Manutenção de Dados**
```bash
# Backup de regras Firestore
firebase firestore:rules:get > backup-rules-$(date +%Y%m%d).txt

# Listar usuários ativos
firebase auth:export users-export.json

# Verificar índices Firestore
firebase firestore:indexes

# Deploy apenas regras
firebase deploy --only firestore:rules
```

### **Testing e Validation**
```bash
# Testar regras Firestore localmente
firebase emulators:start --only firestore

# Validar configuração App Check
node scripts/validate-app-check.js

# Testar fluxos de auth end-to-end
npm run test:auth:e2e
```

---

## 📞 **Contacts e Escalation**

### **Equipe de Desenvolvimento**
```
Líder Técnico: [nome@email.com]
DevOps: [devops@email.com]
Segurança: [security@email.com]
```

### **Fornecedores Externos**
```
Google Firebase Support: 
- Console: https://firebase.google.com/support/contact
- Severidade P1: 1 hora response SLA
- Severidade P2: 4 horas response SLA

Google reCAPTCHA Support:
- Console: https://developers.google.com/recaptcha/docs/support
- Community: Stack Overflow (tag: recaptcha)
```

### **Escalation Matrix**
```
Nível 1 (0-30 min): Equipe de desenvolvimento
Nível 2 (30-60 min): Líder técnico + DevOps
Nível 3 (1-2 horas): Management + Firebase support
Nível 4 (2+ horas): Executive team + External consultants
```

---

## 🔗 **Links de Referência**

### **Documentação Oficial**
- [Firebase Auth](https://firebase.google.com/docs/auth)
- [Firebase App Check](https://firebase.google.com/docs/app-check)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/rules-structure)
- [reCAPTCHA v3](https://developers.google.com/recaptcha/docs/v3)

### **Consoles e Dashboards**
- [Firebase Console](https://console.firebase.google.com/project/lexai-ef0ab)
- [Google Cloud Console](https://console.cloud.google.com/apis/dashboard?project=lexai-ef0ab)
- [reCAPTCHA Admin](https://www.google.com/recaptcha/admin)

### **Monitoramento**
- [Firebase Performance](https://console.firebase.google.com/project/lexai-ef0ab/performance)
- [Cloud Monitoring](https://console.cloud.google.com/monitoring?project=lexai-ef0ab)

---

**📅 Última atualização**: Dezembro 2024  
**🔄 Próxima revisão**: Janeiro 2025  
**📋 Versão**: 1.0