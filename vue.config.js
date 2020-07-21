const path = require('path')

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        components: path.resolve(__dirname, `./src/components`),
      },
    },
    optimization: {
      minimize: true,
      splitChunks: {
        chunks: 'all',
        minChunks: Infinity,
      },
    },
  },
}