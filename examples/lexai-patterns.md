# 📋 LexAI - Padrões de Código para Context Engineering

## 🔥 Firebase Service Pattern

```typescript
// ✅ Padrão: Validação JWT antes de operações Firestore
async function validateAuthToken(): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = getFirebaseAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    await currentUser.getIdToken(true);
    console.log('✅ Token JWT válido obtido');
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao validar token JWT:', error);
    return { success: false, error: 'Falha na validação do token' };
  }
}

// ✅ Padrão: Service com error handling
export class WorkspaceService {
  private static async validateAndExecute<T>(
    operation: () => Promise<T>
  ): Promise<{ data: T | null; error: string | null }> {
    const validation = await validateAuthToken();
    if (!validation.success) {
      return { data: null, error: validation.error || 'Falha na autenticação' };
    }

    try {
      const data = await operation();
      return { data, error: null };
    } catch (error) {
      console.error('❌ Erro na operação:', error);
      return { data: null, error: 'Falha na operação' };
    }
  }
}
```

## ⚛️ React Hooks Pattern

```typescript
// ✅ Padrão: Hook customizado com error handling
export function useWorkspace() {
  const [state, setState] = useState({
    workspaces: [],
    currentWorkspace: null,
    isLoading: false,
    error: null
  });

  const handleError = useCallback((error: unknown, context: string) => {
    console.error(`❌ Erro no contexto ${context}:`, error);
    setState(prev => ({ 
      ...prev, 
      isLoading: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    }));
  }, []);

  // Operações sempre com try/catch
  const createWorkspace = useCallback(async (data: CreateWorkspaceData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await WorkspaceService.create(data);
      if (result.error) throw new Error(result.error);
      
      setState(prev => ({ 
        ...prev, 
        workspaces: [...prev.workspaces, result.data!],
        isLoading: false 
      }));
    } catch (error) {
      handleError(error, 'createWorkspace');
    }
  }, [handleError]);

  return { ...state, createWorkspace };
}
```

## 🧠 AI Orchestrator Pattern

```typescript
// ✅ Padrão: Pipeline com fallbacks e retry
export class AIOrchestrator {
  private providers = ['google', 'openai', 'anthropic'];

  async process(request: ProcessRequest): Promise<ProcessResult> {
    const errors: Error[] = [];

    for (const provider of this.providers) {
      try {
        console.log(`🧠 Tentando provider: ${provider}`);
        const result = await this.executeWithProvider(provider, request);
        
        if (result.success) {
          console.log(`✅ Sucesso com provider: ${provider}`);
          return result;
        }
      } catch (error) {
        console.error(`❌ Falha no provider ${provider}:`, error);
        errors.push(error as Error);
        continue;
      }
    }

    throw new Error(`Todos os providers falharam: ${errors.map(e => e.message).join(', ')}`);
  }

  private async executeWithProvider(provider: string, request: ProcessRequest) {
    const client = this.getClient(provider);
    
    // Retry logic
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        return await client.process(request);
      } catch (error) {
        if (attempt === 3) throw error;
        await this.delay(1000 * attempt);
      }
    }
  }
}
```

## 🛡️ Error Boundary Pattern

```typescript
// ✅ Padrão: Error boundary com logging
export function withErrorBoundary<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  context: string
) {
  return function WrappedComponent(props: T) {
    return (
      <ErrorBoundary
        fallback={<ErrorFallback context={context} />}
        onError={(error, errorInfo) => {
          console.error(`❌ Error boundary ativado [${context}]:`, error);
          // TODO: Implementar logging para Sentry/Firebase Crashlytics
        }}
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// ✅ Padrão: Fallback component
function ErrorFallback({ context }: { context: string }) {
  return (
    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
      <h3 className="text-red-800 font-medium">Erro no componente {context}</h3>
      <p className="text-red-600 text-sm mt-1">
        Algo deu errado. Tente recarregar a página.
      </p>
    </div>
  );
}
```

## 📱 Component Pattern (shadcn/ui)

```typescript
// ✅ Padrão: Componente com variants e accessibility
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", isLoading, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
```

## 🗂️ Data Validation Pattern

```typescript
// ✅ Padrão: Validação com Zod
export const WorkspaceSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().max(500, 'Descrição muito longa').optional(),
  settings: z.object({
    allowPublicJoin: z.boolean().default(false),
    defaultRole: z.enum(['member', 'admin']).default('member')
  }).optional()
});

export type WorkspaceInput = z.infer<typeof WorkspaceSchema>;

// ✅ Padrão: Uso em forms
export function CreateWorkspaceForm() {
  const form = useForm<WorkspaceInput>({
    resolver: zodResolver(WorkspaceSchema),
    defaultValues: {
      name: '',
      description: '',
      settings: {
        allowPublicJoin: false,
        defaultRole: 'member'
      }
    }
  });

  const onSubmit = async (data: WorkspaceInput) => {
    try {
      const validated = WorkspaceSchema.parse(data);
      await createWorkspace(validated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        error.errors.forEach(err => {
          form.setError(err.path[0] as keyof WorkspaceInput, {
            message: err.message
          });
        });
      }
    }
  };
}
```

## 🎯 Anti-Patterns a Evitar

```typescript
// ❌ NÃO FAZER: Operação Firestore sem validação JWT
async function badWorkspaceCreate(data: any) {
  const db = getFirebaseDb();
  return addDoc(collection(db, 'workspaces'), data); // ❌ Sem validação
}

// ❌ NÃO FAZER: Error handling genérico demais
try {
  await someOperation();
} catch (error) {
  console.log('Error'); // ❌ Sem contexto
}

// ❌ NÃO FAZER: Estado não controlado
const [workspaces, setWorkspaces] = useState(); // ❌ Sem tipo
const [loading, setLoading] = useState(); // ❌ Sem valor inicial

// ❌ NÃO FAZER: Hardcoded values
const API_URL = 'https://api.example.com'; // ❌ Deve ser env var

// ❌ NÃO FAZER: Logs com dados sensíveis
console.log('User data:', userData); // ❌ Pode expor dados pessoais
```

---

*Padrões LexAI | Use estes exemplos como referência para manutenção*