**Description**
Since I updated 'svg-spritemap-webpack-plugin' to version 3.8.1
The [contenthash] value is not converted on the generated scss file.

I did a minimal config from my project: https://github.com/Diono/test

and i cant build, i got this error:

> ERROR in ./www/src/scss/test.scss
> Module build failed (from ./node_modules/css-loader/dist/cjs.js):
> Error: Can't resolve '/dist/sprite.[contenthash].svg#sprite-separator-light-middle-fragment' in 'D:\Diono\test\www\src\scss'
>     at finishWithoutResolve (D:\Diono\test\node_modules\enhanced-resolve\lib\Resolver.js:293:18)
>     at D:\Diono\test\node_modules\enhanced-resolve\lib\Resolver.js:362:15
>     at D:\Diono\test\node_modules\enhanced-resolve\lib\Resolver.js:410:5
>     at eval (eval at create (D:\Diono\test\node_modules\tapable\lib\HookCodeFactory.js:33:10), <anonymous>:15:1)
>     at D:\Diono\test\node_modules\enhanced-resolve\lib\Resolver.js:410:5
>     at eval (eval at create (D:\Diono\test\node_modules\tapable\lib\HookCodeFactory.js:33:10), <anonymous>:16:1)
>     at D:\Diono\test\node_modules\enhanced-resolve\lib\Resolver.js:410:5
>     at eval (eval at create (D:\Diono\test\node_modules\tapable\lib\HookCodeFactory.js:33:10), <anonymous>:15:1)
>     at D:\Diono\test\node_modules\enhanced-resolve\lib\Resolver.js:410:5
>     at eval (eval at create (D:\Diono\test\node_modules\tapable\lib\HookCodeFactory.js:33:10), <anonymous>:16:1)
>  @ ./www/src/js/test.js 4:0-24
> 
> webpack 5.10.1 compiled with 1 error in 1096 ms
> error Command failed with exit code 1.
> info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
> 
> Process finished with exit code 1

it seems to build the .scss file before generating the sprite.svg file

**Expected behavior**
generate a scss file referencing the path of the sprites with their hash according to their content

**Actual behavior**
generated scss file does not replace template '[contenthash]' with its hash value

**System information**
OS: Windows 10 Professional x64 20H2
node: v15.4.0
yarn: 1.22.4
```
webpack --progress --config=webpack/test.config.js
```

**Minimal reproduction**
webpack config: test.config.js
```
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
```

**Additional context**
babelloader.config
```
module.exports = ({ dev }) => {
  const babelPresets = [
    [
      '@babel/preset-env',
      {
        corejs: {
          proposals: true,
          version: 2,
        },
        debug: dev,
        loose: true,
        modules: 'auto',
        shippedProposals: true,
        spec: dev,
        useBuiltIns: 'usage',
      },
    ],
  ];
  return {
    babelPresets,
    babelLoaderOptions: {
      comments: dev,
      compact: !dev,
      inputSourceMap: dev,
      minified: !dev,
      plugins: ['@babel/plugin-transform-runtime'],
      presets: babelPresets,
      retainLines: !dev,
      sourceMaps: dev,
    },
  };
};
```

cssloader.config
```
module.exports = ({ dev }) => ({
  esModule: true,
  modules: false,
  sourceMap: dev,
});
```

cssnano.config
```
const svgoConfig = require('../conf/svgo.config');

module.exports = {
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
};
```

minicssextractplugin.config
```
module.exports = {
  esModule: true
};
```

postcss.config
```
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const cssnanoConfig = require('../conf/cssnano.config');
const postcssPresetEnv = require('postcss-preset-env');

module.exports = ({ env }) => {
  const plugins = [autoprefixer(), postcssPresetEnv()];

  if (env === 'production') {
    plugins.push(cssnano(cssnanoConfig));
  }

  return {
    plugins,
  };
};
```

svgo.config
```
module.exports = {
  plugins: [
    { addAttributesToSVGElement: false }, // adds attributes to an outer <svg> element (disabled by default)
    { addClassesToSVGElement: false }, // add classnames to an outer <svg> element (disabled by default)
    { cleanupAttrs: true }, // cleanup attributes from newlines, trailing, and repeating spaces
    { cleanupEnableBackground: true }, // remove or cleanup enable-background attribute when possible
    { cleanupIDs: true }, // remove unused and minify used IDs
    { cleanupListOfValues: 2 }, // round numeric values in attributes that take a list of numbers (like viewBox or enable-background)
    { cleanupNumericValues: 2 }, // round numeric values to the fixed precision, remove default px units
    { collapseGroups: true }, // collapse useless groups
    { convertColors: true }, // convert colors (from rgb() to #rrggbb, from #rrggbb to #rgb)
    { convertPathData: { noSpaceAfterFlags: false } }, // convert Path data to relative or absolute (whichever is shorter), convert one segment to another, trim useless delimiters, smart rounding, and much more
    { convertShapeToPath: true }, // convert some basic shapes to <path>
    { convertStyleToAttrs: true }, // convert styles into attributes
    { convertTransform: true }, // collapse multiple transforms into one, convert matrices to the short aliases, and much more
    { inlineStyles: true }, // move and merge styles from <style> elements to element style attributes
    { mergePaths: { noSpaceAfterFlags: false } }, // merge multiple Paths into one
    { minifyStyles: true }, // minify <style> elements content with CSSO
    { moveElemsAttrsToGroup: true }, // move elements' attributes to their enclosing group
    { moveGroupAttrsToElems: true }, // move some group attributes to the contained elements
    { prefixIds: false }, // prefix IDs and classes with the SVG filename or an arbitrary string
    { removeAttributesBySelector: false }, // removes attributes of elements that match a css selector (disabled by default)
    { removeAttrs: false }, // remove attributes by pattern (disabled by default)
    { removeComments: true }, // remove comments
    { removeDesc: true }, // remove <desc>
    { removeDimensions: true }, // remove width/height attributes if viewBox is present (opposite to removeViewBox, disable it first) (disabled by default)
    { removeDoctype: true }, // remove doctype declaration
    { removeEditorsNSData: true }, // remove editors namespaces, elements, and attributes
    { removeElementsByAttr: false }, // remove arbitrary elements by ID or className (disabled by default)
    { removeEmptyAttrs: true }, // remove empty attributes
    { removeEmptyContainers: true }, // remove empty Container elements
    { removeEmptyText: true }, // remove empty Text elements
    { removeHiddenElems: true }, // remove hidden elements
    { removeMetadata: true }, // remove <metadata>
    { removeNonInheritableGroupAttrs: true }, // remove non-inheritable group's "presentation" attributes
    { removeOffCanvasPaths: false }, // removes elements that are drawn outside of the viewbox (disabled by default)
    { removeRasterImages: true }, // remove raster images (disabled by default)
    { removeScriptElement: true }, // remove <script> elements (disabled by default)
    { removeStyleElement: true }, // remove <style> elements (disabled by default)
    { removeTitle: true }, // remove <title>
    { removeUnknownsAndDefaults: true }, // remove unknown elements content and attributes, remove attrs with default values
    { removeUnusedNS: true }, // remove unused namespaces declaration
    { removeUselessDefs: true }, // remove elements of <defs> without id
    { removeUselessStrokeAndFill: true }, // remove useless stroke and fill attrs
    { removeViewBox: false }, // remove viewBox attribute when possible
    { removeXMLNS: false }, // removes xmlns attribute (for inline svg, disabled by default)
    { removeXMLProcInst: true }, // remove XML processing instructions
    { reusePaths: false }, // Find duplicated elements and replace them with links (disabled by default)
    { sortAttrs: false }, // sort element attributes for epic readability (disabled by default)
  ],
};
```