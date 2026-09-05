import { useRef } from 'react';
import { claimSingleInstance } from './registry';

// Memoized so a settled instance never re-consults the registry on later re-renders (see README).
export function useSingleInstance(id: string): boolean {
  const settled = useRef<boolean | undefined>(undefined);
  if (settled.current === undefined) {
    settled.current = claimSingleInstance(id);
  }
  return settled.current;
}
