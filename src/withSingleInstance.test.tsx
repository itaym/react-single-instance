import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { withSingleInstance } from './withSingleInstance';
import { initSingleInstance, __resetSingleInstanceForTests } from './registry';

beforeEach(() => {
  __resetSingleInstanceForTests();
  initSingleInstance();
});

function Banner({ text }: { text: string }) {
  return <div>{text}</div>;
}

describe('withSingleInstance', () => {
  it('rejects a third wrapped instance sharing an id', () => {
    const GuardedA = withSingleInstance(Banner, 'hoc-a');
    const GuardedB = withSingleInstance(Banner, 'hoc-a');
    const GuardedC = withSingleInstance(Banner, 'hoc-a');

    render(
      <>
        <GuardedA text="first" />
        <GuardedB text="second" />
        <GuardedC text="third" />
      </>,
    );

    expect(screen.getByText('first')).toBeInTheDocument();
    expect(screen.getByText('second')).toBeInTheDocument();
    expect(screen.queryByText('third')).not.toBeInTheDocument();
  });

  it('forwards props to the wrapped component', () => {
    const Guarded = withSingleInstance(Banner, 'hoc-b');
    render(<Guarded text="hello" />);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('sets a readable displayName', () => {
    const Guarded = withSingleInstance(Banner, 'hoc-c');
    expect(Guarded.displayName).toBe('withSingleInstance(Banner)');
  });
});
