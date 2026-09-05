import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { claimSingleInstance, initSingleInstance, __resetSingleInstanceForTests } from './registry';

beforeEach(() => {
  __resetSingleInstanceForTests();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('claimSingleInstance', () => {
  it('allows exactly two claims per id, then rejects the rest', () => {
    initSingleInstance();
    expect(claimSingleInstance('x')).toBe(true);
    expect(claimSingleInstance('x')).toBe(true);
    expect(claimSingleInstance('x')).toBe(false);
    expect(claimSingleInstance('x')).toBe(false);
  });

  it('tracks each id independently', () => {
    initSingleInstance();
    expect(claimSingleInstance('x')).toBe(true);
    expect(claimSingleInstance('y')).toBe(true);
    expect(claimSingleInstance('y')).toBe(true);
    expect(claimSingleInstance('y')).toBe(false);
    expect(claimSingleInstance('x')).toBe(true);
  });

  it('warns once per un-initialized claim outside production', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    claimSingleInstance('never-initialized');
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('initSingleInstance()');
  });

  it('does not warn once initialized', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    initSingleInstance();
    claimSingleInstance('z');
    expect(warn).not.toHaveBeenCalled();
  });

  it('does not warn in production even when un-initialized', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.stubEnv('NODE_ENV', 'production');
    claimSingleInstance('prod-id');
    expect(warn).not.toHaveBeenCalled();
    vi.unstubAllEnvs();
  });
});
