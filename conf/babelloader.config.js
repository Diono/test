/*
 * Copyright (c) 2020 Les Scènes Hantées - All Rights Reserved
 */

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
