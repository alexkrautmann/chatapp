const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const json = require('rollup-plugin-json');
const { getBabelConfig } = require('@chatapp/babel-config');

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

function getRollupConfig(modulePath) {
  const pkg = require(`${modulePath}/package.json`);

  const externalDeps = [
    ...Object.keys(pkg.peerDependencies || {}),
    ...Object.keys(pkg.optionalDependencies || {}),
    ...Object.keys(pkg.dependencies || {}),
  ];

  return {
    input: './src',

    // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
    external: id => externalDeps.some(dep => id.startsWith(dep)),

    plugins: [
      // Allows node_modules resolution
      resolve({ extensions }),

      // bundle json
      json(),

      // Compile TypeScript/JavaScript files
      babel({
        extensions,
        babelrc: false,
        include: ['src/**/*'],
        ...getBabelConfig({ babelTarget: 'library' }),
      }),
    ],

    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
      },
    ],
  };
}

module.exports = {
  getRollupConfig,
};
