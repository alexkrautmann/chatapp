const path = require('path');
const fs = require('fs');
const nativeAppPackageJson = require('./package');
const withTypescript = require('@zeit/next-typescript');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const withProgressBar = require('next-progressbar');
const withTranspileModules = require('next-transpile-modules');
const withSize = require('next-size');
const withPlugins = require('next-compose-plugins');
const StatsPlugin = require('stats-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

function getMonoRepoAliases() {
  const packagesPath = path.resolve(__dirname, '../..');
  const aliases = {};
  fs.readdirSync(packagesPath).forEach((dir1) => {
    const packageTypePath = path.resolve(packagesPath, dir1);
    fs.readdirSync(packageTypePath).forEach((dir2) => {
      if (!dir2.startsWith('.')) {
        const packagePath = path.resolve(packageTypePath, dir2);
        const packageName = require(`${packagePath}/package.json`).name;
        if (Object.keys(nativeAppPackageJson.dependencies).includes(packageName)) {
          // aliases[packageName] = path.resolve(packagePath);
          aliases[packageName] = path.resolve(packagePath, 'src');
        }
      }
    })
  });
  return aliases;
}

module.exports = withPlugins(
  [
    [withTranspileModules, {
      // tsconfig-paths-webpack-plugin aliases @chatapp/* imports to their absolute paths so we
      // need to use this next plugin to set next.js webpack config to transpile monorepo deps
      transpileModules: [
        '/Users/alex/repos/misc/chatapp/packages/modules/react-biz/src/index.tsx',
        '/Users/alex/repos/misc/chatapp/packages/modules/react-biz/src/Inner.tsx',
        '/Users/alex/repos/misc/chatapp/packages/modules/react-bar/src/index.tsx',
        '/Users/alex/repos/misc/chatapp/packages/modules/foo/src/index.ts',
        // path.resolve(__dirname, '..', '..', 'modules'),
        // path.resolve(__dirname, '..', '..', 'modules', 'foo'),
        // path.resolve(__dirname, '..', '..', 'modules', 'react-bar'),
        // path.resolve(__dirname, '..', '..', 'modules', 'react-biz'),
        // '/Users/alex/repos/misc/chatapp/packages/modules/foo',
        // '/Users/alex/repos/misc/chatapp/packages/modules/react-biz',
        // '/Users/alex/repos/misc/chatapp/packages/modules/react-bar',
      ]
    }],
    [withProgressBar, {
      progressBar: {
        profile: process.env.NODE_ENV === 'production'
      },
    }],
    [withBundleAnalyzer, {
      analyzeServer: process.env.NODE_ENV === 'production',
      analyzeBrowser: process.env.NODE_ENV === 'production',
      // analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
      // analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
      bundleAnalyzerConfig: {
        server: {
          openAnalyzer: false,
          analyzerMode: 'static',
          reportFilename: '../../reports/webpack/server/analysis.html'
        },
        browser: {
          openAnalyzer: false,
          analyzerMode: 'static',
          reportFilename: '../reports/webpack/client/analysis.html'
        }
      },
    }],
    withSize,
    withTypescript,
  ],
  {
    webpack(config, { dev, isServer }) {

      // config.module.rules.push({
      //   test: /\.js$/,
      //   use: ["source-map-loader"],
      //   enforce: "pre"
      // });

      // Only run type checking once:
      // if (isServer) {
      //   config.plugins.push(
      //     new ForkTsCheckerWebpackPlugin({ measureCompilationTime: true }),
      //   );
      // }

      // const mainFields = [
      //   'chatappMain',
      //   ...config.resolve.mainFields
      // ];
      //
      // config.resolve.mainFields = mainFields;
      // config.resolve.aliasFields = mainFields;

      // config.resolve.extensions = [
      //   '.ts',
      //   '.tsx',
      //   '.mjs',
      //   '.wasm',
      //   '.js',
      //   '.jsx',
      //   '.json',
      //   // '*'
      // ];

      // TODO: document tsconfig-paths-webpack-plugin
      // config.resolve.plugins = [
      //   ...(config.resolve.plugins || []),
      //   new TsconfigPathsPlugin({
      //     configFile: path.resolve(__dirname, 'tsconfig.json'),
      //     // mainFields,
      //     logLevel: 'info'
      //   })
      // ];

      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        ...getMonoRepoAliases(),
        'styled-components': path.resolve(__dirname, 'node_modules', 'styled-components'),
        'react-primitives': path.resolve(__dirname, 'node_modules', 'react-primitives'),
      };

      if (!dev) {
        config.plugins.push(
          isServer
            ? new StatsPlugin('../../reports/webpack/server/stats.json')
            : new StatsPlugin('../reports/webpack/client/stats.json'),
        );
      }

      return config
    },
  }
);
