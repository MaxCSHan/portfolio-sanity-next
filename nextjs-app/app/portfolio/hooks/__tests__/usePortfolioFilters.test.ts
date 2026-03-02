/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePortfolioFilters } from '../usePortfolioFilters';

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockPush = jest.fn();
const mockSearchParams = new URLSearchParams();

beforeEach(() => {
  jest.clearAllMocks();
  (useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
  });
  (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
});

describe('usePortfolioFilters', () => {
  const initialFilters = {
    category: null,
    search: null,
    featured: null,
    technologies: null,
  };

  it('should initialize with correct state', () => {
    const { result } = renderHook(() => usePortfolioFilters(initialFilters));

    expect(result.current.searchInput).toBe('');
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it('should detect active filters correctly', () => {
    const filtersWithCategory = {
      ...initialFilters,
      category: 'coding',
    };

    const { result } = renderHook(() => usePortfolioFilters(filtersWithCategory));

    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('should handle technology toggle correctly', () => {
    const { result } = renderHook(() => usePortfolioFilters(initialFilters));

    act(() => {
      result.current.toggleTechnology('React');
    });

    expect(mockPush).toHaveBeenCalledWith('/portfolio?technologies=React');
  });

  it('should handle category toggle correctly', () => {
    const { result } = renderHook(() => usePortfolioFilters(initialFilters));

    act(() => {
      result.current.toggleCategory('coding');
    });

    expect(mockPush).toHaveBeenCalledWith('/portfolio?category=coding');
  });

  it('should clear all filters correctly', () => {
    const filtersWithData = {
      category: 'coding',
      search: 'test',
      featured: true,
      technologies: ['React', 'TypeScript'],
    };

    const { result } = renderHook(() => usePortfolioFilters(filtersWithData));

    act(() => {
      result.current.clearAllFilters();
    });

    expect(mockPush).toHaveBeenCalledWith('/portfolio');
  });

  it('should handle search input changes', () => {
    const { result } = renderHook(() => usePortfolioFilters(initialFilters));

    act(() => {
      result.current.updateSearchWithDebounce('test query');
    });

    expect(result.current.searchInput).toBe('test query');
  });
});