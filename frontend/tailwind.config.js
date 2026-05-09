/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED', 'primary-light': '#8B5CF6', 'primary-dark': '#6D28D9',
        secondary: '#0EA5E9', success: '#10B981', danger: '#EF4444', warning: '#F59E0B',
        dark: '#0F0F1A', 'dark-card': '#1A1A2E', 'dark-border': '#2D2D4E', 'dark-muted': '#6B7280',
      },
      animation: {
        'timer-shrink': 'shrink 25s linear forwards',
        'bounce-in': 'bounceIn 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        shrink: { '0%': { width: '100%' }, '100%': { width: '0%' } },
        bounceIn: { '0%': { transform: 'scale(0.5)', opacity: '0' }, '80%': { transform: 'scale(1.1)' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(30px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        shake: { '0%,100%': { transform: 'translateX(0)' }, '20%,60%': { transform: 'translateX(-8px)' }, '40%,80%': { transform: 'translateX(8px)' } },
      }
    },
  },
  plugins: [],
}
