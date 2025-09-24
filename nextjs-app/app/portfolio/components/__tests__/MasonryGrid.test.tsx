import { render, screen } from '@testing-library/react';
import MasonryGrid from '../MasonryGrid';

// Mock the hooks
jest.mock('../hooks/useResponsiveColumns', () => ({
  useResponsiveColumns: () => ({ currentColumns: 3 }),
  useResponsiveGap: () => 24
}));

describe('MasonryGrid', () => {
  const mockChildren = [
    <div key="1" data-testid="item-1">Item 1</div>,
    <div key="2" data-testid="item-2">Item 2</div>,
    <div key="3" data-testid="item-3">Item 3</div>
  ];

  it('renders children correctly', () => {
    render(
      <MasonryGrid columns={{ sm: 1, md: 2, lg: 3, xl: 3 }}>
        {mockChildren}
      </MasonryGrid>
    );

    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
    expect(screen.getByTestId('item-3')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <MasonryGrid className="custom-class">
        {mockChildren}
      </MasonryGrid>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles empty children array', () => {
    const { container } = render(
      <MasonryGrid>
        {[]}
      </MasonryGrid>
    );

    expect(container.firstChild).toBeInTheDocument();
  });
});