/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      minHeight: {
        screen: '80vh',
      },
      maxWidth: {
        xxs: '80px',
      },
      fontSize: {
        xxs: '.6rem',
      },
      textColor: {
        skin: {
          base: 'var(--color-text-base)',
          muted: 'var(--color-text-muted)',
          hover: 'var(--color-text-hover)',
          accent: 'var(--color-text-accent)',
          'accent-hover': 'var(--color-text-accent-hover)',
          inverted: 'var(--color-text-inverted)',
          'inverted-muted': 'var(--color-text-inverted-muted)',
          'inverted-disabled': 'var(--color-text-inverted-disabled)',
          error: 'var(--color-text-error)',
        },
      },
      backgroundColor: {
        skin: {
          fill: 'var(--color-fill)',
          'fill-muted': 'var(--color-fill-muted)',
          'fill-inverted': 'var(--color-fill-inverted)',
          'fill-inverted-muted': 'var(--color-fill-inverted-muted)',
          'fill-hover': 'var(--color-fill-hover)',
          'fill-accent': 'var(--color-fill-accent)',
          'fill-accent-hover': 'var(--color-fill-accent-hover)',
          'button-inverted': 'var(--color-button-inverted)',
          'button-inverted-hover': 'var(--color-button-inverted-hover)',
        },
      },
      borderColor: {
        skin: {
          base: 'var(--color-border-base)',
          muted: 'var(--color-border-muted)',
          accent: 'var(--color-border-accent)',
        },
      },
      outlineColor: {
        skin: {
          base: 'var(--color-outline-base)',
          muted: 'var(--color-outline-muted)',
          error: 'var(--color-outline-error)',
        },
      },
    },
    fontFamily: {
      sans: ['Raleway', 'sans-serif'],
    },
  },
  plugins: [],
};
