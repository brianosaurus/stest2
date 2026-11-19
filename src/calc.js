// Pure calculator state machine: no React, no DOM.
export const initialState = {
  display: '0', // what the screen shows
  acc: null, // stored left operand (number)
  op: null, // pending operator
  fresh: true, // next digit starts a new number
  error: false,
};

const OPS = { '+': (a, b) => a + b, '-': (a, b) => a - b, '*': (a, b) => a * b, '/': (a, b) => a / b };
export const isOp = (k) => k in OPS;

export function format(n) {
  if (!Number.isFinite(n)) return null;
  let s = String(Number(n.toPrecision(12)));
  if (s.includes('e')) return s;
  if (s.replace('-', '').replace('.', '').length > 12) s = String(Number(n.toPrecision(10)));
  return s;
}

function compute(a, op, b) {
  const r = OPS[op](a, b);
  const s = format(r);
  return s === null ? null : s;
}

export function press(state, key) {
  if (state.error && key !== 'C') return state;

  if (/^[0-9]$/.test(key)) {
    if (state.fresh) return { ...state, display: key, fresh: false };
    if (state.display === '0') return { ...state, display: key };
    if (state.display.replace(/[-.]/g, '').length >= 12) return state;
    return { ...state, display: state.display + key };
  }

  switch (key) {
    case '.':
      if (state.fresh) return { ...state, display: '0.', fresh: false };
      if (state.display.includes('.')) return state;
      return { ...state, display: state.display + '.' };
    case 'C':
      return initialState;
    case 'BACK':
      if (state.fresh) return state;
      return { ...state, display: state.display.length > 1 && state.display !== '-0' ? state.display.slice(0, -1) || '0' : '0' };
    case 'NEG':
      if (state.display === '0') return state;
      return { ...state, display: state.display.startsWith('-') ? state.display.slice(1) : '-' + state.display };
    case '%': {
      const s = format(Number(state.display) / 100);
      return { ...state, display: s, fresh: true };
    }
    case '=': {
      if (state.op === null || state.acc === null) return { ...state, fresh: true };
      const res = compute(state.acc, state.op, Number(state.display));
      if (res === null) return { ...initialState, display: 'ERROR', error: true };
      return { display: res, acc: null, op: null, fresh: true, error: false };
    }
    default:
      if (isOp(key)) {
        // Chain: 2 + 3 + -> 5 +. Repeated operator press just swaps the operator.
        if (state.op !== null && state.fresh) return { ...state, op: key };
        if (state.op !== null && state.acc !== null) {
          const res = compute(state.acc, state.op, Number(state.display));
          if (res === null) return { ...initialState, display: 'ERROR', error: true };
          return { display: res, acc: Number(res), op: key, fresh: true, error: false };
        }
        return { ...state, acc: Number(state.display), op: key, fresh: true };
      }
      return state;
  }
}

// Map a KeyboardEvent.key to a calculator key, or null.
export function keyFromEvent(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return null;
  const k = e.key;
  if (/^[0-9]$/.test(k)) return k;
  if (k === '+' || k === '-' || k === '*' || k === '/') return k;
  if (k === 'x' || k === 'X') return '*';
  if (k === '.' || k === ',') return '.';
  if (k === 'Enter' || k === '=') return '=';
  if (k === 'Backspace') return 'BACK';
  if (k === 'Escape' || k === 'c' || k === 'C' || k === 'Delete') return 'C';
  if (k === '%') return '%';
  if (k === 'n' || k === 'N') return 'NEG';
  return null;
}
