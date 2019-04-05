const babelJest = require('babel-jest');
const { getBabelConfig } = require('@chatapp/babel-config');

const transformer = babelJest.createTransformer(getBabelConfig({ babelTarget: 'library' }));

// Monkey patch around https://github.com/facebook/jest/issues/7868
const defaultCwd = process.cwd();
const oldGetCacheKey = transformer.getCacheKey;
transformer.getCacheKey = (
  fileData,
  filename,
  configString,
  { config, instrument, rootDir },
) => oldGetCacheKey(
  fileData,
  filename,
  configString, {
    config: config || { cwd: defaultCwd },
    instrument,
    rootDir,
  },
);

module.exports = transformer;
