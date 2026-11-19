import React, { useEffect, useReducer, useState } from 'react';
import { initialState, press, keyFromEvent } from './calc.js';

// [label, key, className, keyboard hint]
const KEYS = [
  ['C', 'C', 'fn orange', 'Esc'],
  ['±', 'NEG', 'fn mustard', 'N'],
  ['%', '%', 'fn mustard', '%'],
  ['÷', '/', 'op avocado', '/'],
  ['7', '7'], ['8', '8'], ['9', '9'],
  ['×', '*', 'op avocado', 'X'],
  ['4', '4'], ['5', '5'], ['6', '6'],
  ['−', '-', 'op avocado', '-'],
  ['1', '1'], ['2', '2'], ['3', '3'],
  ['+', '+', 'op avocado', '+'],
  ['0', '0', 'zero'], ['.', '.'], ['⌫', 'BACK', 'fn mustard', '⌫'],
  ['=', '=', 'eq orange', 'Enter'],
];

export default function App() {
  const [state, dispatch] = useReducer(press, initialState);
  const [lit, setLit] = useState(null);

  useEffect(() => {
    const onKey = (e) => {
      const k = keyFromEvent(e);
      if (k === null) return;
      e.preventDefault();
      dispatch(k);
      setLit(k);
    };
    const off = () => setLit(null);
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', off);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', off);
    };
  }, []);

  const len = state.display.length;
  const size = len > 10 ? 'xs' : len > 8 ? 'sm' : '';

  return (
    <main className="stage">
      <div className="sun" aria-hidden="true" />
      <div className="calc" role="application" aria-label="Groovy calculator">
        <h1 className="brand">Far<span>Out</span> 1000</h1>
        <div className="stripes" aria-hidden="true"><i /><i /><i /></div>
        <div className="screen" aria-live="polite" aria-label="Display">
          <span className="op-flag">{state.op ? { '*': '×', '/': '÷', '-': '−', '+': '+' }[state.op] : ''}</span>
          <output className={`digits ${size}`} data-testid="display">{state.display}</output>
        </div>
        <div className="pad">
          {KEYS.map(([label, key, cls = '', hint]) => (
            <button
              key={key}
              type="button"
              className={`key ${cls} ${lit === key ? 'lit' : ''}`}
              onClick={(e) => { dispatch(key); e.currentTarget.blur(); }}
              aria-label={hint ? `${label} (${hint})` : label}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="hint">Keys: 0-9 · + − × ÷ · Enter · Esc · ⌫ · N</p>
      </div>
    </main>
  );
}
