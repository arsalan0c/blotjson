const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
      main: './src/js/index.js',
      darkTheme: './src/js/darkTheme.js'
  },
  output: {
    path: __dirname + '/dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: './src/index.html'
    }),
    new CopyWebpackPlugin({
        patterns: [
            { from: 'src/static' }
        ]
    })
  ]
};