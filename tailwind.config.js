/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070A14',
          900: '#0A0E1A',
          850: '#0E1424',
          800: '#131B30',
          700: '#1B2438',
          600: '#243049',
          500: '#3A4666',
        },
        accent: {
          50: '#EFF6FF',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
        },
        cyan: {
          glow: '#22D3EE',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 1px 2px 0 rgba(0,0,0,0.4)',
        glow: '0 0 0 1px rgba(59,130,246,0.25), 0 8px 30px -12px rgba(59,130,246,0.35)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%,100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
