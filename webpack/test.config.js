const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const path = require('path');

const outputPath = path.resolve(__dirname, '../www/dist');

module.exports = {
  entry: {
    test: './www/src/scss/test.scss',
  },
  module: {
    rules: [
      {
        test: /\.s?css$/u,
        use: [
          {
            loader: 'css-loader',
            options: {
              url: (url) => {
                global.console.log('css-loader catch url:', url);

                return !/^\/(admin|dist)\/.*/u.test(url);
              },
            },
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
  ],
};
