# 🧪 Testing Guide - LexAI

> **Complete testing guide to ensure system quality and functionality**

---

## 🎯 **Overview**

This guide consolidates all LexAI testing strategies:
- Unit and integration tests
- Functionality tests
- Performance tests
- Security tests
- Production validation

---

## 🏗️ **Testing Structure**

### **Implemented Test Types**
```
tests/
├── unit/                    # Unit tests
│   ├── components/         # React components
│   ├── hooks/             # Custom hooks
│   ├── services/          # Services
│   └── utils/             # Utilities
├── integration/            # Integration tests
│   ├── auth/              # Authentication flows
│   ├── orchestrator/      # AI pipeline
│   └── firebase/          # Firebase integration
├── e2e/                   # End-to-end tests
│   ├── user-flows/        # Complete flows
│   └── critical-paths/    # Critical paths
└── performance/           # Performance tests
    ├── load/              # Load tests
    └── stress/            # Stress tests
```

---

## 🔧 **Setup de Testes**

### **Dependências**
```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "cypress": "^13.0.0",
    "playwright": "^1.40.0"
  }
}
```

### **Configuração Jest**
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

---

## 🧪 **Testes Unitários**

### **Componentes React**
```typescript
// tests/unit/components/LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/auth/login-form';

describe('LoginForm', () => {
  it('should submit form with valid credentials', async () => {
    const mockLogin = jest.fn();
    render(<LoginForm onLogin={mockLogin} />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });
});
```

### **Custom Hooks**
```typescript
// tests/unit/hooks/useAuth.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/use-auth';

describe('useAuth', () => {
  it('should handle login flow', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });
    
    expect(result.current.user).toBeDefined();
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

### **Serviços**
```typescript
// tests/unit/services/orchestrator.test.ts
import { OrchestratorClient } from '@/services/orchestrator-client';

describe('OrchestratorClient', () => {
  it('should process document successfully', async () => {
    const client = new OrchestratorClient();
    const mockDocument = { content: 'test content' };
    
    const result = await client.processDocument(mockDocument);
    
    expect(result).toHaveProperty('processedContent');
    expect(result.status).toBe('success');
  });
});
```

---

## 🔗 **Testes de Integração**

### **Fluxo de Autenticação**
```typescript
// tests/integration/auth/auth-flow.test.ts
describe('Authentication Flow', () => {
  it('should complete full signup flow', async () => {
    // 1. Signup
    const user = await authService.signup({
      email: 'newuser@example.com',
      password: 'password123'
    });
    
    // 2. Profile creation
    expect(user.profile).toBeDefined();
    
    // 3. Workspace creation
    const workspace = await workspaceService.createDefault(user.uid);
    expect(workspace).toBeDefined();
    
    // 4. Firestore validation
    const savedProfile = await userService.getProfile(user.uid);
    expect(savedProfile.workspaceId).toBe(workspace.id);
  });
});
```

### **Pipeline de IA**
```typescript
// tests/integration/orchestrator/pipeline.test.ts
describe('AI Pipeline', () => {
  it('should process document through full pipeline', async () => {
    const pipeline = new DocumentPipeline();
    const input = {
      content: 'Sample legal document',
      type: 'contract',
      agent: mockAgent
    };
    
    const result = await pipeline.process(input);
    
    expect(result.stages).toHaveLength(5);
    expect(result.finalDocument).toBeDefined();
    expect(result.metadata.processingTime).toBeLessThan(30000);
  });
});
```

---

## 🎭 **Testes End-to-End**

### **Cypress - Fluxos Críticos**
```typescript
// cypress/e2e/user-journey.cy.ts
describe('Complete User Journey', () => {
  it('should complete full user flow', () => {
    // 1. Landing page
    cy.visit('/');
    cy.contains('Começar Agora').click();
    
    // 2. Signup
    cy.get('[data-testid="signup-email"]').type('test@example.com');
    cy.get('[data-testid="signup-password"]').type('password123');
    cy.get('[data-testid="signup-submit"]').click();
    
    // 3. Onboarding
    cy.url().should('include', '/onboarding');
    cy.get('[data-testid="workspace-name"]').type('Test Workspace');
    cy.get('[data-testid="continue"]').click();
    
    // 4. Agent creation
    cy.url().should('include', '/agente/criar');
    cy.get('[data-testid="agent-name"]').type('Test Agent');
    cy.get('[data-testid="agent-type"]').select('contract');
    cy.get('[data-testid="create-agent"]').click();
    
    // 5. Document generation
    cy.url().should('include', '/workspace');
    cy.contains('Test Agent').should('be.visible');
  });
});
```

### **Playwright - Cross-browser**
```typescript
// tests/e2e/cross-browser.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Cross-browser compatibility', () => {
  ['chromium', 'firefox', 'webkit'].forEach(browserName => {
    test(`should work in ${browserName}`, async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('h1')).toContainText('LexAI');
      
      // Test critical functionality
      await page.click('[data-testid="login-button"]');
      await expect(page).toHaveURL(/.*login/);
    });
  });
});
```

---

## ⚡ **Testes de Performance**

### **Load Testing**
```typescript
// tests/performance/load.test.ts
import { check } from 'k6';
import http from 'k6/http';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
};

export default function() {
  let response = http.get('https://lexai.com.br/api/health');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

### **Bundle Size Testing**
```typescript
// tests/performance/bundle-size.test.ts
import { getBundleSize } from './utils/bundle-analyzer';

describe('Bundle Size', () => {
  it('should not exceed size limits', async () => {
    const sizes = await getBundleSize();
    
    expect(sizes.main).toBeLessThan(500 * 1024); // 500KB
    expect(sizes.vendor).toBeLessThan(1024 * 1024); // 1MB
    expect(sizes.total).toBeLessThan(2 * 1024 * 1024); // 2MB
  });
});
```

---

## 🔒 **Testes de Segurança**

### **Authentication Security**
```typescript
// tests/security/auth.test.ts
describe('Authentication Security', () => {
  it('should prevent unauthorized access', async () => {
    const response = await fetch('/api/admin/users', {
      headers: { 'Authorization': 'Bearer invalid-token' }
    });
    
    expect(response.status).toBe(401);
  });
  
  it('should validate input sanitization', async () => {
    const maliciousInput = '<script>alert("xss")</script>';
    const response = await userService.updateProfile({
      name: maliciousInput
    });
    
    expect(response.name).not.toContain('<script>');
  });
});
```

### **Firestore Security Rules**
```typescript
// tests/security/firestore-rules.test.ts
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';

describe('Firestore Security Rules', () => {
  it('should deny access to other users data', async () => {
    const db = getFirestore('user1');
    
    await assertFails(
      db.collection('usuarios').doc('user2').get()
    );
  });
  
  it('should allow access to own data', async () => {
    const db = getFirestore('user1');
    
    await assertSucceeds(
      db.collection('usuarios').doc('user1').get()
    );
  });
});
```

---

## 📊 **Métricas e Relatórios**

### **Coverage Reports**
```bash
# Gerar relatório de cobertura
npm run test:coverage

# Visualizar relatório
open coverage/lcov-report/index.html
```

### **Performance Metrics**
```typescript
// tests/utils/performance-metrics.ts
export const performanceMetrics = {
  // Core Web Vitals
  LCP: 2500, // Largest Contentful Paint
  FID: 100,  // First Input Delay
  CLS: 0.1,  // Cumulative Layout Shift
  
  // Custom metrics
  authTime: 1000,     // Authentication time
  loadTime: 3000,     // Page load time
  apiResponse: 500,   // API response time
};
```

---

## 🚀 **Comandos de Teste**

### **Scripts NPM**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open",
    "test:performance": "k6 run tests/performance/load.test.js",
    "test:all": "npm run test && npm run test:e2e && npm run test:performance"
  }
}
```

### **CI/CD Pipeline**
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## ✅ **Checklist de Testes**

### **Antes do Deploy**
- [ ] Todos os testes unitários passando
- [ ] Cobertura de código > 70%
- [ ] Testes de integração passando
- [ ] Testes E2E críticos passando
- [ ] Performance dentro dos limites
- [ ] Testes de segurança passando

### **Testes Manuais**
- [ ] Fluxo completo de signup/login
- [ ] Criação e uso de agentes
- [ ] Upload e processamento de documentos
- [ ] Geração de documentos finais
- [ ] Responsividade em diferentes dispositivos
- [ ] Compatibilidade cross-browser

### **Monitoramento Contínuo**
- [ ] Alertas de performance configurados
- [ ] Logs de erro monitorados
- [ ] Métricas de uso coletadas
- [ ] Feedback de usuários capturado

---

**🧪 This guide ensures quality and reliability in all aspects of LexAI through a comprehensive testing strategy.**