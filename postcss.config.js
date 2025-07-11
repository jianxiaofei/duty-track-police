export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // 'postcss-px-to-viewport-8-plugin': {
    //   viewportWidth: process.env.NODE_ENV === 'development' ? 1920 : 375, // 根据环境使用不同的视口宽度
    //   unitPrecision: 5, // 单位转换后保留的精度
    //   viewportUnit: 'vw', // 希望使用的视口单位
    //   propList: ['*'], // 需要转换的属性
    //   selectorBlackList: ['.ignore-', 'node_modules', '.pc-only'], // 忽略的选择器
    //   minPixelValue: 1, // 最小转换数值
    //   mediaQuery: true, // 在媒体查询中也进行转换
    //   exclude: /node_modules/i, // 忽略文件夹
    //   // 添加设备类型判断
    //   landscapeWidth: 568, // 横屏时使用的视口宽度
    //   landscapeUnit: 'vw', // 横屏时使用的单位
    // },
  },
}
