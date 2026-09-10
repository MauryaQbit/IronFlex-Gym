/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gym: {
          black: '#0A0A0B',
          dark: '#131316',
          card: '#1A1A1E',
          border: '#2A2A30',
          lime: '#D4FF3F',
          orange: '#FF5A1F',
          muted: '#A1A1AA',
        }
      },
      fontFamily: {
        display: ['Anton', 'Arial Black', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 22s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
