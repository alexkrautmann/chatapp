import { Observer } from 'mobx-react';
import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Button } from '../../components/button/Button';
import { Counter } from '../../stores/Counter';


const CounterView = styled.View`
  flex: 1;
  padding: 16px;
  background-color: #fff;
`;

const CounterContent = styled.View`
  margin-bottom: 16px;
`;

const CounterText = styled.Text`
  font-size: 21px;
  font-weight: 200;
`;

const CounterActions = styled.View`
  flex-direction: row;
`;

const CounterButton = styled(Button)`
  flex: 1;
`;

const CounterSpacer = styled.View`
  width: 16px;
`;

export const CounterScreen: FC = () => (
  <Observer
    render={() => (
      <CounterView testID="COUNTER_SCREEN">
        <CounterContent>
          <CounterText>
Counter:
            {Counter.counter}
          </CounterText>
        </CounterContent>

        <CounterActions>
          <CounterButton
            title="Decrement"
            onPress={Counter.decrement}
            testID="BUTTON_DECREMENT"
          />

          <CounterSpacer />

          <CounterButton
            title="Increment"
            onPress={Counter.increment}
            testID="BUTTON_INCREMENT"
          />
        </CounterActions>
      </CounterView>
    )}
  />
);

CounterScreen.options = {
  topBar: {
    title: {
      text: 'Counter',
    },
  },
};
