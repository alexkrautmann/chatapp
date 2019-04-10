import { configure, addParameters } from '@storybook/react';
import { create } from '@storybook/theming/dist/index';

addParameters({
  options: {
    theme: create({
      base: 'dark',
      brandTitle: 'Fooo',
      brandUrl: 'https://github.com/storybooks/storybook/tree/master/examples/cra-kitchen-sink',
      // gridCellSize: 12,
    }),
  },
});

function importAll(r) {
  // const req = require.context(path, true, /((?!node_modules\/|dist\/).)*\.stories\.[jt]sx?$/);
  r.keys().forEach(r);
}

// const req = require.context('../../modules/react-bar', true, /stories\.tsx?$/);
// const req = require.context('../../modules', true, /((?!node_modules\/|dist\/).)*\.stories\.[jt]sx?$/);
// const req = require.context('../../', true, /^((?![\\/]node_modules|vendor[\\/]).)*\.md$/);
// This makes the build really slow :(
const reqConfigs = require.context('../../modules', true, /((?!node_modules[\\/]).)*\.stories\.tsx?$/);
const reqApps = require.context('../../modules', true, /((?!node_modules[\\/]).)*\.stories\.tsx?$/);
const reqModules = require.context('../../modules', true, /((?!node_modules[\\/]).)*\.stories\.tsx?$/);
function loadStories() {
  require('./stories/welcome1.jsx');
  require('./stories/welcome2.jsx');
  require('./stories/welcome3.tsx');
  importAll(reqConfigs);
  importAll(reqApps);
  importAll(reqModules);
  // require('../../modules/react-bar/src/index.stories');
  // require('../../modules/react-biz/src/index.stories');
  // require('../../modules/react-whatever/src/index.stories');
}

configure(loadStories, module);
