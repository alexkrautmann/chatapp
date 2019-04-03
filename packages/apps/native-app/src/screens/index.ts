import CodePush from 'react-native-code-push';
import { Navigation } from 'react-native-navigation';
import { codePushConfig } from '../utils/code-push';
import { CounterScreen } from './counter/Counter';
import { HomeScreen } from './home/Home';

export const Screens = new Map();

export const HOME = 'chatapp.Home';
export const COUNTER = 'chatapp.Counter';

Screens.set(HOME, CodePush(codePushConfig())(HomeScreen));
Screens.set(COUNTER, CounterScreen);

export const startApp = () => {
  Navigation.setRoot({
    root: {
      stack: {
        id: 'ROOT_STACK',
        children: [
          {
            component: { name: HOME },
          },
        ],
      },
    },
  });
};
