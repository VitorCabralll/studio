# 🎨 Exemplos de Componentes UX Melhorados

## 1. **Smart Loading States**

### Problema Atual:
```typescript
// Loading genérico atual
{isLoading && <Loader2 className="animate-spin" />}
```

### Solução Melhorada:
```typescript
// src/components/ui/smart-loading.tsx
interface SmartLoadingProps {
  type: 'document-generation' | 'file-upload' | 'agent-creation';
  progress?: number;
  currentStage?: string;
  estimatedTime?: number;
}

export function SmartLoading({ type, progress = 0, currentStage, estimatedTime }: SmartLoadingProps) {
  const stages = LOADING_STAGES[type];
  const currentStageIndex = stages.findIndex(s => s.name === currentStage);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center space-y-6 p-8"
    >
      {/* Animação principal */}
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-2 bg-primary/10 rounded-full flex items-center justify-center"
        >
          <FileText className="w-6 h-6 text-primary" />
        </motion.div>
      </div>
      
      {/* Progresso detalhado */}
      <div className="w-full max-w-md space-y-4">
        <div className="flex justify-between text-sm">
          <span className="font-medium">{currentStage || 'Processando...'}</span>
          <span className="text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        
        <Progress value={progress} className="h-2" />
        
        {estimatedTime && (
          <p className="text-xs text-center text-muted-foreground">
            Tempo estimado: {Math.ceil(estimatedTime / 1000)}s restantes
          </p>
        )}
      </div>
      
      {/* Estágios visuais */}
      <div className="flex space-x-4">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.name}
            className={`flex flex-col items-center space-y-2 ${
              index <= currentStageIndex ? 'text-primary' : 'text-muted-foreground'
            }`}
            animate={index === currentStageIndex ? { y: [0, -4, 0] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
              index < currentStageIndex 
                ? 'bg-primary border-primary text-white' 
                : index === currentStageIndex
                ? 'border-primary bg-primary/10'
                : 'border-muted-foreground/30'
            }`}>
              {index < currentStageIndex ? (
                <Check className="w-4 h-4" />
              ) : (
                <stage.icon className="w-4 h-4" />
              )}
            </div>
            <span className="text-xs text-center">{stage.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

const LOADING_STAGES = {
  'document-generation': [
    { name: 'analyzing', label: 'Analisando', icon: Search },
    { name: 'structuring', label: 'Estruturando', icon: Layout },
    { name: 'generating', label: 'Gerando', icon: PenTool },
    { name: 'finalizing', label: 'Finalizando', icon: CheckCircle }
  ],
  'file-upload': [
    { name: 'uploading', label: 'Enviando', icon: Upload },
    { name: 'processing', label: 'Processando', icon: Cpu },
    { name: 'extracting', label: 'Extraindo', icon: FileText },
    { name: 'completing', label: 'Concluindo', icon: CheckCircle }
  ]
};
```

---

## 2. **Interactive Form Fields**

### Problema Atual:
```typescript
// Campos estáticos atuais
<Input placeholder="Nome do agente" />
<Select>...</Select>
```

### Solução Melhorada:
```typescript
// src/components/ui/interactive-input.tsx
interface InteractiveInputProps extends InputProps {
  label: string;
  hint?: string;
  validation?: (value: string) => string | null;
  suggestions?: string[];
}

export function InteractiveInput({ 
  label, 
  hint, 
  validation, 
  suggestions = [],
  ...props 
}: InteractiveInputProps) {
  const [value, setValue] = useState(props.value || '');
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(value.toLowerCase())
  );
  
  const handleChange = (newValue: string) => {
    setValue(newValue);
    props.onChange?.(newValue);
    
    // Validação em tempo real
    if (validation) {
      const validationError = validation(newValue);
      setError(validationError);
    }
    
    // Mostrar sugestões
    setShowSuggestions(newValue.length > 0 && filteredSuggestions.length > 0);
  };
  
  return (
    <div className="space-y-2">
      {/* Label animado */}
      <motion.label
        animate={{ 
          scale: isFocused || value ? 0.9 : 1,
          y: isFocused || value ? -20 : 0,
          color: error ? 'rgb(239 68 68)' : isFocused ? 'rgb(99 102 241)' : 'rgb(107 114 128)'
        }}
        className="block text-sm font-medium origin-left"
      >
        {label}
      </motion.label>
      
      {/* Input container */}
      <div className="relative">
        <motion.div
          animate={{
            borderColor: error 
              ? 'rgb(239 68 68)' 
              : isFocused 
              ? 'rgb(99 102 241)' 
              : 'rgb(209 213 219)'
          }}
          className="relative"
        >
          <Input
            {...props}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              setShowSuggestions(false);
            }}
            className={cn(
              "transition-all duration-200",
              error && "border-destructive focus:border-destructive",
              isFocused && "ring-2 ring-primary/20"
            )}
          />
          
          {/* Indicador de status */}
          <AnimatePresence>
            {value && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {error ? (
                  <AlertCircle className="w-4 h-4 text-destructive" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Sugestões */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg"
            >
              {filteredSuggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    handleChange(suggestion);
                    setShowSuggestions(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-muted transition-colors"
                >
                  {suggestion}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Feedback */}
      <AnimatePresence>
        {(error || hint) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <p className={cn(
              "text-xs",
              error ? "text-destructive" : "text-muted-foreground"
            )}>
              {error || hint}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

## 3. **Smart File Upload**

### Problema Atual:
```typescript
// Upload básico atual
<FileUpload onFilesChange={setFiles} />
```

### Solução Melhorada:
```typescript
// src/components/ui/smart-file-upload.tsx
export function SmartFileUpload({ onFilesChange, maxFiles = 5 }: SmartFileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [processingStatus, setProcessingStatus] = useState<Record<string, string>>({});
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/msword': ['.doc', '.docx']
    },
    maxFiles,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  });
  
  const handleDrop = useCallback(async (acceptedFiles: File[]) => {
    setDragActive(false);
    
    for (const file of acceptedFiles) {
      const fileId = `${file.name}-${Date.now()}`;
      
      // Simular upload com progresso
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      setProcessingStatus(prev => ({ ...prev, [fileId]: 'uploading' }));
      
      // Simular progresso de upload
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
      }
      
      // Processar arquivo (OCR, etc.)
      setProcessingStatus(prev => ({ ...prev, [fileId]: 'processing' }));
      await processFile(file);
      
      setProcessingStatus(prev => ({ ...prev, [fileId]: 'completed' }));
    }
    
    setFiles(prev => [...prev, ...acceptedFiles]);
    onFilesChange([...files, ...acceptedFiles]);
  }, [files, onFilesChange]);
  
  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <motion.div
        {...getRootProps()}
        animate={{
          borderColor: isDragActive ? 'rgb(99 102 241)' : 'rgb(209 213 219)',
          backgroundColor: isDragActive ? 'rgb(99 102 241 / 0.05)' : 'transparent',
          scale: isDragActive ? 1.02 : 1
        }}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
          "hover:border-primary/50 hover:bg-primary/5"
        )}
      >
        <input {...getInputProps()} />
        
        <motion.div
          animate={{ y: isDragActive ? -5 : 0 }}
          className="space-y-4"
        >
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          
          <div>
            <h3 className="text-lg font-medium">
              {isDragActive ? 'Solte os arquivos aqui' : 'Arraste arquivos ou clique para selecionar'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              PDF, DOC, DOCX, PNG, JPG até 10MB cada
            </p>
          </div>
          
          {/* Indicadores visuais */}
          <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>Processamento local</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="w-3 h-3" />
              <span>OCR automático</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Lista de arquivos */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <h4 className="font-medium">Arquivos carregados:</h4>
            {files.map((file, index) => (
              <FileItem
                key={`${file.name}-${index}`}
                file={file}
                progress={uploadProgress[`${file.name}-${Date.now()}`] || 100}
                status={processingStatus[`${file.name}-${Date.now()}`] || 'completed'}
                onRemove={() => removeFile(index)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FileItem({ file, progress, status, onRemove }: FileItemProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'uploading': return <Upload className="w-4 h-4 animate-pulse" />;
      case 'processing': return <Cpu className="w-4 h-4 animate-spin" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <File className="w-4 h-4" />;
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'uploading': return `Enviando... ${progress}%`;
      case 'processing': return 'Processando OCR...';
      case 'completed': return 'Pronto';
      default: return 'Aguardando';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
    >
      <div className="flex items-center space-x-3">
        {getStatusIcon()}
        <div>
          <p className="text-sm font-medium">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {(file.size / 1024 / 1024).toFixed(1)} MB • {getStatusText()}
          </p>
        </div>
      </div>
      
      {status === 'uploading' && (
        <div className="w-20">
          <Progress value={progress} className="h-1" />
        </div>
      )}
      
      {status === 'completed' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </motion.div>
  );
}
```

---

## 4. **Contextual Help System**

```typescript
// src/components/ui/contextual-help.tsx
interface ContextualHelpProps {
  topic: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  children: React.ReactNode;
}

export function ContextualHelp({ 
  topic, 
  position = 'top', 
  trigger = 'hover',
  children 
}: ContextualHelpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const helpContent = HELP_CONTENT[topic];
  
  if (!helpContent) return <>{children}</>;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative inline-block">
          {children}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center cursor-help"
          >
            <HelpCircle className="w-2.5 h-2.5 text-white" />
          </motion.div>
        </div>
      </TooltipTrigger>
      
      <TooltipContent side={position} className="max-w-xs">
        <div className="space-y-2">
          <h4 className="font-medium">{helpContent.title}</h4>
          <p className="text-sm">{helpContent.description}</p>
          
          {helpContent.tips && (
            <div className="space-y-1">
              <p className="text-xs font-medium">Dicas:</p>
              <ul className="text-xs space-y-1">
                {helpContent.tips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-1">
                    <span className="text-primary">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {helpContent.link && (
            <Link 
              href={helpContent.link} 
              className="text-xs text-primary hover:underline"
            >
              Saiba mais →
            </Link>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

const HELP_CONTENT = {
  'agent-name': {
    title: 'Nome do Agente',
    description: 'Escolha um nome descritivo que reflita a especialidade do seu agente de IA.',
    tips: [
      'Use nomes específicos como "Especialista em Contratos"',
      'Evite nomes genéricos como "Agente 1"',
      'Considere a área de atuação no nome'
    ]
  },
  'legal-area': {
    title: 'Área Jurídica',
    description: 'Selecione a área de direito para personalizar o agente.',
    tips: [
      'Escolha sua área principal de atuação',
      'Você pode criar múltiplos agentes para diferentes áreas',
      'A área influencia os templates e sugestões'
    ],
    link: '/help/legal-areas'
  }
};
```

---

## 5. **Adaptive Navigation**

```typescript
// src/components/navigation/adaptive-nav.tsx
export function AdaptiveNavigation({ userProfile }: { userProfile: UserProfile }) {
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Navegação adaptada ao perfil
  const getNavigationItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/' },
      { id: 'generate', label: 'Gerar Documento', icon: FileText, href: '/generate' }
    ];
    
    // Adicionar itens específicos por perfil
    const profileSpecificItems = PROFILE_NAVIGATION[userProfile.cargo] || [];
    
    // Ordenar por uso recente e favoritos
    const allItems = [...baseItems, ...profileSpecificItems];
    const sortedItems = allItems.sort((a, b) => {
      const aScore = (favorites.includes(a.id) ? 100 : 0) + 
                    (recentlyUsed.indexOf(a.id) !== -1 ? 50 - recentlyUsed.indexOf(a.id) : 0);
      const bScore = (favorites.includes(b.id) ? 100 : 0) + 
                    (recentlyUsed.indexOf(b.id) !== -1 ? 50 - recentlyUsed.indexOf(b.id) : 0);
      return bScore - aScore;
    });
    
    return sortedItems;
  };
  
  return (
    <nav className="space-y-2">
      {getNavigationItems().map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <NavigationItem
            item={item}
            isFavorite={favorites.includes(item.id)}
            isRecentlyUsed={recentlyUsed.includes(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
            onUse={() => trackUsage(item.id)}
          />
        </motion.div>
      ))}
    </nav>
  );
}

const PROFILE_NAVIGATION = {
  'Advogado(a)': [
    { id: 'cases', label: 'Casos', icon: Briefcase, href: '/cases' },
    { id: 'clients', label: 'Clientes', icon: Users, href: '/clients' },
    { id: 'deadlines', label: 'Prazos', icon: Calendar, href: '/deadlines' }
  ],
  'Estudante de Direito': [
    { id: 'study', label: 'Estudos', icon: BookOpen, href: '/study' },
    { id: 'practice', label: 'Prática', icon: Target, href: '/practice' },
    { id: 'resources', label: 'Recursos', icon: Library, href: '/resources' }
  ]
};
```

Estes exemplos mostram como podemos transformar componentes básicos em experiências interativas e intuitivas que se adaptam ao contexto e perfil do usuário, criando uma interface verdadeiramente inteligente e responsiva.