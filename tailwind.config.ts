import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        greenToken: 'var(--green)',
        redToken: 'var(--red)',
        amberToken: 'var(--amber)',
        blueToken: 'var(--blue)',
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        surface2: 'var(--surface-2)',
        borderToken: 'var(--border)',
        text: 'var(--text)',
        text2: 'var(--text-2)',
        text3: 'var(--text-3)'
      }
    }
  },
  plugins: []
}

export default config
