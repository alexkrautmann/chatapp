import React, { FC } from 'react';
import { Navigation } from 'react-native-navigation';
import { foo } from '@chatapp/foo';
import { Biz } from '@chatapp/react-biz';
import styled from 'styled-components/native';
import Logo from '../../assets/images/logo.png';
import { Button } from '../../components/button/Button';
import { COUNTER } from '../index';

const HomeView = styled.View`
  flex: 1;
  padding: 16px;
`;

const HomeContent = styled.View`
  margin-bottom: 16px;
`;

const HomeLogo = styled.Image`
  margin-bottom: 16px;
`;

const HomeText = styled.Text`
  margin-bottom: 16px;
`;

interface HomeScreenProps {
  componentId: any;
}

export const HomeScreen: FC<HomeScreenProps> = ({ componentId }) => {
  const onCounterScreenPress = () => {
    Navigation.push(componentId, {
      component: {
        name: COUNTER,
      },
    });
  };

  return (
    <HomeView testID="HOME_SCREEN">
      <HomeContent>
        <HomeLogo source={Logo} resizeMode="contain" />

        <HomeText>
Welcome Home
          {foo}
        </HomeText>

        <Biz />
      </HomeContent>

      <Button onPress={onCounterScreenPress} title="Counter Screen" />
    </HomeView>
  );
};

HomeScreen.options = {
  topBar: {
    title: {
      text: 'Home',
    },
  },
};
