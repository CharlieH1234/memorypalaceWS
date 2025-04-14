import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { SignIn } from './SignIn';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock the useAuth hook
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    signIn: vi.fn().mockResolvedValue({ error: null }),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('SignIn Component', () => {
  it('renders signin form', () => {
    render(
      <AuthProvider>
        <SignIn />
      </AuthProvider>
    );

    expect(screen.getByLabelText(/email/i)).toBeDefined();
    expect(screen.getByLabelText(/password/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined();
  });

  it('validates required fields', async () => {
    render(
      <AuthProvider>
        <SignIn />
      </AuthProvider>
    );

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    const form = submitButton.closest('form');
    if (!form) throw new Error('Form not found');
    await fireEvent.submit(form);

    expect(await screen.findByText(/all fields are required/i)).toBeDefined();
  });

  it('submits form with valid data', async () => {
    render(
      <AuthProvider>
        <SignIn />
      </AuthProvider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const form = screen.getByRole('form');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    await fireEvent.submit(form);

    expect(screen.queryByText(/all fields are required/i)).toBeNull();
  });
});
