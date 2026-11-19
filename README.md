# Groovy Calculator

A 1970s-style ("FarOut 1000") calculator built with React + Vite: harvest-gold/avocado/burnt-orange palette, wood-grain body, glowing LED display, and a psychedelic swirling-rings background.

## Run

```sh
npm install
npm run dev      # http://localhost:5173
npm test         # calculator logic + keyboard mapping
npm run build
```

## Keyboard

| Key | Action |
|---|---|
| `0`-`9`, `.` | digits / decimal point |
| `+ - * /` (`x` also multiplies) | operators |
| `Enter` or `=` | equals |
| `Backspace` | delete last digit |
| `Esc`, `c`, `Delete` | clear |
| `%` | percent |
| `n` | negate |

Logic lives in `src/calc.js` (pure, unit-tested); `src/App.jsx` is only the UI.
