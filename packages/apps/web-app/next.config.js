const path = require('path');
const fs = require('fs');
const withTypescript = require('@zeit/next-typescript');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const withProgressBar = require('next-progressbar');
const withTranspileModules = require('next-transpile-modules');
const withSize = require('next-size');
const withPlugins = require('next-compose-plugins');
const StatsPlugin = require('stats-webpack-plugin');
const webAppPackageJson = require('./package');

function getMonoRepoAliases() {
  const packagesPath = path.resolve(__dirname, '../..');
  const aliases = {};
  fs.readdirSync(packagesPath).forEach((dir1) => {
    const packageTypePath = path.resolve(packagesPath, dir1);
    fs.readdirSync(packageTypePath).forEach((dir2) => {
      if (!dir2.startsWith('.')) {
        const packagePath = path.resolve(packageTypePath, dir2);
        // TODO UNSAFE REQUIRE! (try-catch)
        const packageName = require(`${packagePath}/package.json`).name;
        if (Object.keys(webAppPackageJson.dependencies).includes(packageName)) {
          // aliases[packageName] = path.resolve(packagePath);
          // aliases[packageName] = path.resolve(packagePath, 'src');
          const packageSrcPath = path.resolve(packagePath, 'src');
          if (fs.existsSync(packageSrcPath)) {
            aliases[packageName] = packageSrcPath;
          } else {
            aliases[packageName] = packagePath;
          }
        }
      }
    });
  });
  return aliases;
}

module.exports = withPlugins(
  [
    [withTranspileModules, {
      transpileModules: [
        path.resolve(__dirname, '..', '..', 'modules'),
      ],
    }],
    [withProgressBar, {
      progressBar: {
        profile: process.env.NODE_ENV === 'production',
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
          reportFilename: '../../reports/webpack/server/analysis.html',
        },
        browser: {
          openAnalyzer: false,
          analyzerMode: 'static',
          reportFilename: '../reports/webpack/client/analysis.html',
        },
      },
    }],
    withSize,
    withTypescript,
  ],
  {
    // distDir: '../.next',
    // distDir: `${path.relative(__dirname, process.cwd())}/.next`,
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

      const entry = async () => {
        const entries = await config.entry();
        // ignore spec files
        Object.keys(entries).forEach((key) => {
          if (key.includes('.spec.js')) {
            delete entries[key];
          }
        });
        return entries;
      };

      const resolve = {
        ...(config.resolve || {}),
        alias: {
          ...(config.resolve.alias || {}),
          ...getMonoRepoAliases(),
          // there should only be a single instance of styled-components
          // https://www.styled-components.com/docs/faqs#why-am-i-getting-a-warning-about-several-instances-of-module-on-the-page
          'styled-components': path.resolve(__dirname, 'node_modules', 'styled-components'),
          // similarily, set important react deps to use the web=app's versions
          react: path.resolve(__dirname, 'node_modules', 'react'),
          'react-dom': path.resolve(__dirname, 'node_modules', 'react-dom'),
          'react-native-web': path.resolve(__dirname, 'node_modules', 'react-native-web'),
          'react-primitives': path.resolve(__dirname, 'node_modules', 'react-primitives'),
        },
      };

      const plugins = [
        ...(config.plugins || {}),
        !dev && (
          isServer ? new StatsPlugin('../../reports/webpack/server/stats.json') : new StatsPlugin('../reports/webpack/client/stats.json')
        ),
      ].filter(plugin => typeof plugin === 'object');

      return {
        ...config,
        entry,
        resolve,
        plugins,
      };
    },
  },
);
