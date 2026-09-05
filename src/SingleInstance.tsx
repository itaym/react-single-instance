import type { ReactNode } from 'react';
import { useSingleInstance } from './useSingleInstance';

export interface SingleInstanceProps {
  id: string;
  children: ReactNode;
}

export function SingleInstance({ id, children }: SingleInstanceProps): ReactNode {
  return useSingleInstance(id) ? children : null;
}

export default SingleInstance;
