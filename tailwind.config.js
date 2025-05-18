/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        // Thêm font display để tạo sự khác biệt cho tiêu đề
        // Hãy chắc chắn bạn đã nhúng font này vào dự án (ví dụ: Google Fonts trong index.html)
        // <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400..900&family=Orbitron:wght@400..900&display=swap" rel="stylesheet">
        display: ['Orbitron', 'sans-serif'],
      },
      colors: {
        // Giữ lại các màu bạn đã định nghĩa
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Thêm màu sắc thương hiệu gợi ý
        'brand-purple': {
          light: '#a78bfa', // violet-400
          DEFAULT: '#8b5cf6', // violet-500
          dark: '#7c3aed', // violet-600
        },
        'brand-indigo': {
          light: '#818cf8', // indigo-400
          DEFAULT: '#6366f1', // indigo-500
          dark: '#4f46e5', // indigo-600
        },
        'brand-cyan': {
          light: '#67e8f9', // cyan-300
          DEFAULT: '#22d3ee', // cyan-400
          dark: '#06b6d4', // cyan-500
        },
        'brand-teal': {
          light: '#5eead4', // teal-300
          DEFAULT: '#2dd4bf', // teal-400
          dark: '#14b8a6', // teal-500
        },
        'brand-emerald': {
          light: '#6ee7b7', // emerald-300
          DEFAULT: '#34d399', // emerald-400
          dark: '#10b981', // emerald-500
        },
        'dark-bg': '#0F172A', // slate-900 (ví dụ cho nền tối)
        'dark-card': '#1E293B', // slate-800 (ví dụ cho thẻ trên nền tối)
      },
      animation: {
        // Giữ lại animation của bạn
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1)', // Làm mượt hơn
        // Thêm animation mới
        'gradient-flow': 'gradientFlow 15s ease infinite',
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'appear-then-fade': 'appearThenFade 4s ease-in-out forwards',
        'slide-in-left': 'slideInLeft 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'slide-in-right': 'slideInRight 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'subtle-float': 'subtleFloat 3s ease-in-out infinite',
      },
      keyframes: {
        // Giữ lại keyframes của bạn
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        // Thêm keyframes mới
        gradientFlow: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', 'box-shadow': '0 0 5px rgba(167, 139, 250, 0.5)' }, // brand-purple-light với alpha
          '50%': { opacity: '0.7', 'box-shadow': '0 0 20px rgba(167, 139, 250, 0.8)' },
        },
        appearThenFade: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '20%, 80%': { opacity: '1', transform: 'translateY(0px)' },
          '100%': { opacity: '0', transform: 'translateY(-10px)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-50px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(50px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        subtleFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      },
      // Thêm kích thước nền cho hiệu ứng gradientFlow
      backgroundSize: {
        '200%': '200% 200%',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Thêm plugin này
  ],
};