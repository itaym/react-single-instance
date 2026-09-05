import { useState } from 'react';
import { SingleInstance, useSingleInstance, withSingleInstance, initSingleInstance } from 'react-single-instance';
import { CodeBlock } from './CodeBlock';
import './App.css';

function useClaimants(initial = 1) {
  const [keys, setKeys] = useState<number[]>(() => Array.from({ length: initial }, (_, i) => i));
  const add = () => setKeys((ks) => [...ks, (ks.at(-1) ?? -1) + 1]);
  const remove = (k: number) => setKeys((ks) => ks.filter((x) => x !== k));
  return { keys, add, remove };
}

function Toolbar({ onAdd }: { onAdd: () => void }) {
  return (
    <button className="add-btn" onClick={onAdd}>
      + mount another claimant
    </button>
  );
}

// --- Component API -----------------------------------------------------

function ComponentSection() {
  const { keys, add, remove } = useClaimants();
  return (
    <section className="demo-section accent-component">
      <h2>
        <code>&lt;SingleInstance&gt;</code> <span className="tag">component</span>
      </h2>
      <p>Every row below mounts a new element with the same id. Only the first ever gets the green pill.</p>
      <CodeBlock code={`<SingleInstance id="demo-component">\n  <Pill />\n</SingleInstance>`} />
      <Toolbar onAdd={add} />
      <ul className="claim-list">
        {keys.map((k) => (
          <li key={k} className="claim-row">
            <span className="claim-index">#{k + 1}</span>
            <div className="claim-slot">
              <SingleInstance id="demo-component">
                <span className="pill granted">✅ granted - renders its children</span>
              </SingleInstance>
            </div>
            <button className="remove-btn" onClick={() => remove(k)}>
              unmount
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

// --- Hook API ------------------------------------------------------------

function HookClaimant() {
  const [renders, setRenders] = useState(0);
  const granted = useSingleInstance('demo-hook');
  return (
    <>
      <div className="claim-slot">
        {granted ? (
          <span className="pill granted">✅ granted</span>
        ) : (
          <span className="pill rejected">❌ rejected</span>
        )}
      </div>
      <button className="bump-btn" onClick={() => setRenders((n) => n + 1)}>
        re-render ({renders})
      </button>
    </>
  );
}

function HookSection() {
  const { keys, add, remove } = useClaimants();
  return (
    <section className="demo-section accent-hook">
      <h2>
        <code>useSingleInstance</code> <span className="tag">hook</span>
      </h2>
      <p>
        The hook returns the boolean directly, so a rejected claimant can still render its own UI. Click "re-render" a
        few times on a granted row - it stays granted forever, instead of flipping to rejected the way the original
        buggy version did.
      </p>
      <CodeBlock
        code={`function Pill() {\n  const granted = useSingleInstance('demo-hook');\n  return granted ? <span>granted</span> : <span>rejected</span>;\n}`}
      />
      <Toolbar onAdd={add} />
      <ul className="claim-list">
        {keys.map((k) => (
          <li key={k} className="claim-row">
            <span className="claim-index">#{k + 1}</span>
            <HookClaimant />
            <button className="remove-btn" onClick={() => remove(k)}>
              unmount
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

// --- HOC API ---------------------------------------------------------------

function Pill() {
  return <span className="pill granted">✅ granted - renders its children</span>;
}
const GuardedPill = withSingleInstance(Pill, 'demo-hoc');

function HocSection() {
  const { keys, add, remove } = useClaimants();
  return (
    <section className="demo-section accent-hoc">
      <h2>
        <code>withSingleInstance</code> <span className="tag">HOC</span>
      </h2>
      <p>
        A higher-order component: it takes your component and an id, and hands back a new component that only ever
        renders once - same registry as the other two, just wrapped ahead of time instead of called inline.
      </p>
      <CodeBlock code={`const GuardedPill = withSingleInstance(Pill, 'demo-hoc');\n\n<GuardedPill />`} />
      <Toolbar onAdd={add} />
      <ul className="claim-list">
        {keys.map((k) => (
          <li key={k} className="claim-row">
            <span className="claim-index">#{k + 1}</span>
            <div className="claim-slot">
              <GuardedPill />
            </div>
            <button className="remove-btn" onClick={() => remove(k)}>
              unmount
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

// --- App -------------------------------------------------------------------

export default function App() {
  const [resetCount, setResetCount] = useState(0);

  return (
    <main key={resetCount}>
      <header className="hero">
        <h1>react-single-instance</h1>
        <span className="strict-badge" title="Every render below runs twice in dev, back to back">
          ⚛ running inside &lt;StrictMode&gt;
        </span>
      </header>
      <p className="intro">
        Mount and unmount claimants live to see the registry in action. Unmounting a granted row does <em>not</em> free
        its id - that only happens on reset, below.
      </p>

      <button
        className="reset-btn"
        onClick={() => {
          initSingleInstance();
          setResetCount((v) => v + 1);
        }}
      >
        ↺ initSingleInstance() + remount everything
      </button>

      <ComponentSection />
      <HookSection />
      <HocSection />
    </main>
  );
}
