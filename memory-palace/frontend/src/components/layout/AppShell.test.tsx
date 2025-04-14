import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { AppShell } from './AppShell';

// Mock Supabase client
vi.mock('../../services/supabase/config', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        limit: () => ({ error: null })
      })
    })
  }
}));

describe('AppShell Component', () => {
  it('renders header and environment information', () => {
    render(<AppShell />);
    
    // Check header
    expect(screen.getByText('Memory Palace')).toBeDefined();
    
    // Check environment info
    expect(screen.getByText('Environment:')).toBeDefined();
    expect(screen.getByText('Supabase URL:')).toBeDefined();
    expect(screen.getByText('Connection Status:')).toBeDefined();
  });

  it('shows connection status', async () => {
    render(<AppShell />);
    
    // Initially shows checking
    expect(screen.getByText('Checking...')).toBeDefined();
    
    // Wait for connection check to complete
    await waitFor(() => {
      expect(screen.getByText('Connected')).toBeDefined();
    });
  });

  it('displays application version information', () => {
    render(<AppShell />);
    
    expect(screen.getByText('Frontend Version:')).toBeDefined();
    expect(screen.getByText('React Version:')).toBeDefined();
  });
});
