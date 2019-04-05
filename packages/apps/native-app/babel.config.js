const { getBabelConfig } = require('@chatapp/babel-config');

module.exports = function (api) {
  api.cache(true);
  return getBabelConfig({ babelTarget: 'native' });
};
