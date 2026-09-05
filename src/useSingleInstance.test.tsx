import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useSingleInstance } from './useSingleInstance';
import { initSingleInstance, __resetSingleInstanceForTests } from './registry';

beforeEach(() => {
  __resetSingleInstanceForTests();
  initSingleInstance();
});

function Consumer({ id, label }: { id: string; label: string }) {
  const canRender = useSingleInstance(id);
  return canRender ? <span>{label}</span> : null;
}

describe('useSingleInstance', () => {
  it('rejects a third caller sharing the same id', () => {
    render(
      <>
        <Consumer id="hook-a" label="first" />
        <Consumer id="hook-a" label="second" />
        <Consumer id="hook-a" label="third" />
      </>,
    );
    expect(screen.getByText('first')).toBeInTheDocument();
    expect(screen.getByText('second')).toBeInTheDocument();
    expect(screen.queryByText('third')).not.toBeInTheDocument();
  });

  it('is independent per id', () => {
    render(
      <>
        <Consumer id="hook-b" label="b" />
        <Consumer id="hook-c" label="c" />
      </>,
    );
    expect(screen.getByText('b')).toBeInTheDocument();
    expect(screen.getByText('c')).toBeInTheDocument();
  });
});
