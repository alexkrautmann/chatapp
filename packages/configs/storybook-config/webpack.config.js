const path = require('path');
const fs = require('fs');
const { getBabelConfig } = require('@chatapp/babel-config');

function findPackageEntry(packagePath) {
  const possiblePaths = [
    `${packagePath}/src/index.tsx`,
    `${packagePath}/src/index.ts`,
    `${packagePath}/src/index.jsx`,
    `${packagePath}/src/index.js`,
    `${packagePath}/index.tsx`,
    `${packagePath}/index.ts`,
    `${packagePath}/index.jsx`,
    `${packagePath}/index.js`,
  ];
  return possiblePaths.find(possiblePath => fs.existsSync(possiblePath));
}

function getMonoRepoAliases() {
  const packagesPath = path.resolve(__dirname, '../..');
  const aliases = {};
  fs.readdirSync(packagesPath).forEach((dir1) => {
    const packageTypePath = path.resolve(packagesPath, dir1);
    fs.readdirSync(packageTypePath).forEach((dir2) => {
      if (!dir2.startsWith('.')) {
        const packagePath = path.resolve(packageTypePath, dir2);
        const packageName = require(`${packagePath}/package.json`).name;
        const foundPackageEntry = findPackageEntry(packagePath);
        if (foundPackageEntry) {
          aliases[packageName] = foundPackageEntry;
        } else {
          console.error(`Could not resolve module for "${packageName}"`);
        }
      }
    });
  });
  return aliases;
}

module.exports = ({ config }) => {

  config.module.rules.push({
    test: /\.tsx?$/,
    exclude: /node_modules/,
    include: path.resolve(__dirname, '..', '..'),
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          cacheDirectory: path.resolve(__dirname, 'node_modules', '.cache', 'storybook'),
          // ...babelLoader.options,
          ...getBabelConfig({ babelTarget: 'library' }),
        },
      },
      require.resolve('react-docgen-typescript-loader'),
    ],
  });

  config.resolve.extensions.push('.ts', '.tsx');

  // config.resolve.modules = [
  //   ...(config.resolve.modules || []),
  //   path.resolve(__dirname, '../../..'),
  //   path.resolve(__dirname, '../../../packages/modules'),
  //   // path.resolve(__dirname, '../../../modules'),
  // ];

  config.resolve.alias = {
    ...config.resolve.alias,
    ...getMonoRepoAliases(),
    // there should only be a single instance of styled-components
    // https://www.styled-components.com/docs/faqs#why-am-i-getting-a-warning-about-several-instances-of-module-on-the-page
    'styled-components': path.resolve(__dirname, 'node_modules', 'styled-components'),
    react: path.resolve(__dirname, 'node_modules', 'react'),
    'react-dom': path.resolve(__dirname, 'node_modules', 'react-dom'),
    'react-native-web': path.resolve(__dirname, 'node_modules', 'react-native-web'),
    'react-primitives': path.resolve(__dirname, 'node_modules', 'react-primitives'),
    '@storybook/react': path.resolve(__dirname, 'node_modules', '@storybook/react'),
  };

  return config;
};
