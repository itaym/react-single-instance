import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  claimSingleInstance,
  initSingleInstance,
  releaseSingleInstance,
  __resetSingleInstanceForTests,
} from './registry';

beforeEach(() => {
  __resetSingleInstanceForTests();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('claimSingleInstance', () => {
  it('allows exactly two claims per id outside production, then rejects the rest', () => {
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

  it('allows exactly one claim per id in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    initSingleInstance();
    expect(claimSingleInstance('p')).toBe(true);
    expect(claimSingleInstance('p')).toBe(false);
  });
});

describe('releaseSingleInstance', () => {
  it('frees a claimed id so it can be claimed again', () => {
    initSingleInstance();
    expect(claimSingleInstance('r')).toBe(true);
    expect(claimSingleInstance('r')).toBe(true);
    expect(claimSingleInstance('r')).toBe(false);
    releaseSingleInstance('r');
    expect(claimSingleInstance('r')).toBe(true);
  });

  it('is a no-op on an id that was never claimed', () => {
    initSingleInstance();
    expect(() => releaseSingleInstance('never-claimed')).not.toThrow();
    expect(claimSingleInstance('never-claimed')).toBe(true);
  });

  it('is a no-op when called more times than claimed', () => {
    initSingleInstance();
    expect(claimSingleInstance('s')).toBe(true);
    releaseSingleInstance('s');
    releaseSingleInstance('s');
    releaseSingleInstance('s');
    expect(claimSingleInstance('s')).toBe(true);
  });
});
