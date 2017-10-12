const path = require('path');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const Merge = require('webpack-merge');

module.exports = Merge.multiple(common, {
  js: {
    devtool: 'source-map',
    devServer: {
      publicPath: '/',
      // contentBase: path.join(__dirname, 'data'),
      watchContentBase: true,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('development')
        }
      }),
    ],
  },
  css: {
    devtool: 'source-map',
  },
});

