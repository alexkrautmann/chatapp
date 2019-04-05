import React, { FC } from 'react';
import {
  AccessibilityTrait,
  GestureResponderEvent,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';

interface ButtonProps {
  title: string;
  accessibilityLabel?: string;
  testID?: string;
  disabled?: boolean;
  hasTVPreferredFocus?: boolean;
  onPress?(event: GestureResponderEvent): void;
}

const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

const ButtonView = styled.View<ButtonProps>`
  border-radius: 4px;
  background-color: ${props => (props.disabled ? '#e4e4e4' : '#eee')};
`;

const ButtonText = styled.Text<ButtonProps>`
  padding: 12px;
  font-size: 18px;
  text-align: center;
  color: ${props => (props.disabled ? '#b8b8b8' : '#000')};
`;

export const Button: FC<ButtonProps> = ({title, accessibilityLabel, disabled, onPress, hasTVPreferredFocus, testID}) => {
  const accessibilityTraits: AccessibilityTrait[] = ['button'];

  if (disabled) {
    accessibilityTraits.push('disabled');
  }

  const titleLabel = Platform.OS === 'android' ? title.toLocaleUpperCase() : title;

  return (
    <Touchable
      accessibilityComponentType="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityTraits={accessibilityTraits}
      testID={testID}
      disabled={disabled}
      onPress={onPress}
      {...(Platform.OS === 'ios' ? { hasTVPreferredFocus } : {})}
    >
      <ButtonView>
        <ButtonText>{titleLabel}</ButtonText>
      </ButtonView>
    </Touchable>
  );
};
