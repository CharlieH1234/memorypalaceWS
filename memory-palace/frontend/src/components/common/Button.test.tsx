import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with label', () => {
    render(<Button label="Test Button" />);
    const button = screen.getByText('Test Button');
    expect(button).toBeDefined();
  });
});
