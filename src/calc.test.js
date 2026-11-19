import { describe, it, expect } from 'vitest';
import { initialState, press, keyFromEvent } from './calc.js';

const run = (...keys) => keys.reduce(press, initialState);

describe('calc', () => {
  it('adds', () => expect(run('2', '+', '3', '=').display).toBe('5'));
  it('chains operators left to right', () => expect(run('2', '+', '3', '*', '4', '=').display).toBe('20'));
  it('swaps a repeated operator', () => expect(run('5', '+', '-', '2', '=').display).toBe('3'));
  it('handles decimals without float noise', () => expect(run('0', '.', '1', '+', '0', '.', '2', '=').display).toBe('0.3'));
  it('ignores a second decimal point', () => expect(run('1', '.', '2', '.', '3').display).toBe('1.23'));
  it('divide by zero shows ERROR and C recovers', () => {
    const s = run('5', '/', '0', '=');
    expect(s.display).toBe('ERROR');
    expect(press(s, '7').display).toBe('ERROR');
    expect(press(s, 'C')).toEqual(initialState);
  });
  it('percent, negate, backspace', () => {
    expect(run('5', '0', '%').display).toBe('0.5');
    expect(run('8', 'NEG').display).toBe('-8');
    expect(run('1', '2', '3', 'BACK').display).toBe('12');
    expect(run('7', 'BACK').display).toBe('0');
  });
  it('caps digit entry at 12', () => expect(run(...'1234567890123456'.split('')).display).toBe('123456789012'));
  it('starts a new number after equals', () => expect(run('2', '+', '2', '=', '9').display).toBe('9'));
  it('equals with no operator is harmless', () => expect(run('4', '=').display).toBe('4'));
});

describe('keyFromEvent', () => {
  const k = (key, extra = {}) => keyFromEvent({ key, ...extra });
  it('maps keys', () => {
    expect(k('7')).toBe('7');
    expect(k('Enter')).toBe('=');
    expect(k('Backspace')).toBe('BACK');
    expect(k('Escape')).toBe('C');
    expect(k('x')).toBe('*');
    expect(k('q')).toBeNull();
  });
  it('ignores modifier shortcuts', () => expect(k('c', { metaKey: true })).toBeNull());
});
