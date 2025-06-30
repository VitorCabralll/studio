# 🤝 Contributing to LexAI

> Obrigado por seu interesse em contribuir com o LexAI! Este guia ajudará você a configurar o ambiente e entender nossos padrões.

## 📋 Índice

- [Como Começar](#como-começar)
- [Padrões de Desenvolvimento](#padrões-de-desenvolvimento)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Fluxo de Contribuição](#fluxo-de-contribuição)
- [Padrões de Commit](#padrões-de-commit)
- [Pull Requests](#pull-requests)
- [Debugging e Testes](#debugging-e-testes)

---

## 🚀 Como Começar

### 1. **Setup do Ambiente**

```bash
# 1. Fork o repositório no GitHub
# 2. Clone seu fork
git clone https://github.com/SEU-USERNAME/studio-1.git
cd studio-1

# 3. Adicione o upstream
git remote add upstream https://github.com/VitorCabralll/studio-1.git

# 4. Instale dependências
npm install

# 5. Configure ambiente (veja SETUP.md)
cp .env.example .env.local
# Edite .env.local com suas configurações
```

### 2. **Verificar Setup**

```bash
# Verificar tipos
npm run typecheck

# Verificar linting
npm run lint

# Testar orquestrador
npm run test:orchestrator

# Iniciar desenvolvimento
npm run dev
```

---

## 🎯 Padrões de Desenvolvimento

### **Stack Tecnológica**
- **Frontend**: Next.js 15 (App Router) + React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Firebase (Auth, Firestore, Storage)
- **IA**: Multi-LLM (OpenAI, Google AI, Anthropic)
- **OCR**: Tesseract.js (processamento local)

### **Convenções de Código**

#### **TypeScript**
```typescript
// ✅ Use tipos explícitos
interface UserProfile {
  cargo: string;
  areas_atuacao: string[];
  primeiro_acesso: boolean;
}

// ✅ Use JSDoc para funções públicas
/**
 * Processa documento usando OCR local
 * @param file - Arquivo para processar
 * @returns Texto extraído com confiança
 */
export async function processDocument(file: File): Promise<OCRResult> {
  // implementação
}

// ❌ Evite any
const data: any = response; // ❌
const data: UserProfile = response; // ✅
```

#### **React Components**
```tsx
// ✅ Componentes funcionais com TypeScript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant = 'primary', children, onClick }: ButtonProps) {
  return (
    <button 
      className={cn(
        'px-4 py-2 rounded-lg',
        variant === 'primary' ? 'bg-blue-600 text-white' : 'bg-gray-200'
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// ✅ Use shadcn/ui como base
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
```

#### **Hooks**
```tsx
// ✅ Hooks customizados bem documentados
/**
 * Hook para gerenciar estado de upload de arquivos
 */
export function useFileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const uploadFile = useCallback(async (file: File) => {
    // implementação
  }, []);
  
  return { files, isUploading, uploadFile };
}
```

### **Estrutura de Pastas**

```
src/
├── app/                    # App Router do Next.js
│   ├── (auth)/            # Rotas de autenticação
│   ├── api/               # API routes
│   └── globals.css        # Estilos globais
├── components/            
│   ├── ui/                # Componentes base (shadcn/ui)
│   ├── layout/            # Layout e navegação
│   ├── forms/             # Formulários específicos
│   └── auth/              # Componentes de autenticação
├── hooks/                 # Hooks customizados
├── services/              # Serviços (Firebase, APIs)
├── lib/                   # Utilitários e configurações
└── ai/orchestrator/       # Sistema de IA multi-LLM
```

---

## 🔄 Fluxo de Contribuição

### **1. Preparar Mudança**
```bash
# Sincronizar com upstream
git fetch upstream
git checkout main
git merge upstream/main

# Criar branch para feature
git checkout -b feature/nome-da-feature
# ou
git checkout -b fix/nome-do-bug
```

### **2. Fazer Mudanças**
- Implemente sua funcionalidade/correção
- Siga os padrões de código estabelecidos
- Adicione JSDoc para funções públicas
- Teste localmente

### **3. Verificar Qualidade**
```bash
# Verificar tipos
npm run typecheck

# Verificar linting
npm run lint

# Corrigir problemas automáticos
npm run lint -- --fix

# Testar funcionalidades críticas
npm run test:orchestrator
```

### **4. Commit e Push**
```bash
# Adicionar mudanças
git add .

# Commit seguindo padrões
git commit -m "feat: adicionar exportação PDF para documentos"

# Push para seu fork
git push origin feature/nome-da-feature
```

---

## 📝 Padrões de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/) para mensagens de commit:

### **Formato**
```
tipo(escopo): descrição curta

Descrição mais longa se necessário.

- Detalhe específico 1
- Detalhe específico 2
```

### **Tipos**
- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Mudanças na documentação
- **style**: Formatação, não afeta lógica
- **refactor**: Refatoração sem mudança de funcionalidade
- **perf**: Melhoria de performance
- **test**: Adicionar ou corrigir testes
- **chore**: Tarefas de manutenção

### **Exemplos**
```bash
# Boa funcionalidade
git commit -m "feat(auth): adicionar login com Google OAuth"

# Correção de bug
git commit -m "fix(ocr): corrigir erro ao processar PDFs grandes"

# Documentação
git commit -m "docs(api): adicionar exemplos de uso do orquestrador"

# Refatoração
git commit -m "refactor(components): extrair lógica de upload para hook"
```

---

## 🔀 Pull Requests

### **Antes de Abrir PR**
- [ ] Código funciona localmente
- [ ] `npm run typecheck` passa
- [ ] `npm run lint` passa
- [ ] Testou funcionalidades afetadas
- [ ] Documentação atualizada se necessário

### **Template de PR**
```markdown
## 📋 Resumo
Breve descrição das mudanças realizadas.

## 🎯 Tipo de Mudança
- [ ] 🆕 Nova funcionalidade
- [ ] 🐛 Correção de bug
- [ ] 📚 Documentação
- [ ] 🔧 Refatoração
- [ ] ⚡ Performance

## 🧪 Como Testar
1. Faça checkout da branch
2. Execute `npm install`
3. Configure `.env.local` se necessário
4. Execute `npm run dev`
5. Teste funcionalidade X em Y

## 📸 Screenshots (se aplicável)
Adicione screenshots para mudanças visuais.

## ✅ Checklist
- [ ] Código testado localmente
- [ ] TypeScript compilando sem erros
- [ ] ESLint passando
- [ ] Documentação atualizada
- [ ] Padrões de commit seguidos
```

### **Processo de Review**
1. **Automated Checks**: TypeScript, ESLint, Build
2. **Code Review**: Análise do código por maintainers
3. **Testing**: Verificação da funcionalidade
4. **Merge**: Após aprovação e checks passarem

---

## 🧪 Debugging e Testes

### **Debugging Local**
```bash
# Debug mode com logs detalhados
NODE_ENV=development npm run dev

# Habilitar tracing do orquestrador
ENABLE_TRACING=true npm run dev

# Debug específico do Next.js
npm run dev -- --debug
```

### **Ferramentas Úteis**
- **React DevTools**: Inspecionar estado dos componentes
- **Console Debug**: Botão "Debug Auth" na interface
- **Network Tab**: Monitorar requisições da API
- **Lighthouse**: Performance e acessibilidade

### **Testes Manuais**
```bash
# Fluxo completo de autenticação
1. Acesse /login
2. Teste login com email/senha
3. Teste login com Google
4. Verifique redirecionamento correto

# Fluxo de geração de documento
1. Faça login
2. Complete onboarding se necessário
3. Crie um agente
4. Faça upload de documento
5. Gere documento
6. Verifique resultado
```

---

## 🎨 Padrões de UI/UX

### **Componentes**
- Use **shadcn/ui** como base sempre que possível
- Mantenha **consistência visual** com o design existente
- Implemente **responsividade** mobile-first
- Adicione **loading states** e **error handling**

### **Acessibilidade**
- Use **semantic HTML** adequado
- Adicione **aria-labels** quando necessário
- Mantenha **contraste adequado** de cores
- Teste com **navegação por teclado**

### **Performance**
- Otimize **imagens** antes de usar
- Use **lazy loading** para componentes pesados
- Minimize **re-renders** desnecessários
- Prefira **server-side** quando possível

---

## 🚨 Troubleshooting

### **Problemas Comuns**

#### **TypeScript Errors**
```bash
# Limpar cache do TypeScript
rm -rf .next
npm run typecheck
```

#### **ESLint Issues**
```bash
# Auto-fix problemas simples
npm run lint -- --fix

# Verificar configuração
cat .eslintrc.json
```

#### **Firebase Setup**
```bash
# Verificar configuração
firebase projects:list
firebase use --add your-project-id

# Testar conexão
firebase emulators:start
```

#### **Dependências**
```bash
# Limpar node_modules
rm -rf node_modules package-lock.json
npm install

# Verificar versões
npm outdated
```

---

## 📞 Suporte

### **Como Pedir Ajuda**
1. **Verifique documentação** existente
2. **Procure issues** similares no GitHub
3. **Abra nova issue** com template adequado:
   - Descreva o problema claramente
   - Inclua steps para reproduzir
   - Anexe logs de erro
   - Mencione ambiente (OS, Node version, etc.)

### **Canais de Comunicação**
- **GitHub Issues**: Bugs e feature requests
- **GitHub Discussions**: Perguntas gerais
- **Pull Requests**: Code review e discussões técnicas

---

## 🏆 Reconhecimento

Contribuidores são reconhecidos:
- **README.md**: Lista de contributors
- **CHANGELOG.md**: Créditos por release
- **GitHub**: Perfil como contributor

---

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a [MIT License](./LICENSE).

---

**🙏 Obrigado por contribuir com o LexAI! Sua ajuda é fundamental para democratizar a automação jurídica.**