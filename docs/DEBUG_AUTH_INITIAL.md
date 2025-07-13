## FEATURE:

Debug e resolução de erro de autenticação (login/cadastro) no ambiente de produção da LexAI.

**Problema específico:**
- Usuários não conseguem fazer login/cadastro no site em produção
- Erro ocorre apenas em produção, funcionando corretamente em desenvolvimento
- Possíveis causas: problemas de token propagation, timing issues, coordenação Firebase Auth/Firestore

**Contexto técnico:**
- Sistema baseado em Firebase Auth + Firestore
- Uso do AuthCoordinator para gerenciar timing/race conditions
- Implementação com Next.js 14 + TypeScript
- Ambiente de produção com possíveis diferenças de configuração

## EXAMPLES:

**Arquivos de referência existentes:**
- `src/lib/auth-coordinator.ts` - Sistema de coordenação de auth
- `src/lib/auth-logger.ts` - Logging específico para auth
- `src/lib/auth-errors.ts` - Tratamento de erros de auth
- `src/components/auth/login-form.tsx` - Componente de login
- `src/components/auth/signup-form.tsx` - Componente de cadastro

**Padrões de debugging observados:**
- Logs estruturados com contexto detalhado
- Validação de token propagation
- Retry logic com backoff exponencial
- Categorização de erros por tipo (timing, network, permission)

## DOCUMENTATION:

**Logs disponíveis:**
- Console logs do navegador (client-side)
- Logs do Firebase Functions (server-side)
- Logs do Next.js (SSR/API routes)
- Logs do auth-logger.ts (desenvolvimento)

**Configurações Firebase:**
- `firebase.json` - Configuração do projeto
- `firestore.rules` - Regras de segurança
- Variables de ambiente em produção vs desenvolvimento

**Documentação técnica:**
- `docs/GOOGLE_AUTH_FIX.md` - Correções anteriores de auth
- `docs/development/REFACTOR_AUTH_PLAN.md` - Plano de refatoração
- `CLAUDE.md` - Configurações e padrões do projeto

## OTHER CONSIDERATIONS:

**Gotchas específicos da LexAI:**
1. **Timing issues**: AuthCoordinator resolve race conditions, mas pode ter problemas específicos em produção
2. **Environment differences**: Configurações de staging vs produção podem diferir
3. **Token propagation**: Firebase tokens podem ter delays diferentes entre ambientes
4. **Profile creation**: Após auth, perfil do usuário precisa ser criado no Firestore

**Diferenças produção vs desenvolvimento:**
- Latência de rede diferente
- Configurações de CORS
- Variables de ambiente
- Domínios autorizados no Firebase

**Estratégia de debugging:**
1. Analisar logs existentes para identificar padrões
2. Reproduzir o erro em ambiente controlado
3. Implementar logging adicional se necessário
4. Testar correção com retry logic melhorado
5. Validar em staging antes de produção

**Ferramentas disponíveis:**
- Context Engineering para análise sistemática
- SuperClaude para debugging avançado
- Auth-logger para instrumentação detalhada
- Firebase Console para monitoramento

**Prioridade:**
- CRÍTICO: Usuários não conseguem acessar o sistema
- Impacto: Bloqueio total de novos usuários
- Necessidade: Diagnóstico e correção rápida