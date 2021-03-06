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
