import React from 'react';

// Mock for the Skeleton component
export const Skeleton = ({ className }: { className?: string }) => (
  <div data-testid="skeleton" className={`skeleton ${className || ''}`}></div>
);

// Add more component mocks as needed 