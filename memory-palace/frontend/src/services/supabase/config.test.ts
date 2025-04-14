import { describe, it, expect, vi } from 'vitest';
import { testConnection } from './config';

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    supabaseUrl: 'https://example.supabase.co',
    auth: {},
    from: () => ({
      select: () => ({
        limit: () => ({ error: null })
      })
    })
  }))
}));

describe('Supabase Configuration', () => {
  it('tests database connection', async () => {
    const isConnected = await testConnection();
    expect(isConnected).toBe(true);
  });
});
