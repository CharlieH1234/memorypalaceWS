import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { SignUp } from './SignUp';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock the useAuth hook
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    signUp: vi.fn().mockResolvedValue({ error: null }),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('SignUp Component', () => {
  it('renders signup form', () => {
    render(
      <AuthProvider>
        <SignUp />
      </AuthProvider>
    );

    expect(screen.getByLabelText(/email/i)).toBeDefined();
    expect(screen.getByLabelText(/^password$/i)).toBeDefined();
    expect(screen.getByLabelText(/confirm password/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeDefined();
  });

  it('validates required fields', async () => {
    render(
      <AuthProvider>
        <SignUp />
      </AuthProvider>
    );

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    const form = submitButton.closest('form');
    if (!form) throw new Error('Form not found');
    await fireEvent.submit(form);

    expect(await screen.findByText(/all fields are required/i)).toBeDefined();
  });

  it('validates password match', async () => {
    render(
      <AuthProvider>
        <SignUp />
      </AuthProvider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const form = screen.getByRole('form');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
    await fireEvent.submit(form);

    expect(await screen.findByText(/passwords do not match/i)).toBeDefined();
  });

  it('validates password length', async () => {
    render(
      <AuthProvider>
        <SignUp />
      </AuthProvider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const form = screen.getByRole('form');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '12345' } });
    fireEvent.change(confirmPasswordInput, { target: { value: '12345' } });
    await fireEvent.submit(form);

    expect(await screen.findByText(/password must be at least 6 characters/i)).toBeDefined();
  });

  it('submits form with valid data', async () => {
    render(
      <AuthProvider>
        <SignUp />
      </AuthProvider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const form = screen.getByRole('form');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    await fireEvent.submit(form);

    expect(screen.queryByText(/passwords do not match/i)).toBeNull();
    expect(screen.queryByText(/all fields are required/i)).toBeNull();
    expect(screen.queryByText(/password must be at least 6 characters/i)).toBeNull();
  });
});
