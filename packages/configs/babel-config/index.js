const path = require('path');

const env = process.env;
const isTest = env.NODE_ENV === 'test';
const isDev = env.NODE_ENV === 'development';

const babelPresetEnvOptions = {
  // normally don't transpile import statements so webpack can do tree shaking
  // for jest however (NODE_ENV=test) need to transpile import statements
  modules: isTest ? 'auto' : false,
  // pull in bits you need from babel polyfill eg regeneratorRuntime etc
  useBuiltIns: 'usage',
  // todo: consider switching to external browserslist config
  targets: { browsers: 'cover 96%, not ie < 9, not chrome < 40' },
  corejs: '3.0.0',
};

function getBabelConfig({ babelTarget = 'library' } = {}) {
  const isWeb = babelTarget === 'web';
  const isLib = babelTarget === 'library';
  const isNative = babelTarget === 'native';

  const presets = [];
  const plugins = [
    [require.resolve('babel-plugin-styled-components')]
  ];
  let sourceMaps = false;

  if (isWeb) {
    // for some reason next/babel does not accept corejs as an option
    delete babelPresetEnvOptions.corejs;
    presets.push([require.resolve('next/babel'), { 'preset-env': babelPresetEnvOptions }]);
    presets.push([require.resolve('@babel/preset-typescript'), { isTSX: true, allExtensions: true }]);
  } else if (isLib) {
    presets.push([require.resolve('@babel/preset-env'), babelPresetEnvOptions]);
    presets.push([require.resolve('@babel/preset-typescript'), { isTSX: true, allExtensions: true }]);
    presets.push([require.resolve('@babel/preset-react')]);
  } else if (isNative) {
    presets.push([require.resolve('metro-react-native-babel-preset')]);
    // TODO: is decorators plugin needed?
    // plugins.push([require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }]);
    sourceMaps = 'inline';
  }

  return {
    presets,
    plugins,
    // sourceMaps
    // babelrcRoots: [`${__dirname}/packages/*`]
  };
}

module.exports = {
  getBabelConfig,
};
