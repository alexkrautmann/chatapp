import React from 'react';
import { storiesOf } from '@storybook/react';
import { Whatever } from '.';

storiesOf('Modules|Whatever', module)
  .add('default', () => (
    <Whatever />
  ));
