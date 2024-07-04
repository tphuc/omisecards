import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ViewStyle, ActivityIndicator } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColor';

type ButtonProps = TouchableOpacityProps & {
  title: string;
  variant?: 'default' | 'primary' | 'secondary' | 'destructive';
  loading?: boolean;
};

export function ThemedButton({ title, variant = 'default', style, loading = false, ...rest }: ButtonProps) {
  const { background, backgroundSecondary, text, tint, textSecondary, textMuted } = useThemeColors();

  const buttonStyles = [
    styles.button,
    variant === 'default' && { backgroundColor: background },
    variant === 'primary' && { backgroundColor: tint },
    variant === 'secondary' && { backgroundColor: backgroundSecondary },
    variant === 'destructive' && { backgroundColor: '#ef4444' },
    style,
  ];

  const textStyles = [
    styles.text,
    variant === 'default' && { color: text },
    variant === 'primary' && { color: '#ffffff' },
    variant === 'secondary' && { color: textMuted },
    variant === 'destructive' && { color: '#ffffff' },
  ];

  return (
    <TouchableOpacity style={buttonStyles} {...rest} activeOpacity={0.9} disabled={loading}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'destructive' ? '#ffffff' : tint} />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    height: 46,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
});
