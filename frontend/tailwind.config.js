// c:\Users\amber\OneDrive\Área de Trabalho\ProgressEd\frontend\tailwind.config.js
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f6f0ff',
          100: '#ede1ff',
          200: '#dac0ff',
          300: '#c499ff',
          400: '#ac6af8',
          500: '#8f3ae6',
          600: '#7b2ede',
          700: '#6a24c8',
          800: '#571fa6',
          900: '#451b7f'
        }
      },
      boxShadow: {
        glow: '0 30px 80px rgba(111, 33, 255, 0.12), 0 12px 35px rgba(72, 22, 168, 0.18)'
      }
    }
  },
  plugins: []
};