#!/usr/bin/env node

/**
 * Ponte de Comunicação Gemini CLI <-> Claude Code
 * Sistema automatizado para coordenação de múltiplos agentes de IA
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class MultiAgentCoordinator {
    constructor() {
        this.projectRoot = process.cwd();
        this.prpDir = path.join(this.projectRoot, 'PRPs');
        this.contextDir = path.join(this.projectRoot, 'Context-Engineering-Intro');
        this.tempDir = path.join(this.projectRoot, '.tmp_agents');
        
        // Garantir que diretórios existem
        this.ensureDirectories();
    }

    ensureDirectories() {
        [this.prpDir, this.tempDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    /**
     * Fase 1: Análise Estratégica com Gemini
     */
    async createStrategicAnalysis(featureName, description, complexity = 'medium') {
        console.log(`🧠 Iniciando análise estratégica: ${featureName}`);
        
        const analysisPrompt = this.buildGeminiPrompt(featureName, description, complexity);
        const promptFile = path.join(this.tempDir, `gemini_prompt_${featureName}.md`);
        
        fs.writeFileSync(promptFile, analysisPrompt);
        
        console.log(`📝 Prompt criado: ${promptFile}`);
        console.log(`\n🔄 Execute no Gemini CLI:`);
        console.log(`gemini generate --file ${promptFile} --output ${this.prpDir}/${featureName}-prp.md`);
        
        return promptFile;
    }

    buildGeminiPrompt(featureName, description, complexity) {
        const projectContext = this.getProjectContext();
        const existingPatterns = this.getExistingPatterns();
        
        return `# ANÁLISE ESTRATÉGICA PARA LEXAI - ${featureName.toUpperCase()}

## CONTEXTO DO PROJETO
${projectContext}

## FEATURE SOLICITADA
**Nome:** ${featureName}
**Descrição:** ${description}
**Complexidade:** ${complexity}

## PADRÕES EXISTENTES NO PROJETO
${existingPatterns}

## TAREFA PARA O GEMINI
Você é o agente estratégico responsável por analisar, planejar e criar um PRP (Product Requirements Prompt) completo que permitirá ao Claude Code implementar esta feature em uma única sessão.

### ANÁLISE REQUERIDA:
1. **Investigação Arquitetural:**
   - Como esta feature se integra com o orquestrador multi-LLM existente?
   - Quais componentes precisam ser criados/modificados?
   - Que padrões do Next.js 15 devem ser seguidos?

2. **Análise de Dependências:**
   - Quais bibliotecas/APIs são necessárias?
   - Como integrar com Firebase existente?
   - Impacto na performance e bundle size?

3. **Estratégia de Implementação:**
   - Ordem ideal de implementação
   - Pontos de validação intermediários
   - Estratégia de testes

4. **Identificação de Riscos:**
   - Possíveis pontos de falha
   - Incompatibilidades com código existente
   - Limitações técnicas

### SAÍDA ESPERADA:
Crie um PRP seguindo o template em Context-Engineering-Intro/PRPs/templates/prp_base.md que inclua:

- Contexto completo do projeto LexAI
- Análise detalhada da feature
- Lista de tarefas ordenadas
- Comandos de validação executáveis
- Padrões de código a seguir
- Estratégia de testes
- Critérios de sucesso mensuráveis

### CRITÉRIOS DE QUALIDADE:
- PRP deve permitir implementação em uma sessão do Claude Code
- Incluir todos os contextos necessários
- Comandos de validação devem ser executáveis
- Seguir padrões estabelecidos no projeto
- Score de confiança: 8/10 ou superior

## INFORMAÇÕES TÉCNICAS ADICIONAIS
${this.getTechnicalSpecs()}
`;
    }

    /**
     * Fase 2: Preparação para Claude Code
     */
    async prepareClaudeExecution(featureName) {
        const prpFile = path.join(this.prpDir, `${featureName}-prp.md`);
        
        if (!fs.existsSync(prpFile)) {
            throw new Error(`PRP não encontrado: ${prpFile}`);
        }

        console.log(`⚡ Preparando execução para Claude Code: ${featureName}`);
        
        const claudeContext = this.buildClaudeContext(featureName, prpFile);
        const contextFile = path.join(this.tempDir, `claude_context_${featureName}.md`);
        
        fs.writeFileSync(contextFile, claudeContext);
        
        console.log(`📋 Contexto preparado: ${contextFile}`);
        console.log(`\n🔄 Execute no Claude Code:`);
        console.log(`/execute-prp ${contextFile}`);
        
        return contextFile;
    }

    buildClaudeContext(featureName, prpFile) {
        const prpContent = fs.readFileSync(prpFile, 'utf8');
        const codebaseSnapshot = this.getCodebaseSnapshot();
        
        return `# CONTEXTO DE EXECUÇÃO - ${featureName.toUpperCase()}

## PRP PARA IMPLEMENTAÇÃO
${prpContent}

## SNAPSHOT DO CODEBASE ATUAL
${codebaseSnapshot}

## COMANDOS DE VALIDAÇÃO
\`\`\`bash
# Verificação de tipos
npm run typecheck

# Linting
npm run lint

# Build
npm run build

# Testes (quando disponíveis)
npm run test
\`\`\`

## PADRÕES DE IMPLEMENTAÇÃO
- Usar TypeScript strict mode
- Seguir convenções do Next.js 15 App Router
- Integrar com Firebase Auth/Firestore existente
- Manter compatibilidade com orquestrador multi-LLM
- Criar componentes reutilizáveis em src/components/
- APIs em src/app/api/
- Hooks customizados em src/hooks/

## ESTRUTURA DE ARQUIVOS ESPERADA
Siga a estrutura existente do projeto:
- src/app/ (rotas e páginas)
- src/components/ (componentes React)
- src/hooks/ (hooks customizados)
- src/lib/ (utilitários e configurações)
- src/services/ (lógica de negócio)

## CRITÉRIOS DE SUCESSO
- [ ] Todos os comandos de validação passam
- [ ] Feature funciona conforme especificado no PRP
- [ ] Código segue padrões estabelecidos
- [ ] Documentação atualizada se necessário
- [ ] Testes implementados (se especificado no PRP)

## INSTRUÇÕES FINAIS
Execute o PRP passo a passo, validando cada etapa antes de prosseguir.
Use os comandos de validação fornecidos para garantir qualidade.
`;
    }

    /**
     * Fase 3: Monitoramento e Validação
     */
    async validateImplementation(featureName) {
        console.log(`🔍 Validando implementação: ${featureName}`);
        
        const validationResults = {
            typescript: false,
            linting: false,
            build: false,
            tests: false
        };

        try {
            // TypeScript
            execSync('npm run typecheck', { stdio: 'pipe' });
            validationResults.typescript = true;
            console.log('✅ TypeScript: OK');
        } catch (error) {
            console.log('❌ TypeScript: Erros encontrados');
        }

        try {
            // Linting
            execSync('npm run lint', { stdio: 'pipe' });
            validationResults.linting = true;
            console.log('✅ ESLint: OK');
        } catch (error) {
            console.log('⚠️ ESLint: Avisos encontrados');
        }

        try {
            // Build
            execSync('npm run build', { stdio: 'pipe' });
            validationResults.build = true;
            console.log('✅ Build: OK');
        } catch (error) {
            console.log('❌ Build: Falhou');
        }

        // Gerar relatório
        this.generateValidationReport(featureName, validationResults);
        
        return validationResults;
    }

    generateValidationReport(featureName, results) {
        const reportFile = path.join(this.tempDir, `validation_report_${featureName}.md`);
        const timestamp = new Date().toISOString();
        
        const report = `# Relatório de Validação - ${featureName}

**Data:** ${timestamp}

## Resultados
- TypeScript: ${results.typescript ? '✅ OK' : '❌ Falhou'}
- ESLint: ${results.linting ? '✅ OK' : '⚠️ Avisos'}
- Build: ${results.build ? '✅ OK' : '❌ Falhou'}
- Testes: ${results.tests ? '✅ OK' : '⏸️ Não executado'}

## Próximos Passos
${this.getNextSteps(results)}
`;

        fs.writeFileSync(reportFile, report);
        console.log(`📊 Relatório gerado: ${reportFile}`);
    }

    getNextSteps(results) {
        if (results.typescript && results.build) {
            return "🎉 Implementação concluída com sucesso! Pronta para deploy.";
        } else {
            return "🔧 Correções necessárias. Revise os erros e execute novamente.";
        }
    }

    // Métodos auxiliares
    getProjectContext() {
        return `LexAI é uma plataforma SaaS jurídica com:
- Stack: Next.js 15, TypeScript, Firebase
- Orquestrador multi-LLM (OpenAI, Google, Anthropic)
- 75% do MVP concluído
- Foco em automação de documentos jurídicos
- OCR local com Tesseract.js
- Sistema de agentes personalizáveis`;
    }

    getExistingPatterns() {
        const patterns = [];
        
        // Verificar padrões de componentes
        if (fs.existsSync('src/components/ui')) {
            patterns.push('- Componentes UI em src/components/ui/ (shadcn/ui)');
        }
        
        // Verificar padrões de API
        if (fs.existsSync('src/app/api')) {
            patterns.push('- APIs em src/app/api/ (Next.js App Router)');
        }
        
        // Verificar orquestrador
        if (fs.existsSync('src/ai/orchestrator')) {
            patterns.push('- Orquestrador multi-LLM em src/ai/orchestrator/');
        }
        
        return patterns.join('\n');
    }

    getTechnicalSpecs() {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        
        return `**Dependências principais:**
- Next.js: ${packageJson.dependencies?.next || 'N/A'}
- React: ${packageJson.dependencies?.react || 'N/A'}
- TypeScript: ${packageJson.devDependencies?.typescript || 'N/A'}
- Firebase: ${packageJson.dependencies?.firebase || 'N/A'}

**Scripts disponíveis:**
${Object.keys(packageJson.scripts || {}).map(script => `- ${script}`).join('\n')}`;
    }

    getCodebaseSnapshot() {
        const importantFiles = [
            'src/ai/orchestrator/types.ts',
            'src/lib/firebase.ts',
            'src/app/layout.tsx',
            'tailwind.config.ts',
            'next.config.js'
        ].filter(file => fs.existsSync(file));

        return `**Arquivos importantes:**
${importantFiles.map(file => `- ${file}`).join('\n')}

**Estrutura de diretórios:**
${this.getDirectoryStructure('src', 2)}`;
    }

    getDirectoryStructure(dir, maxDepth, currentDepth = 0) {
        if (currentDepth >= maxDepth || !fs.existsSync(dir)) return '';
        
        const items = fs.readdirSync(dir);
        const structure = [];
        
        items.forEach(item => {
            const itemPath = path.join(dir, item);
            const stats = fs.statSync(itemPath);
            const indent = '  '.repeat(currentDepth);
            
            if (stats.isDirectory()) {
                structure.push(`${indent}├── ${item}/`);
                if (currentDepth < maxDepth - 1) {
                    structure.push(this.getDirectoryStructure(itemPath, maxDepth, currentDepth + 1));
                }
            }
        });
        
        return structure.join('\n');
    }

    cleanup() {
        console.log('🧹 Limpando arquivos temporários...');
        if (fs.existsSync(this.tempDir)) {
            fs.rmSync(this.tempDir, { recursive: true, force: true });
        }
        console.log('✅ Limpeza concluída');
    }
}

// CLI Interface
async function main() {
    const coordinator = new MultiAgentCoordinator();
    const [,, command, ...args] = process.argv;

    try {
        switch (command) {
            case 'plan':
                if (args.length < 2) {
                    console.error('Uso: node gemini-claude-bridge.js plan <feature_name> <description> [complexity]');
                    process.exit(1);
                }
                await coordinator.createStrategicAnalysis(args[0], args[1], args[2] || 'medium');
                break;

            case 'execute':
                if (args.length < 1) {
                    console.error('Uso: node gemini-claude-bridge.js execute <feature_name>');
                    process.exit(1);
                }
                await coordinator.prepareClaudeExecution(args[0]);
                break;

            case 'validate':
                if (args.length < 1) {
                    console.error('Uso: node gemini-claude-bridge.js validate <feature_name>');
                    process.exit(1);
                }
                await coordinator.validateImplementation(args[0]);
                break;

            case 'cleanup':
                coordinator.cleanup();
                break;

            default:
                console.log(`🤖 Multi-Agent Coordinator para LexAI

Uso: node gemini-claude-bridge.js <comando> [argumentos]

Comandos:
  plan <name> <desc> [complexity]  - Criar análise estratégica para Gemini
  execute <name>                   - Preparar contexto para Claude Code  
  validate <name>                  - Validar implementação
  cleanup                          - Limpar arquivos temporários

Fluxo completo:
  1. node gemini-claude-bridge.js plan nova-feature "Descrição detalhada"
  2. [Execute comando Gemini sugerido]
  3. node gemini-claude-bridge.js execute nova-feature
  4. [Execute no Claude Code]
  5. node gemini-claude-bridge.js validate nova-feature
`);
        }
    } catch (error) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = MultiAgentCoordinator;