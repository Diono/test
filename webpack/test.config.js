const env = process.env.NODE_ENV;
const dev = env !== 'production';

const babelloaderConfig = require('../conf/babelloader.config')({ dev });
const cssloaderConfig = require('../conf/cssloader.config')({ dev });
const minicssextractpluginConfig = require('../conf/minicssextractplugin.config');
const postcssConfig = require('../conf/postcss.config')({ env });
const svgoConfig = require('../conf/svgo.config');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const path = require('path');

const outputPath = path.resolve(__dirname, '../www/dist');

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    test: './www/src/js/test.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/u,
        use: [
          {
            loader: 'babel-loader',
            options: babelloaderConfig.babelLoaderOptions,
          },
        ],
      },
      {
        test: /\.scss$/u,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: minicssextractpluginConfig,
          },
          {
            loader: 'css-loader',
            options: {
              ...cssloaderConfig,
              importLoaders: 3,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ...postcssConfig,
              },
              sourceMap: dev,
            },
          },
          {
            loader: 'resolve-url-loader',
            options: { debug: true, sourceMap: dev },
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [
                  path.resolve(__dirname, '../node_modules/compass-mixins/lib'),
                ],
                omitSourceMapUrl: !dev,
                outFile: outputPath,
                outputStyle: dev ? 'expanded' : 'compressed',
                sourceComments: dev,
                sourceMap: true,
                sourceMapContents: dev,
              },
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.svg$/u,
        use: [
          { loader: 'url-loader' },
          {
            loader: 'svgo-loader',
            options: svgoConfig,
          },
        ],
      },
    ],
  },
  output: {
    filename: '[contenthash].js',
    path: outputPath,
    publicPath: '/dist/',
  },
  plugins: [
    new SVGSpritemapPlugin(
      path.resolve(__dirname, '../www/src/sprite/common/*.svg'),
      {
        output: {
          filename: 'sprite.[contenthash].svg',
          svg: { sizes: false },
          svgo: svgoConfig,
        },
        sprite: {
          generate: {
            use: true,
            view: '-fragment',
            symbol: true,
          },
        },
        styles: {
          filename: path.join(__dirname, '../www/src/scss/common/_sprite.scss'),
          format: 'fragment',
        },
      }
    ),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),
  ],
  resolve: {
    alias: {
      js: path.resolve(__dirname, '../www/src/js/'),
      scss: path.resolve(__dirname, '../www/src/scss/'),
      sprite: path.resolve(__dirname, '../www/src/sprite/'),
    },
    descriptionFiles: [path.resolve(__dirname, './package.json')],
    extensions: ['.js', '.scss'],
    mainFields: ['browser', 'main'],
    modules: ['node_modules', path.resolve(__dirname, '../www/src')],
  },
  resolveLoader: { modules: ['node_modules'] },
  stats: dev ? 'normal' : 'errors-only',
  target: 'web',
};
