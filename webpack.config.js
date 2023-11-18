const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',

  entry: {
    'wforex-entry': './src/wforex-entry.ts',
    'tradingview-entry': './src/tradingview-entry.ts',
    background: './src/background/background.ts',
    popup: './src/popup/popup.ts',
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          esModule: true,
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },

  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
    },

    extensions: ['.ts', '.js', '.vue'],
  },

  plugins: [
    new VueLoaderPlugin(),

    new HtmlWebpackPlugin({
      inject: true,
      template: 'src/background/background.html',
      filename: 'background.html',
      chunks: ['background'],
    }),

    new HtmlWebpackPlugin({
      inject: true,
      template: 'src/popup/popup.html',
      filename: 'popup.html',
      chunks: ['popup'],
    }),
  ],
};
