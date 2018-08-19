const path = require('path');

console.log(__filename)

module.exports = {
  mode: 'development',
  entry: {
      main: ['./src/index.js'],
      barchart: ['whatwg-fetch', './src/barchart/index.js'],
  },
  devtool: 'inline-source-map',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/js')
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          { loader: 'sass-loader' }
        ]
      }
    ],
  }
};