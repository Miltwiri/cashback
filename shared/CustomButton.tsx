import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';

interface CustomButtonProps {
  type?: 'primary' | 'secondary' | 'tertiary';
  title: string;
  onPress: () => void;
  disabled?: boolean;
  height?: number;
  width?: number;
  borderRadius?: number;
}

const CustomButton: React.FC<CustomButtonProps> = ({ type = 'primary', title, onPress, disabled = false, height = 50, width = 150, borderRadius = 5 }) => {
  let styles = getButtonStyles(type, disabled, height, width, borderRadius);

  return (
    <Pressable onPress={onPress} disabled={disabled} style={styles.button}>
      <View>
        <Text style={styles.text}>{title}</Text>
      </View>
    </Pressable>
  );
};

const getButtonStyles = (type: 'primary' | 'secondary' | 'tertiary', disabled: boolean, height: number, width: number, borderRadius: number) => {
  const baseStyle = {
    height: height,
    width: width,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: borderRadius,
  };

  const styles = StyleSheet.create({
    button: {
      ...baseStyle,
      backgroundColor: disabled ? 'gray' : type === 'primary' ? 'blue' : type === 'secondary' ? 'white' : 'transparent',
      borderColor: type === 'secondary' ? 'gray' : 'transparent',
      borderWidth: type === 'secondary' ? 1 : 0,
      alignItems: type === 'tertiary' ? 'flex-start' : 'center',
    },
    text: {
      color: disabled ? 'lightgray' : type === 'secondary' ? 'black' : type === 'tertiary' ? '#3C5291' : 'white',
      fontStyle: type === 'tertiary' ? 'italic' : 'normal',
    },
  });

  return styles;
};

export default CustomButton;
