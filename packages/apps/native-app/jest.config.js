// "jest": {
//   "preset": "react-native",
//     "setupFiles": [
//     "<rootDir>/scripts/jest-setup.js"
//   ],
//     "transform": {
//     "^.+\\.tsx?$": "ts-jest",
//       "^.+\\.jsx?$": "<rootDir>/node_modules/react-native/jest/preprocessor.js",
//       "^.+\\.css$": "<rootDir>/scripts/jest-css.js"
//   },
//   "modulePaths": [
//     "<rootDir>"
//   ],
//     "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
//     "testPathIgnorePatterns": [
//     "<rootDir>/node_modules/",
//     "<rootDir>/e2e/"
//   ],
//     "moduleFileExtensions": [
//     "ts",
//     "tsx",
//     "js",
//     "jsx",
//     "json",
//     "node"
//   ]
// },
// module.exports = {
//     "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
//     "testPathIgnorePatterns": ["<rootDir>"],
// };
const pkg = require('./package');
// const babelConfig = require('./babel.config');
// const { loadPartialConfig } = require("@babel/core");
// const { pathsToModuleNameMapper } = require('ts-jest/utils');
// const { compilerOptions } = require('./tsconfig');

module.exports = {
  displayName: pkg.name,
  testPathIgnorePatterns: ['<rootDir>'],
  testMatch: ['<rootDir>/src/**/?(*.)spec.[jt]s?(x)'],
  rootDir: './',
};
