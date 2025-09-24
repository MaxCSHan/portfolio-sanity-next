'use client';

import { useState, useEffect } from 'react';

interface ColumnConfig {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

interface BreakpointConfig {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

const defaultBreakpoints: BreakpointConfig = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280
};

export function useResponsiveColumns(
  columns: ColumnConfig,
  breakpoints: BreakpointConfig = defaultBreakpoints
) {
  const [currentColumns, setCurrentColumns] = useState(columns.lg);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<keyof ColumnConfig>('lg');

  useEffect(() => {
    const updateColumns = () => {
      if (typeof window === 'undefined') return;
      
      const width = window.innerWidth;
      let newColumns: number;
      let newBreakpoint: keyof ColumnConfig;
      
      if (width < breakpoints.sm) {
        newColumns = columns.sm;
        newBreakpoint = 'sm';
      } else if (width < breakpoints.md) {
        newColumns = columns.sm;
        newBreakpoint = 'sm';
      } else if (width < breakpoints.lg) {
        newColumns = columns.md;
        newBreakpoint = 'md';
      } else if (width < breakpoints.xl) {
        newColumns = columns.lg;
        newBreakpoint = 'lg';
      } else {
        newColumns = columns.xl;
        newBreakpoint = 'xl';
      }
      
      if (newColumns !== currentColumns) {
        setCurrentColumns(newColumns);
        setCurrentBreakpoint(newBreakpoint);
      }
    };

    // Initial calculation
    updateColumns();
    
    // Add resize listener
    window.addEventListener('resize', updateColumns);
    
    return () => {
      window.removeEventListener('resize', updateColumns);
    };
  }, [columns, breakpoints, currentColumns]);

  return {
    currentColumns,
    currentBreakpoint,
    isSmall: currentBreakpoint === 'sm',
    isMedium: currentBreakpoint === 'md',
    isLarge: currentBreakpoint === 'lg',
    isExtraLarge: currentBreakpoint === 'xl'
  };
}

// Hook for getting optimal column configuration based on content
export function useOptimalColumns(itemCount: number, minItemsPerColumn = 3) {
  const getOptimalConfig = (): ColumnConfig => {
    if (itemCount <= minItemsPerColumn) {
      return { sm: 1, md: 1, lg: 1, xl: 1 };
    }
    if (itemCount <= minItemsPerColumn * 2) {
      return { sm: 1, md: 2, lg: 2, xl: 2 };
    }
    if (itemCount <= minItemsPerColumn * 3) {
      return { sm: 1, md: 2, lg: 3, xl: 3 };
    }
    return { sm: 1, md: 2, lg: 3, xl: 4 };
  };

  return getOptimalConfig();
}

// Hook for responsive gap sizing
export function useResponsiveGap(
  gaps: { sm: number; md: number; lg: number; xl: number } = { sm: 16, md: 20, lg: 24, xl: 32 },
  breakpoints: BreakpointConfig = defaultBreakpoints
) {
  const [currentGap, setCurrentGap] = useState(gaps.lg);

  useEffect(() => {
    const updateGap = () => {
      if (typeof window === 'undefined') return;
      
      const width = window.innerWidth;
      let newGap: number;
      
      if (width < breakpoints.sm) {
        newGap = gaps.sm;
      } else if (width < breakpoints.md) {
        newGap = gaps.sm;
      } else if (width < breakpoints.lg) {
        newGap = gaps.md;
      } else if (width < breakpoints.xl) {
        newGap = gaps.lg;
      } else {
        newGap = gaps.xl;
      }
      
      if (newGap !== currentGap) {
        setCurrentGap(newGap);
      }
    };

    updateGap();
    window.addEventListener('resize', updateGap);
    
    return () => {
      window.removeEventListener('resize', updateGap);
    };
  }, [gaps, breakpoints, currentGap]);

  return currentGap;
}