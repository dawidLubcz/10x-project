import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock the Skeleton component
vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={`skeleton ${className || ''}`}></div>
  )
}));

import UserInfo from '@/components/UserInfo';

describe('UserInfo Component', () => {
  it('renders loading state correctly', () => {
    // Given: component is in loading state (user=null, isLoading=true)
    
    // When: rendering the UserInfo component
    render(<UserInfo user={null} isLoading={true} />);
    
    // Then: it should display the header and skeleton placeholders
    expect(screen.getByText('Informacje o profilu')).toBeInTheDocument();
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders error state when no user data is provided', () => {
    // Given: component has no user data and not loading (isLoading=false)
    
    // When: rendering the UserInfo component
    render(<UserInfo user={null} isLoading={false} />);
    
    // Then: it should display the profile load error message
    expect(screen.getByText('Nie udało się załadować danych profilu.')).toBeInTheDocument();
  });

  it('renders user information correctly', () => {
    // Given: component has valid user data and not loading (isLoading=false)
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      created_at: '2023-01-01T00:00:00Z',
    };
    
    // When: rendering the UserInfo component
    render(<UserInfo user={mockUser} isLoading={false} />);
    
    // Then: it should display the user email and formatted creation date
    expect(screen.getByText('Informacje o profilu')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Data utworzenia konta')).toBeInTheDocument();
    // Date formatting might be different depending on locale, so we check for partial content
    expect(screen.getByText(/01\.01\.2023/)).toBeInTheDocument();
  });
}); 