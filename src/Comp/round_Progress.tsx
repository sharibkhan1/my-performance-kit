import React, { type JSX } from 'react';
import { View, StyleSheet, ViewStyle, Text } from 'react-native';

const propStyle = (percent: number, base_degrees: number): ViewStyle => {
  const rotateBy = base_degrees + percent * 3.6;
  return { transform: [{ rotateZ: `${rotateBy}deg` }] };
};

const renderThirdLayer = (
  percent: number,
  size: number,
  strokeWidth: number,
  color: string,
  backgroundColor: string
): JSX.Element => {
  if (percent > 50) {
    return (
      <View
        style={[
          {
            width: size,
            height: size,
            position: 'absolute',
            borderWidth: strokeWidth,
            borderRadius: size / 2,
            borderLeftColor: 'transparent',
            borderBottomColor: 'transparent',
            borderRightColor: color,
            borderTopColor: color,
            transform: [{ rotateZ: '45deg' }],
          },
          propStyle(percent - 50, 45),
        ]}
      />
    );
  } else {
    return (
      <View
        style={{
          width: size,
          height: size,
          position: 'absolute',
          borderWidth: strokeWidth,
          borderRadius: size / 2,
          borderLeftColor: 'transparent',
          borderBottomColor: 'transparent',
          borderRightColor: backgroundColor,
          borderTopColor: backgroundColor,
          transform: [{ rotateZ: '-135deg' }],
        }}
      />
    );
  }
};

interface CircularProgressProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  textColor?: string;
  centerText?: string; // NEW PROP
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percent,
  size = 120,
  strokeWidth = 10,
  color = '#007AFF', // iOS blue
  backgroundColor = '#E5E5EA', // iOS light gray
  textColor = '#000',
  centerText, // NEW PROP
}) => {
  const firstProgressLayerStyle: ViewStyle =
    percent > 50 ? propStyle(50, -135) : propStyle(percent, -135);

  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderWidth: strokeWidth,
    borderRadius: size / 2,
    borderColor: backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const firstLayerStyle: ViewStyle = {
    width: size,
    height: size,
    borderWidth: strokeWidth,
    borderRadius: size / 2,
    position: 'absolute',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: color,
    borderTopColor: color,
    transform: [{ rotateZ: '-135deg' }],
  };

  return (
    <View style={containerStyle}>
      <View style={[firstLayerStyle, firstProgressLayerStyle]} />
      {renderThirdLayer(percent, size, strokeWidth, color, backgroundColor)}
      <Text
        style={[styles.display, { color: textColor, fontSize: size * 0.13 }]}
      >
        {centerText ?? `${percent}%`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  display: {
    position: 'absolute',
    fontWeight: '600',
  },
});

export default CircularProgress;
