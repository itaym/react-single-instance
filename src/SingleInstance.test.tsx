import { StrictMode, useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { SingleInstance } from './SingleInstance';
import { initSingleInstance, __resetSingleInstanceForTests } from './registry';

beforeEach(() => {
  __resetSingleInstanceForTests();
  initSingleInstance();
});

describe('SingleInstance', () => {
  it('renders its children on a normal single render', () => {
    render(<SingleInstance id="a">content</SingleInstance>);
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('still renders once under React.StrictMode double-invoke', () => {
    render(
      <StrictMode>
        <SingleInstance id="b">content</SingleInstance>
      </StrictMode>,
    );
    expect(screen.getAllByText('content')).toHaveLength(1);
  });

  it('keeps rendering across many later re-renders of the same instance', () => {
    // regression test: an earlier version of this logic had no per-instance memory and broke after 2 re-renders
    function Counter() {
      const [n, setN] = useState(0);
      return (
        <div>
          <button onClick={() => setN((v) => v + 1)}>bump</button>
          <SingleInstance id="counter">content {n}</SingleInstance>
        </div>
      );
    }
    render(
      <StrictMode>
        <Counter />
      </StrictMode>,
    );
    const button = screen.getByText('bump');
    for (let i = 0; i < 5; i++) fireEvent.click(button);
    expect(screen.getByText('content 5')).toBeInTheDocument();
  });

  it('a third claimant for the same id is rejected', () => {
    render(
      <>
        <SingleInstance id="c">
          <span>first</span>
        </SingleInstance>
        <SingleInstance id="c">
          <span>second</span>
        </SingleInstance>
        <SingleInstance id="c">
          <span>third</span>
        </SingleInstance>
      </>,
    );
    expect(screen.getByText('first')).toBeInTheDocument();
    expect(screen.getByText('second')).toBeInTheDocument();
    expect(screen.queryByText('third')).not.toBeInTheDocument();
  });

  it('under StrictMode, a second call site sharing an id is fully rejected', () => {
    // the first call site's own double-invoke spends both slots for "d"
    render(
      <StrictMode>
        <SingleInstance id="d">first</SingleInstance>
        <SingleInstance id="d">second</SingleInstance>
      </StrictMode>,
    );
    expect(screen.getByText('first')).toBeInTheDocument();
    expect(screen.queryByText('second')).not.toBeInTheDocument();
  });

  it('lets a blocked id render again after initSingleInstance() resets it', () => {
    render(
      <>
        <SingleInstance id="e">first</SingleInstance>
        <SingleInstance id="e">second</SingleInstance>
        <SingleInstance id="e">blocked</SingleInstance>
      </>,
    );
    expect(screen.queryByText('blocked')).not.toBeInTheDocument();

    initSingleInstance();
    render(<SingleInstance id="e">renders after reset</SingleInstance>);
    expect(screen.getByText('renders after reset')).toBeInTheDocument();
  });
});
