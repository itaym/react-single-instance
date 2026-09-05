import type { ComponentType } from 'react';
import { useSingleInstance } from './useSingleInstance';

export function withSingleInstance<P extends object>(Component: ComponentType<P>, id: string): ComponentType<P> {
  function WithSingleInstance(props: P) {
    return useSingleInstance(id) ? <Component {...props} /> : null;
  }

  WithSingleInstance.displayName = `withSingleInstance(${Component.displayName || Component.name || 'Component'})`;

  return WithSingleInstance;
}
