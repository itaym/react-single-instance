// React.StrictMode double-invokes render in dev; both calls must succeed since we can't tell which gets committed (see README).
const STRICT_MODE_SLACK = 2;

const counts = new Map<string, number>();
let initialized = false;

export function initSingleInstance(): void {
  initialized = true;
  counts.clear();
}

/** @internal exposed for tests only */
export function __resetSingleInstanceForTests(): void {
  counts.clear();
  initialized = false;
}

export function claimSingleInstance(id: string): boolean {
  if (!initialized && process.env.NODE_ENV !== 'production') {
    console.warn(
      `[react-single-instance] "${id}" rendered before initSingleInstance() ran. ` +
        'Call initSingleInstance() once at app startup - otherwise ids never reset ' +
        'between test runs, hot reloads, or route remounts.',
    );
  }

  const count = counts.get(id) ?? 0;
  if (count >= STRICT_MODE_SLACK) return false;

  counts.set(id, count + 1);
  return true;
}
