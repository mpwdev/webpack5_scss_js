const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
console.log('IS DEV', isDev);

// custom code start ------------------ //

// our custom function
const custOptimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };

  if (isProd) {
    config.minimizer = [`...`, new CssMinimizerPlugin(), new TerserPlugin()];
  }

  return config;
};

// our custom file name based on the mode
const custFilename = (ext) => (isDev ? `[name].${ext}` : `[name].${ext}`);

// custom css loaders
const custCssLoaders = (extra) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {},
    },
    'css-loader',
  ];

  if (extra) {
    loaders.push(extra);
  }

  return loaders;
};

// custom js only loaders
const custJsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
      },
    },
  ];

  //if (isDev) {
  //  loaders.push('eslint-loader');
  //}

  return loaders;
};

// custom plugins to load

const custPlugins = () => {
  const base = [
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd,
      },
      inject: false,
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/style-guide.md'),
          to: path.resolve(__dirname, 'dist'),
        },
        //{
        // from: path.resolve(__dirname, 'src/index.html'),
        //  to: path.resolve(__dirname, 'dist'),
        // },
        {
          from: path.resolve(__dirname, 'src/images'),
          to: path.resolve(__dirname, 'dist/images'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    //new ESLintPlugin(),
  ];

  if (isProd) {
    // base.push(new BundleAnalyzerPlugin());
  }

  return base;
};

// custom code stop -------------------------------- //

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    main: './js/index.js',
    analytics: './js/analytics.js',
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist/'),
  },
  resolve: {
    extensions: ['.js', '.json', '.png', '.css', '.scss'],
    alias: {
      '@models': path.resolve(__dirname, 'src/models'),
      '@test': path.resolve(__dirname, 'src'),
    },
  },
  optimization: custOptimization(),
  //target: 'web',
  devServer: {
    //static: './dist',
    port: 4200,
    //compress: false,
    hot: isDev,
    // liveReload: true,
    client: {
      overlay: true,
    },
    //watchFiles: ['src/**/*', 'dist/**/*'],
  },
  devtool: isDev ? 'source-map' : false,
  plugins: custPlugins(),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: custCssLoaders(),
      },
      {
        test: /\.scss$/,
        use: custCssLoaders('sass-loader'),
      },
      // {
      //  test: /\.html$/,
      //  type: 'asset/resource',
      //  generator: {
      //    filename: '[name][ext]',
      //  },
      // },
      {
        test: /\.(png|jpe?g|gif)$/i,
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
        test: /\.xml$/,
        use: ['xml-loader'],
      },
      {
        test: /\.csv$/,
        use: ['csv-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: custJsLoaders(),
      },
    ],
  },
};
