/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          main: '#10131B',
          sidebar: '#0C0F16',
          surface: '#181D28',
          hover: '#202634',
        },
        accent: {
          primary: '#8290C9',
          button: '#4E65C6',
          buttonHover: '#4257B2',
          secondary: '#8499B8',
          subtle: 'rgba(130, 144, 201, 0.1)',
          border: 'rgba(130, 144, 201, 0.25)',
        },
        brand: {
          textPrimary: '#E8EAF0',
          textSecondary: '#969DAB',
          textMuted: '#687182',
          border: '#292F3B',
          borderSubtle: '#1F2430',
        },
        status: {
          success: '#4E9F76',
          warning: '#D49A3D',
          critical: '#C55353',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
