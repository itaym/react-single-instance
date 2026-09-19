import { useEffect, useRef } from 'react';
import { claimSingleInstance, releaseSingleInstance } from './registry';

export function useSingleInstance(id: string): boolean {
  const settled = useRef<boolean | undefined>(undefined);
  if (settled.current === undefined) {
    settled.current = claimSingleInstance(id);
  }

  useEffect(() => () => releaseSingleInstance(id), [id]);

  return settled.current;
}
