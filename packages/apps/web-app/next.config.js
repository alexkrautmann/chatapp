const path = require('path');
const withTypescript = require('@zeit/next-typescript');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const withProgressBar = require('next-progressbar');
const withSize = require('next-size');
const withPlugins = require('next-compose-plugins');
const StatsPlugin = require('stats-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = withPlugins(
  [
    withProgressBar({
      progressBar: {
        profile: process.env.NODE_ENV === 'production'
      },
    }),
    withBundleAnalyzer({
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
    }),
    withSize,
    withTypescript,
  ],
  {
    webpack(config, { dev, isServer }) {

      config.resolve.extensions = [
        '.ts',
        '.tsx',
        '.mjs',
        '.wasm',
        '.js',
        '.jsx',
        '.json',
        // '*'
      ];

      config.module.rules.push({
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      });

      // Only run type checking once:
      // if (isServer) {
      //   config.plugins.push(
      //     new ForkTsCheckerWebpackPlugin({ measureCompilationTime: true }),
      //   );
      // }

      if (!dev) {
        config.plugins.push(
          isServer ? new StatsPlugin('../../reports/webpack/server/stats.json') : new StatsPlugin('../reports/webpack/client/stats.json'),
        );
      }

      return config
    },
  }
);
