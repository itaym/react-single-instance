const counts = new Map<string, number>();

/** Optional manual reset, e.g. in tests — never required for normal use. */
export function initSingleInstance(): void {
  counts.clear();
}

/** @internal exposed for tests only */
export function __resetSingleInstanceForTests(): void {
  counts.clear();
}

export function claimSingleInstance(id: string): boolean {

  const slack = process.env.NODE_ENV === 'production' ? 1 : 2;

  const count = counts.get(id) ?? 0;
  if (count >= slack) return false;

  counts.set(id, count + 1);
  return true;
}

export function releaseSingleInstance(id: string): void {
  const count = counts.get(id) ?? 0;
  if (count <= 1) counts.delete(id);
  else counts.set(id, count - 1);
}
