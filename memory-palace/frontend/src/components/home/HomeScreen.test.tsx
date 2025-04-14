import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HomeScreen } from './HomeScreen';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock the AuthContext
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { email: 'test@example.com' },
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('HomeScreen Component', () => {
  it('renders user profile with email initial', () => {
    render(
      <AuthProvider>
        <HomeScreen />
      </AuthProvider>
    );
    
    const avatar = screen.getByText('T');
    const email = screen.getByText('test@example.com');
    
    expect(avatar).toBeInTheDocument();
    expect(email).toBeInTheDocument();
  });

  it('renders navigation menu with correct items', () => {
    render(
      <AuthProvider>
        <HomeScreen />
      </AuthProvider>
    );
    
    // Use more specific queries to avoid ambiguity
    const navButton = screen.getByRole('button', { name: 'My Memory Palaces' });
    const recentButton = screen.getByRole('button', { name: 'Recent' });
    const sharedButton = screen.getByRole('button', { name: 'Shared' });
    const templatesButton = screen.getByRole('button', { name: 'Templates' });
    
    expect(navButton).toBeInTheDocument();
    expect(recentButton).toBeInTheDocument();
    expect(sharedButton).toBeInTheDocument();
    expect(templatesButton).toBeInTheDocument();
  });

  it('renders empty state when no memory palaces exist', () => {
    render(
      <AuthProvider>
        <HomeScreen />
      </AuthProvider>
    );
    
    const emptyHeader = screen.getByRole('heading', { name: 'No Memory Palaces Yet' });
    const emptyText = screen.getByText('Create your first memory palace to get started');
    
    expect(emptyHeader).toBeInTheDocument();
    expect(emptyText).toBeInTheDocument();
  });

  it('has correct layout structure', () => {
    const { container } = render(
      <AuthProvider>
        <HomeScreen />
      </AuthProvider>
    );
    
    const homeScreen = container.querySelector('.home-screen');
    const sidebar = container.querySelector('.sidebar');
    const mainContent = container.querySelector('.main-content');
    
    expect(homeScreen).toBeInTheDocument();
    expect(sidebar).toBeInTheDocument();
    expect(mainContent).toBeInTheDocument();
    
    // Verify responsive classes are present
    expect(homeScreen).toHaveClass('home-screen');
    expect(sidebar).toHaveClass('sidebar');
    expect(mainContent).toHaveClass('main-content');
  });
});
