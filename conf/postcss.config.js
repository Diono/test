/*
 * Copyright (c) 2019 La Maison Fantastique - All Rights Reserved
 */

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
