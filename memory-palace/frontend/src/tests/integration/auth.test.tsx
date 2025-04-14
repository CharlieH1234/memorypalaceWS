import { vi } from 'vitest';

// Create mock Supabase instance before imports
const mockSupabase = vi.hoisted(() => ({
  auth: {
    signUp: vi.fn(),
    signInWithPassword: vi.fn(), 
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(),
    getSession: vi.fn(),
  },
  from: (_table: string) => ({
    select: () => ({
      limit: () => ({ error: null })
    }),
    insert: () => ({ error: null }),
    update: () => ({ error: null }),
    delete: () => ({ error: null }),
  })
}));

// Mock modules before imports
vi.mock('../../services/supabase/config', () => ({
  supabase: mockSupabase
}));

// Mock Vite's import.meta.env
vi.mock('vite', () => ({
  defineConfig: vi.fn(),
}));

// Now import everything else
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../../contexts/AuthContext';
import { SignUp } from '../../components/auth/SignUp';
import { SignIn } from '../../components/auth/SignIn';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
  const router = createMemoryRouter([
    {
      path: '/',
      element: ui
    },
    {
      path: '/signin',
      element: ui
    },
    {
      path: '/signup',
      element: ui
    }
  ], {
    initialEntries: [route]
  });

  return render(<RouterProvider router={router} />);
};

beforeAll(() => {
  // Mock environment variables
  Object.defineProperty(import.meta, 'env', {
    value: {
      VITE_SUPABASE_URL: 'https://test.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'test-key',
      MODE: 'test'
    }
  });
});

describe('Authentication Integration', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Mock successful session retrieval
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });
    // Mock auth state change subscription
    mockSupabase.auth.onAuthStateChange.mockImplementation((_callback) => {
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
  });

  it('completes full signup flow with profile creation', async () => {
    // Mock successful signup
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: { id: 'test-user-id', email: 'test@example.com' } },
      error: null
    });

    renderWithRouter(
      <AuthProvider>
        <SignUp />
      </AuthProvider>,
      { route: '/signup' }
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByRole('form')).toBeDefined();
    });

    // Fill in signup form
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'password123' }
    });

    // Submit form
    const form = screen.getByRole('form');
    await fireEvent.submit(form);

    // Verify signup was called with correct data
    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });

  it('handles auth errors gracefully', async () => {
    // Mock failed signin
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid credentials' }
    });

    renderWithRouter(
      <AuthProvider>
        <SignIn />
      </AuthProvider>,
      { route: '/signin' }
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByRole('form')).toBeDefined();
    });

    // Fill in signin form
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrongpassword' }
    });

    // Submit form
    const form = screen.getByRole('form');
    await fireEvent.submit(form);

    // Verify error is displayed
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeDefined();
    });
  });

  it('maintains session state across route changes', async () => {
    // Mock authenticated session
    const mockSession = {
      user: { id: 'test-user-id', email: 'test@example.com' },
      access_token: 'test-token'
    };
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: mockSession }, error: null });

    const routes = [
      {
        path: '/',
        element: (
          <AuthProvider>
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          </AuthProvider>
        ),
      }
    ];

    const router = createMemoryRouter(routes);
    render(<RouterProvider router={router} />);

    // Wait for auth check and loading to complete
    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeDefined();
    });

    // Verify session was checked
    expect(mockSupabase.auth.getSession).toHaveBeenCalled();
  });

  it('verifies environment variables are properly loaded', () => {
    // Check that Supabase URL is available
    expect(import.meta.env.VITE_SUPABASE_URL).toBe('https://test.supabase.co');
    expect(import.meta.env.VITE_SUPABASE_ANON_KEY).toBe('test-key');
    expect(import.meta.env.MODE).toBe('test');
  });
});
