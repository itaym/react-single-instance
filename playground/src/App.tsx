import { useState } from 'react';
import { SingleInstance, useSingleInstance, withSingleInstance, initSingleInstance } from 'react-single-instance';
import './App.css';

function Toast({ text }: { text: string }) {
  return <div className="toast">{text}</div>;
}
const GuardedToast = withSingleInstance(Toast, 'toast-root');

function HookCounter() {
  const [n, setN] = useState(0);
  const granted = useSingleInstance('hook-counter');
  return (
    <div className="card">
      <button onClick={() => setN((v) => v + 1)}>re-render this component ({n})</button>
      <p>
        {granted ? '✅ still granted' : '❌ rejected'} - click to re-render this component. An earlier version of this
        logic had no per-instance memory, so under StrictMode its shared counter was already exhausted by mount time -
        the very first click here would have flipped it to ❌.
      </p>
    </div>
  );
}

export default function App() {
  const [resetCount, setResetCount] = useState(0);

  return (
    <main key={resetCount}>
      <h1>react-single-instance playground</h1>
      <p>
        Rendered inside <code>&lt;StrictMode&gt;</code>, which double-invokes every render in development - open the
        console to see the "not initialized" warning is gone because <code>main.tsx</code> calls{' '}
        <code>initSingleInstance()</code> on startup.
      </p>

      <button
        onClick={() => {
          initSingleInstance();
          setResetCount((v) => v + 1);
        }}
      >
        initSingleInstance() + remount everything below
      </button>

      <section>
        <h2>Component: two call sites, one id</h2>
        <p>Both of these use id="modal-root" - only the first one renders:</p>
        <SingleInstance id="modal-root">
          <div className="modal">Modal A (first call site)</div>
        </SingleInstance>
        <SingleInstance id="modal-root">
          <div className="modal">Modal B (second call site - should not appear)</div>
        </SingleInstance>
      </section>

      <section>
        <h2>Hook: survives many re-renders</h2>
        <HookCounter />
      </section>

      <section>
        <h2>HOC: two wrapped call sites, one id</h2>
        <GuardedToast text="Toast A (first call site)" />
        <GuardedToast text="Toast B (second call site - should not appear)" />
      </section>
    </main>
  );
}
