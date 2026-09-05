# react-single-instance

![npm version](https://img.shields.io/npm/v/react-single-instance?logo=npm&logoColor=white) ![bundle size](https://img.shields.io/bundlephobia/minzip/react-single-instance?logo=javascript&logoColor=white) ![License](https://img.shields.io/npm/l/react-single-instance?logo=open-source-initiative)

Render something at most once for a given `id`, app-wide - a component, a hook, and a HOC, all sharing one registry. Useful for a modal root, a toast host, or any other element that must exist exactly once even if it gets mounted from more than one place by mistake.

| | first claimant | every claimant after it |
| --- | --- | --- |
| `<SingleInstance id="x">children</SingleInstance>` | renders `children` | renders nothing |
| `useSingleInstance('x')` | returns `true` | returns `false` |
| `withSingleInstance(Component, 'x')` | renders `<Component />` | renders nothing |

```bash
npm i react-single-instance
```

```tsx
import { initSingleInstance, SingleInstance, useSingleInstance, withSingleInstance } from 'react-single-instance';

// once, at app startup, before anything below renders
initSingleInstance();
```

## `<SingleInstance>`

```tsx
<SingleInstance id="modal-root">
  <ModalHost />
</SingleInstance>
```

If a second `<SingleInstance id="modal-root">` mounts anywhere else in the tree, it renders nothing.

## `useSingleInstance`

```tsx
function ModalHost() {
  const granted = useSingleInstance('modal-root');
  return granted ? <div className="modal-host" /> : null;
}
```

## `withSingleInstance`

```tsx
const GuardedModalHost = withSingleInstance(ModalHost, 'modal-root');
```

## Why this needs `initSingleInstance()`

`React.StrictMode` invokes a function component's render body twice, back to back, in development only. There's no purity-safe way, from inside render, to tell "this is my own StrictMode replay" apart from "this is a genuinely different caller" - so the registry allows exactly two claims per id before rejecting the rest, which absorbs StrictMode's double-invoke without ever risking a real mount silently rendering nothing.

`initSingleInstance()` resets the registry. Call it once, synchronously, before your app renders anything that uses an id you care about - a hot reload, a new test, or a route remount that should be allowed to claim an id again all need this. Skipping it doesn't break anything by itself, but you'll get a console warning the first time an id is claimed, since un-reset ids never free up.

**Known limitation:** two genuinely different call sites that both mount with the same `id` in the same commit, *outside* of StrictMode, will both be granted - the two-slot slack that makes StrictMode safe is indistinguishable, from inside render, from two real callers. Run under StrictMode (React's development default) and a real duplicate's own two extra invocations get caught immediately; without it, a duplicate that stays mounted is still caught the moment a third claimant shows up, or after the next `initSingleInstance()` cycle.

## Playground

An interactive demo of all three APIs side by side, with the source for each shown right next to it:

```bash
npm run playground
```

Click "mount another claimant" to watch new attempts get rejected live, "re-render" to confirm a granted instance never loses its slot, and "unmount" to see that removing a claimant doesn't free its id - only `initSingleInstance()` does that.

## Development

```bash
npm install
npm run build          # tsup: ESM + CJS + d.ts
npm test               # Vitest (happy-dom)
npm run test:coverage
npm run playground     # http://localhost:4174
```

## Have a good productive day :)

If you like this package please consider donation <a href="https://paypal.me/ItayMerchav?locale.x=en_US" target="_blank">Click Here</a>

## License

MIT © 2026 Itay Merchav
