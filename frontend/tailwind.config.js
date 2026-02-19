// Custom theme colors (Space/Neon)
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        space: {
          900: '#050505', // Deep black
          800: '#0d0e14', // Card background
          700: '#1a1c26', // Border color
        },
        neonBlue: '#3b82f6',
        neonPurple: '#8b5cf6',
      },
      backgroundImage: {
        'nebula': "radial-gradient(circle at top left, rgba(59, 130, 246, 0.1), transparent), radial-gradient(circle at bottom right, rgba(139, 92, 246, 0.1), transparent)",
      }
    },
  },
  plugins: [],
}
