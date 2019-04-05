const { getBabelConfig } = require('@chatapp/babel-config');
const path = require('path');

module.exports = ({ config }) => {
  console.log(JSON.stringify(config.module.rules[0], null, 4));

  config.module.rules.push({
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          cacheDirectory: path.resolve(__dirname, 'node_modules', '.cache', 'storybook'),
          ...getBabelConfig({ babelTarget: 'library' }),
        },
      },
      require.resolve('react-docgen-typescript-loader'),
    ],
  });

  config.resolve.extensions.push('.ts', '.tsx');

  config.resolve.alias = {
    ...config.resolve.alias,
    // there should only be a single instance of styled-components
    // https://www.styled-components.com/docs/faqs#why-am-i-getting-a-warning-about-several-instances-of-module-on-the-page
    'styled-components': path.resolve(__dirname, 'node_modules', 'styled-components'),
  };

  return config;
};
