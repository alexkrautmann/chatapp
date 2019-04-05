const path = require('path');
const { defaults } = require('jest-config');

function getJestConfig(projectDir) {
  const pkg = require(`${projectDir}/package.json`);
  const transformerPath = path.resolve(__dirname, 'babel-transformer.js');
  return {
    // use package name for suite name in jest runner
    displayName: pkg.name,
    // test files under src that end in ".spec.ext"
    testMatch: ['<rootDir>/**/*.spec.[jt]s?(x)'],
    // allow jest to handle ts/tsx
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
    moduleNameMapper: {
      // point inter-monorepo deps at each other's src
      // TODO: might need to define a custom jest resolver to handle imports from things outside packages/modules
      '@chatapp/(.+)': '<rootDir>/../../modules/$1/src',
      // latest react-native and react-native-web renamed this file
      // todo: put a PR into react-primitives for this?
      // 'react-native-web/dist/cjs/exports/StyleSheet/ReactNativeStyleResolver': 'react-native-web/dist/cjs/exports/StyleSheet/styleResolver.js',
      // these polyfills might not be brought in properly in a package or it's deps, so point them to jest-config's deps
      'regenerator-runtime/(.+)': `${__dirname}/node_modules/regenerator-runtime/$1`,
      '^core-js/modules/(.+)': `${__dirname}/node_modules/core-js/modules/$1`,
    },
    transform: {
      // we create our own babel transformer so we can pass our own config from @chatapp/babel-config
      '^.+\\.[jt]sx?$': transformerPath,
    },
  };
}

module.exports = {
  getJestConfig,
};
