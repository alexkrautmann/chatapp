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

// function importAll(r) {
//     r.keys().forEach(r);
// }

// const req = require.context("../../modules", true, /.+\/src\/.+\.stories\.tsx?$/);
function loadStories() {
  require('./stories/welcome');
  require('../../modules/react-bar/src/index.stories');
  require('../../modules/react-biz/src/index.stories');
  require('../../modules/react-whatever/src/index.stories');
  // importAll(require.context("../../modules", true, /.stories.tsx$/))
  // req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
