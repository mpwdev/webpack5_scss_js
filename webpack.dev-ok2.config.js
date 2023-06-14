const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const devMode = process.env.NODE_ENV === 'development';
const prodMode = !devMode;
console.log('---------------');
console.log('devMode:', devMode);
console.log('---------------');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    main: './js/index.js',
    critical: './js/critical.js',
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist/'),
  },
  resolve: {
    extensions: ['.js', '.scss'],
  },
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg|jpeg|gif|ico|webp)$/i,
        type: 'asset/resource',
        generator: {
          emit: false,
        },
      },
      {
        test: /\.(ttf|woff|woff2)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext][query]',
        },
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      minify: false,
      inject: false,
    }),
    new HtmlWebpackPlugin({
      template: './index2.html',
      filename: 'index2.html',
      minify: false,
      inject: false,
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/style-guide.md'),
          to: path.resolve(__dirname, 'dist'),
        },
        {
          from: path.resolve(__dirname, 'src/images'),
          to: path.resolve(__dirname, 'dist/images'),
        },
      ],
    }),
    new ESLintPlugin(),
  ],
};