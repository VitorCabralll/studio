# ⚡ LexAI Quick Reference

> **Development reference guide - essential commands, patterns and configurations**

---

## 🚀 **Essential Commands**

### **Development**
```bash
npm run dev          # Development server (Turbopack - Next.js 14.x)
npm run build        # Production build  
npm run typecheck    # Check TypeScript types
npm run lint         # Run linter
```

### **Firebase**
```bash
firebase emulators:start    # Local emulators
firebase deploy            # Production deploy
firebase deploy --only hosting  # Deploy frontend only
firebase deploy --only functions  # Deploy functions only
```

### **Testing**
```bash
npm test             # Run tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

---

## 🏗️ **Project Architecture**

### **Key Directories**
```
src/
├── app/             # Next.js App Router
├── components/      # React components
├── hooks/          # Custom hooks
├── lib/            # Utilities and configs
├── services/       # Business logic
└── ai/             # AI orchestrator
```

### **Important Files**
```
├── firebase.json           # Firebase configuration
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS
└── tsconfig.json          # TypeScript
```

---

## 🔥 **Firebase Patterns**

### **Authentication**
```typescript
// Login
const { login } = useAuth();
await login(email, password);

// Google OAuth
const { loginWithGoogle } = useAuth();
await loginWithGoogle();

// Logout
const { logout } = useAuth();
await logout();
```

### **Firestore**
```typescript
// Get document
const doc = await getDoc(doc(db, 'collection', 'id'));

// Add document
await addDoc(collection(db, 'collection'), data);

// Update document
await updateDoc(doc(db, 'collection', 'id'), updates);
```

---

## 🤖 **AI Orchestrator**

### **Basic Usage**
```typescript
import { OrchestratorClient } from '@/services/orchestrator-client';

const client = new OrchestratorClient();
const result = await client.processDocument({
  content: documentText,
  agentId: 'agent-123',
  type: 'contract'
});
```

### **Pipeline Configuration**
```typescript
const config = {
  stages: ['summarize', 'structure', 'generate', 'assemble'],
  providers: ['openai', 'google', 'anthropic'],
  quality: 'premium' // or 'standard'
};
```

---

## 🎨 **UI Components**

### **Common Patterns**
```typescript
// Button
<Button variant="default" size="lg">
  Click me
</Button>

// Form
<Form {...form}>
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
      </FormItem>
    )}
  />
</Form>

// Dialog
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

---

## 🔧 **Development Patterns**

### **Custom Hooks**
```typescript
// useAuth
const { user, isAuthenticated, login, logout } = useAuth();

// useOCR
const { processImage, isProcessing, result } = useOCR();

// useWorkspace
const { workspace, agents, createAgent } = useWorkspace();
```

### **Error Handling**
```typescript
try {
  await riskyOperation();
} catch (error) {
  console.error('Operation failed:', error);
  toast.error('Something went wrong');
}
```

### **Loading States**
```typescript
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  setIsLoading(true);
  try {
    await submitData();
    toast.success('Success!');
  } catch (error) {
    toast.error('Error occurred');
  } finally {
    setIsLoading(false);
  }
};
```

---

## 📱 **Responsive Design**

### **Tailwind Breakpoints**
```css
/* Mobile first */
.class { /* mobile styles */ }

/* Tablet and up */
@media (min-width: 768px) {
  .md:class { /* tablet styles */ }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .lg:class { /* desktop styles */ }
}
```

### **Common Responsive Patterns**
```typescript
// Mobile navigation
<Sheet>
  <SheetTrigger className="md:hidden">
    <Menu />
  </SheetTrigger>
  <SheetContent>
    <Navigation />
  </SheetContent>
</Sheet>

// Desktop navigation
<nav className="hidden md:flex">
  <Navigation />
</nav>
```

---

## 🚨 **Common Issues & Solutions**

### **Build Issues**
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install

# TypeScript issues
npm run typecheck
```

### **Firebase Auth Issues**
```typescript
// Wait for auth ready in production
if (process.env.NODE_ENV === 'production') {
  await new Promise(resolve => setTimeout(resolve, 2000));
}
```

### **Environment Variables**
```bash
# Check required variables
NEXT_PUBLIC_FIREBASE_API_KEY=required
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=required
NEXT_PUBLIC_FIREBASE_PROJECT_ID=required
```

---

## 📚 **Quick Links**

### **Documentation**
- **[Setup Guide](./SETUP.md)** - Initial setup
- **[Architecture](./ARCHITECTURE.md)** - System architecture
- **[Firebase Setup](./guides/firebase-setup.md)** - Firebase configuration
- **[Troubleshooting](./guides/troubleshooting.md)** - Problem solving

### **External Resources**
- **[Next.js Docs](https://nextjs.org/docs)** - Framework documentation
- **[Firebase Docs](https://firebase.google.com/docs)** - Firebase guides
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Styling framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Component library

---

## 🎯 **Best Practices**

### **Code Quality**
- ✅ Use TypeScript strictly
- ✅ Follow ESLint rules
- ✅ Write meaningful commit messages
- ✅ Add JSDoc comments for complex functions

### **Performance**
- ✅ Use Next.js Image component
- ✅ Implement lazy loading
- ✅ Optimize bundle size
- ✅ Use React.memo for expensive components

### **Security**
- ✅ Validate all inputs
- ✅ Use environment variables for secrets
- ✅ Implement proper authentication
- ✅ Follow Firebase security rules

---

## 🔄 **Development Workflow**

### **Feature Development**
1. Create feature branch from `main`
2. Implement feature with tests
3. Run quality checks (`npm run typecheck`, `npm run lint`)
4. Create pull request
5. Code review and merge

### **Deployment**
1. Merge to `main` branch
2. Automatic build and deploy via Firebase
3. Monitor for issues
4. Rollback if necessary

---

**🔄 Last updated**: December 2024