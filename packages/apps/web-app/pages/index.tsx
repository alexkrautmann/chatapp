import * as React from "react";
import {foo} from '@chatapp/foo'
import {Bar} from '@chatapp/react-bar'
import styled from 'styled-components'
import {Biz} from "@chatapp/react-biz";
import {Spaghet} from "../components/spaghet";

const Container = styled.div`
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  align-items: center;
`;

const Item = styled.div`
  margin: 8px;
`;

export default () => (
  <Container>
      <Item>
          Imported .ts file
          <div>{foo}</div>
      </Item>
      <Item>
          Imported .tsx file
          <Bar />
      </Item>
      <Item>
          Imported primitives .tsx file
          <Biz />
      </Item>
      <Item>
          Imported from nested .tsx file
          <Spaghet />
      </Item>
  </Container>

)
