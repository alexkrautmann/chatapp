import * as React from 'react';
import styled from 'styled-components/primitives';
import { foo } from '@chatapp/foo';

const Wrapper = styled.Text`
  color: green;
`;

const Innerer = styled.Text`
  color: magenta;
`;

export const Inner = () => (
  <Wrapper>
baz
    <Innerer>{foo}</Innerer>
  </Wrapper>
);
