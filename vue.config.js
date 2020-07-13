const path = require('path');

module.exports = {
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        vue$: 'vue/dist/vue.esm.js',
        '@': path.join(__dirname, 'src')
      }
    },
    externals: {
      AMap: 'AMap',
      AMapUI: 'AMapUI'
    }
  }
};

// function resolve (dir) {
//     return path.join(__dirname, '..', dir)
// }
