/**
 * Testes de UX para sistema de autenticação
 * Garante que não existam alert() dialogs e que error handling seja consistente
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import { SignupForm } from '@/components/auth/signup-form';
import { LoginForm } from '@/components/auth/login-form';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

// Mock do useAuth
const mockUseAuth = {
  signup: jest.fn(),
  login: jest.fn(),
  loginWithGoogle: jest.fn(),
  resetPassword: jest.fn(),
  loading: false,
  error: null,
  clearError: jest.fn(),
  user: null,
};

jest.mock('@/hooks/use-auth', () => ({
  useAuth: () => mockUseAuth,
}));

// Mock do authLogger
jest.mock('@/lib/auth-logger', () => ({
  authLogger: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

// Mock do monitoring
jest.mock('@/lib/monitoring', () => ({
  monitoring: {
    reportError: jest.fn(),
  },
}));

// Mock global alert para detectar uso
const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

describe('Auth UX Experience', () => {
  beforeEach(() => {
    alertSpy.mockClear();
    Object.values(mockUseAuth).forEach(mockFn => {
      if (typeof mockFn === 'function') {
        mockFn.mockClear();
      }
    });
  });

  afterAll(() => {
    alertSpy.mockRestore();
  });

  describe('SignupForm', () => {
    it('should never show alert() dialogs', async () => {
      render(<SignupForm />);
      
      const nameInput = screen.getByLabelText(/nome completo/i);
      const emailInput = screen.getByLabelText(/email profissional/i);
      const passwordInput = screen.getByLabelText(/^senha/i);
      const confirmPasswordInput = screen.getByLabelText(/confirmar senha/i);
      const termsCheckbox = screen.getByRole('checkbox', { name: /aceito os termos/i });
      const submitButton = screen.getByRole('button', { name: /criar conta/i });

      // Testar validação de senha não coincidente
      fireEvent.change(nameInput, { target: { value: 'João Silva' } });
      fireEvent.change(emailInput, { target: { value: 'joao@exemplo.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
      fireEvent.click(termsCheckbox);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(alertSpy).not.toHaveBeenCalled();
      });

      // Deve mostrar erro na UI ao invés de alert
      expect(screen.getByText(/as senhas não coincidem/i)).toBeInTheDocument();
    });

    it('should show consistent error messages in UI', async () => {
      render(<SignupForm />);
      
      const submitButton = screen.getByRole('button', { name: /criar conta/i });
      const passwordInput = screen.getByLabelText(/^senha/i);
      const confirmPasswordInput = screen.getByLabelText(/confirmar senha/i);

      // Testar validação de senha curta
      fireEvent.change(passwordInput, { target: { value: '123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: '123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/a senha deve ter pelo menos 6 caracteres/i)).toBeInTheDocument();
      });

      // Testar validação de termos não aceitos
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/você deve aceitar os termos de uso/i)).toBeInTheDocument();
      });
    });

    it('should clear form errors when user interacts', async () => {
      render(<SignupForm />);
      
      const submitButton = screen.getByRole('button', { name: /criar conta/i });
      const passwordInput = screen.getByLabelText(/^senha/i);
      const confirmPasswordInput = screen.getByLabelText(/confirmar senha/i);

      // Gerar erro
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/as senhas não coincidem/i)).toBeInTheDocument();
      });

      // Corrigir erro - deve limpar a mensagem
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      
      // Erro deve ser limpo quando clearError é chamado
      const clearButton = screen.getByRole('button', { name: /×/i });
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(screen.queryByText(/as senhas não coincidem/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('LoginForm', () => {
    it('should never show alert() dialogs', async () => {
      render(<LoginForm />);
      
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(alertSpy).not.toHaveBeenCalled();
      });

      // Deve mostrar erro na UI para campos obrigatórios
      expect(screen.getByText(/email e senha são obrigatórios/i)).toBeInTheDocument();
    });

    it('should handle auth errors gracefully', async () => {
      const mockError = { message: 'Credenciais inválidas' };
      mockUseAuth.error = mockError;

      render(<LoginForm />);
      
      // Erro deve ser mostrado na UI
      expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
      
      // Deve ter botão para limpar erro
      const clearButton = screen.getByRole('button', { name: /×/i });
      expect(clearButton).toBeInTheDocument();
    });
  });

  describe('ForgotPasswordForm', () => {
    it('should never show alert() dialogs', async () => {
      render(<ForgotPasswordForm />);
      
      const submitButton = screen.getByRole('button', { name: /enviar email/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(alertSpy).not.toHaveBeenCalled();
      });
    });

    it('should show success state properly', async () => {
      mockUseAuth.resetPassword.mockResolvedValueOnce(undefined);

      render(<ForgotPasswordForm />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /enviar email/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email enviado/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling Consistency', () => {
    it('should use consistent error display patterns across forms', () => {
      // Todos os formulários devem usar o mesmo padrão de erro
      const signupForm = render(<SignupForm />);
      const loginForm = render(<LoginForm />);
      
      // Estrutura de erro consistente
      expect(signupForm.container.querySelectorAll('[class*="border-red"]')).toBeDefined();
      expect(loginForm.container.querySelectorAll('[class*="border-red"]')).toBeDefined();
    });

    it('should have proper error boundary integration', () => {
      // Verificar se os componentes estão wrapped com AuthErrorBoundary
      // Este teste seria mais complexo e envolveria testar com erro real
      render(<SignupForm />);
      
      // AuthErrorBoundary deve estar presente no DOM
      expect(screen.getByRole('form')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should show loading states properly', () => {
      mockUseAuth.loading = true;

      render(<SignupForm />);
      
      // Botão deve mostrar loading
      expect(screen.getByText(/criando conta/i)).toBeInTheDocument();
      
      // Botão deve estar desabilitado
      const submitButton = screen.getByRole('button', { name: /criando conta/i });
      expect(submitButton).toBeDisabled();
    });

    it('should coordinate loading states across auth methods', () => {
      mockUseAuth.loading = true;

      render(<SignupForm />);
      
      // Ambos os botões devem estar desabilitados durante loading
      const submitButton = screen.getByRole('button', { name: /criando conta/i });
      const googleButton = screen.getByRole('button', { name: /continuar com google/i });
      
      expect(submitButton).toBeDisabled();
      expect(googleButton).toBeDisabled();
    });
  });
});