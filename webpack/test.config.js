const env = process.env.NODE_ENV.trim() ?? 'production';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const path = require('path');

const outputPath = path.resolve(__dirname, '../www/dist');

module.exports = {
  entry: {
    test: './www/src/scss/test.scss',
  },
  mode: env,
  module: {
    rules: [
      {
        test: /\.s?css$/u,
        use: [
          {
            loader: 'css-loader',
            options: {url: false},
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.(jpg|png|svg)$/u,
        type: 'asset',
      },
    ],
  },
  output: {
    filename: `[name].[contenthash].css`,
    path: outputPath,
    publicPath: '/dist/',
  },
  plugins: [
    new SVGSpritemapPlugin(
        path.resolve(__dirname, '../www/src/sprite/common/*.svg'),
        {
          output: {
            filename: `sprite.[contenthash].svg`,
          },
          sprite: {
            generate: {
              symbol: true,
              title: true,
              use: true,
              view: '-fragment',
            },
            gutter: 0,
          },
          styles: {
            filename: path.join(__dirname, '../www/src/scss/common/_sprite.scss'),
            format: 'fragment',
          },
        }
    ),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../www/index.html'),
    }),
  ],
};
