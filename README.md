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
import { SingleInstance, useSingleInstance, withSingleInstance } from 'react-single-instance';
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

## `initSingleInstance()`

Not required — claims release automatically when their component unmounts. Kept for compatibility with earlier versions, and as a manual way to reset the registry (e.g. in tests).

## Playground

An interactive demo of all three APIs side by side, with the source for each shown right next to it:

```bash
npm run playground
```

Click "mount another claimant" to watch new attempts get rejected live, "re-render" to confirm a granted instance never loses its slot, and "unmount" to see that removing a claimant frees its id for the next one.

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
