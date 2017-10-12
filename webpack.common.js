const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

function isExternal(module) {
  var context = module.context;

  if (typeof context !== 'string') {
    return false;
  }

  return context.indexOf('node_modules') !== -1;
}

module.exports = {
  js: {
    context: path.resolve(__dirname, 'js'),
    entry: {
      // uiharu: './uiharu.js',
      browser: './browser.js',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/[name].js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            {
              loader: 'expose-loader',
              options: 'Uiharu',
            },
            {
              loader: 'babel-loader',
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.hbs$/,
          use: [
            {
              loader: 'handlebars-loader',
            },
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(
        ['dist'], { verbose: true, }
      ),
      // new webpack.optimize.CommonsChunkPlugin({
        // name: 'uiharu-vendor',
        // minChunks: function(module) {
          // return isExternal(module);
        // },
      // }),
      new HtmlWebpackPlugin({
        title: '初春の森',
        hash: true,
        template: '../html/index.hbs',
        chunks: [
          // 'uiharu-vendor',
          'uiharu',
          'browser',
        ],
      }),
      new HtmlWebpackIncludeAssetsPlugin({
        assets: ['css/style.css'],
        append: true,
        hash: true,
      }),
    ],
  },
  css: {
    context: path.resolve(__dirname, 'css'),
    entry: {
      style: './style.scss',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'css/[name].css',
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            // fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  minimize: true,
                  sourceMap: true,
                }
              },
              {
                loader: 'postcss-loader',
              },
              {
                loader: 'sass-loader'
              },
            ],
          }),
        },
        {
          test: /\.(ttf|eot|svg|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]?[hash]',
                publicPath: '/',
                outputPath: 'fonts/',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new ExtractTextPlugin({
        filename: 'css/[name].css',
        disable: false,
        allChunks: true,
      }),
    ]
  },
};

