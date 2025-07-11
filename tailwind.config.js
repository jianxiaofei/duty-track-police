/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '360px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: '#007BFF', // 主题蓝
        secondary: '#6C757D', // 次要灰
        accent: '#FFC107', // 强调色
        background: '#F8F9FA', // 页面背景
        textPrimary: '#474D5C', // 主要文本颜色
        textSecondary: '#6C757D', // 次要文本颜色
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Arial', 'sans-serif'], // 示例字体
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
    },
  },
  plugins: [],
}
