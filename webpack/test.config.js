const env = process.env.NODE_ENV;
const dev = env !== 'production';

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const path = require('path');
const postcssPresetEnv = require('postcss-preset-env');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const outputPath = path.resolve(__dirname, '../www/dist');

const hashType = dev ? global.Date.now() : '[contenthash]';

const svgoConfig = {
  plugins: [
    { name: 'addAttributesToSVGElement', active: false }, // adds attributes to an outer <svg> element (disabled by default)
    { name: 'addClassesToSVGElement', active: false }, // add classnames to an outer <svg> element (disabled by default)
    { name: 'cleanupAttrs', active: true }, // cleanup attributes from newlines, trailing, and repeating spaces
    { name: 'cleanupEnableBackground', active: true }, // remove or cleanup enable-background attribute when possible
    { name: 'cleanupIDs', active: true }, // remove unused and minify used IDs
    { name: 'cleanupListOfValues', params: { floatPrecision: 2 } }, // round numeric values in attributes that take a list of numbers (like viewBox or enable-background)
    { name: 'cleanupNumericValues', params: { floatPrecision: 2 } }, // round numeric values to the fixed precision, remove default px units
    { name: 'collapseGroups', active: true }, // collapse useless groups
    { name: 'convertColors', active: true }, // convert colors (from rgb() to #rrggbb, from #rrggbb to #rgb)
    { name: 'convertPathData', params: { noSpaceAfterFlags: false } }, // convert Path data to relative or absolute (whichever is shorter), convert one segment to another, trim useless delimiters, smart rounding, and much more
    { name: 'convertShapeToPath', active: true }, // convert some basic shapes to <path>
    { name: 'convertStyleToAttrs', active: true }, // convert styles into attributes
    { name: 'convertTransform', active: true }, // collapse multiple transforms into one, convert matrices to the short aliases, and much more
    { name: 'inlineStyles', active: true }, // move and merge styles from <style> elements to element style attributes
    { name: 'mergePaths', params: { noSpaceAfterFlags: false } }, // merge multiple Paths into one
    { name: 'minifyStyles', active: true }, // minify <style> elements content with CSSO
    { name: 'moveElemsAttrsToGroup', active: true }, // move elements' attributes to their enclosing group
    { name: 'moveGroupAttrsToElems', active: true }, // move some group attributes to the contained elements
    { name: 'prefixIds', active: false }, // prefix IDs and classes with the SVG filename or an arbitrary string
    { name: 'removeAttributesBySelector', active: false }, // removes attributes of elements that match a css selector (disabled by default)
    { name: 'removeAttrs', active: false }, // remove attributes by pattern (disabled by default)
    { name: 'removeComments', active: true }, // remove comments
    { name: 'removeDesc', active: true }, // remove <desc>
    { name: 'removeDimensions', active: true }, // remove width/height attributes if viewBox is present (opposite to removeViewBox, disable it first) (disabled by default)
    { name: 'removeDoctype', active: true }, // remove doctype declaration
    { name: 'removeEditorsNSData', active: true }, // remove editors namespaces, elements, and attributes
    { name: 'removeElementsByAttr', active: false }, // remove arbitrary elements by ID or className (disabled by default)
    { name: 'removeEmptyAttrs', active: true }, // remove empty attributes
    { name: 'removeEmptyContainers', active: true }, // remove empty Container elements
    { name: 'removeEmptyText', active: true }, // remove empty Text elements
    { name: 'removeHiddenElems', active: true }, // remove hidden elements
    { name: 'removeMetadata', active: true }, // remove <metadata>
    { name: 'removeNonInheritableGroupAttrs', active: true }, // remove non-inheritable group's "presentation" attributes
    { name: 'removeOffCanvasPaths', active: false }, // removes elements that are drawn outside of the viewbox (disabled by default)
    { name: 'removeRasterImages', active: true }, // remove raster images (disabled by default)
    { name: 'removeScriptElement', active: true }, // remove <script> elements (disabled by default)
    { name: 'removeStyleElement', active: true }, // remove <style> elements (disabled by default)
    { name: 'removeTitle', active: true }, // remove <title>
    { name: 'removeUnknownsAndDefaults', active: true }, // remove unknown elements content and attributes, remove attrs with default values
    { name: 'removeUnusedNS', active: true }, // remove unused namespaces declaration
    { name: 'removeUselessDefs', active: true }, // remove elements of <defs> without id
    { name: 'removeUselessStrokeAndFill', active: true }, // remove useless stroke and fill attrs
    { name: 'removeViewBox', active: false }, // remove viewBox attribute when possible
    { name: 'removeXMLNS', active: false }, // removes xmlns attribute (for inline svg, disabled by default)
    { name: 'removeXMLProcInst', active: true }, // remove XML processing instructions
    { name: 'reusePaths', active: false }, // Find duplicated elements and replace them with links (disabled by default)
    { name: 'sortAttrs', active: false }, // sort element attributes for epic readability (disabled by default)
  ],
};

const postCssPlugins = [autoprefixer(), postcssPresetEnv()];

if (env === 'production') {
  postCssPlugins.push(cssnano({
    preset: [
      'default',
      {
        autoprefixer: true,
        discardComments: { removeAll: true },
        discardUnused: true,
        mergeIdents: true,
        reduceIdents: true,
        svgo: svgoConfig,
        zindex: true,
      },
    ],
  }));
}

const plugins = [
    new CleanWebpackPlugin(),
    new SVGSpritemapPlugin(
    path.resolve(__dirname, '../www/src/sprite/common/*.svg'),
    {
      output: {
        chunk: {
          keep: true,
        },
        filename: `sprite.${hashType}.svg`,
        svg4everybody: false,
        svg: { sizes: false },
        svgo: svgoConfig,
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
        keepAttributes: true,
      },
    }
),
  new MiniCssExtractPlugin({
    filename: `[name].${hashType}.css`,
    chunkFilename: `[id].${hashType}.css`,
  }),
];

if (dev) {
  plugins.push(new webpack.SourceMapDevToolPlugin({}));
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  devtool: (dev ? 'source-map' : false),
  entry: {
    test: './www/src/scss/test.scss',
  },
  mode: env,
  module: {
    rules:[
      {
        test: /\.s?css$/u,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true,
              modules: {
                namedExport: false,
              },
            },
          },
          {
            loader: 'css-loader',
            options: {
              esModule: true,
              importLoaders: 3,
              modules: {
                localIdentName: '[local]',
                namedExport: true,
              },
              sourceMap: dev,
              url: (url) => {
                global.console.log('css-loader catch url:', url);

                return !/^\/(admin|dist)\/.*/u.test(url);
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins:postCssPlugins
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
        loader: 'svgo-loader',
        options: {
          configFile: svgoConfig,
        },
      },
      {
        test: /\.(jpg|png|svg)$/u,
        loader: 'image-webpack-loader',
        enforce: 'pre',
        options: {
          svgo: svgoConfig,
        },
      },
    ]
  },
  optimization: {
    mangleWasmImports: !dev, // When set to true tells webpack to reduce the size of WASM by changing imports to shorter strings. It mangles module and export names.
    minimize: !dev, // Tell webpack to minimize the bundle using the TerserPlugin or the plugin(s) specified in optimization.minimizer.
    minimizer: [
      // 1.
      // This plugin uses terser to minify your JavaScript.
      new TerserPlugin({
        terserOptions: {
          compress: { passes: 3 },
          nameCache: {},
          sourceMap: dev,
          toplevel: true,
        },
      }),
      // 2.
      // This plugin uses cssnano to optimize and minify your CSS.
      //
      // Just like optimize-css-assets-webpack-plugin but more accurate with source maps and assets using query string,
      // allows to cache and works in parallel mode.
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              autoprefixer: true,
              discardComments: { removeAll: true },
              discardUnused: true,
              mergeIdents: true,
              reduceIdents: true,
              svgo: svgoConfig,
              zindex: true,
            },
          ],
        },
      }),
    ],
    moduleIds: dev ? 'named' : 'deterministic',
    nodeEnv: env,
  },
  output: {
    filename: `${hashType}.css`,
    path: outputPath,
    publicPath: '/dist/',
  },
  plugins,
  resolve: {
    alias: {
      '/dist': path.resolve(__dirname, '../www/dist/'),
      '/src': path.resolve(__dirname, '../www/src/'),
      js: path.resolve(__dirname, '../www/src/js/'),
      scss: path.resolve(__dirname, '../www/src/scss/'),
      sprite: path.resolve(__dirname, '../www/src/sprite/'),
    },
    descriptionFiles: [path.resolve(__dirname, '../package.json')],
    extensions: ['.css', '.html', '.js', '.json', '.scss', '.ts'],
  },
  resolveLoader: { modules: ['node_modules'] },
  stats: dev ? { children: true, errorDetails: true } : 'errors-only',
  target: 'web',
};
