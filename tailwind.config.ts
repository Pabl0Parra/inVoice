import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Nunito',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
        ],
      },
      colors: {
        // Primary Colors
        primary: {
          'dark-grey': 'var(--color-primary-dark-grey)',
          grey: 'var(--color-primary-grey)',
          orange: 'var(--color-primary-orange)',
        },

        // Secondary Colors
        secondary: {
          blue: 'var(--color-secondary-blue)',
          'blue-2': 'var(--color-secondary-blue-2)',
          'light-blue': 'var(--color-secondary-light-blue)',
          violet: 'var(--color-secondary-violet)',
          'violet-2': 'var(--color-secondary-violet-2)',
          'green-1': 'var(--color-secondary-green-1)',
          'green-2': 'var(--color-secondary-green-2)',
          'green-3': 'var(--color-secondary-green-3)',
          'red-1': 'var(--color-secondary-red-1)',
          'red-2': 'var(--color-secondary-red-2)',
          orange: 'var(--color-secondary-orange)',
          yellow: 'var(--color-secondary-yellow)',
        },

        // Background Colors
        background: {
          'light-grey': 'var(--color-background-light-grey)',
          white: 'var(--color-background-white)',
        },

        // WCAG Compliant Colors
        wcag: {
          'bg-1': 'var(--color-wcag-bg-1)',
          'text-1': 'var(--color-wcag-text-1)',
          'bg-2': 'var(--color-wcag-bg-2)',
          'text-2': 'var(--color-wcag-text-2)',
          'bg-3': 'var(--color-wcag-bg-3)',
          'text-3': 'var(--color-wcag-text-3)',
          'bg-4': 'var(--color-wcag-bg-4)',
          'text-4': 'var(--color-wcag-text-4)',
          'bg-5': 'var(--color-wcag-bg-5)',
          'text-5': 'var(--color-wcag-text-5)',
          'bg-6': 'var(--color-wcag-bg-6)',
          'text-6': 'var(--color-wcag-text-6)',
        },

        // Theme-aware colors (will change based on light/dark mode)
        theme: {
          background: 'var(--color-background)',
          text: 'var(--color-text)',
          'text-secondary': 'var(--color-text-secondary)',
          accent: 'var(--color-accent)',
          'button-bg': 'var(--color-button-background)',
          'button-text': 'var(--color-button-text)',
          'input-border': 'var(--color-input-border)',
          'input-bg': 'var(--color-input-background)',
        },

        // Button hover colors
        button: {
          hover: 'var(--color-button-hover)',
          'hover-secondary': 'var(--color-secondary-button-hover)',
        },

        // Card colors
        card: {
          shadow: 'var(--card-shadow)',
          'image-border': 'var(--card-image-border)',
        },

        // Icon color
        icon: {
          variable: 'var(--icon-variable)',
        },
      },

      // Custom box shadows
      boxShadow: {
        paper: 'var(--Paper-shadow)',
      },
    },
  },
  plugins: [],
};

export default config;
