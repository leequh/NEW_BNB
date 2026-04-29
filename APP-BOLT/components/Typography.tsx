import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { typography, colors } from '@/utils/theme';

type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'button';

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  weight?: 'regular' | 'medium' | 'semiBold' | 'bold';
  children: React.ReactNode;
}

export default function Typography({
  variant = 'body1',
  color = colors.neutral[800],
  align = 'left',
  weight,
  style,
  children,
  ...props
}: TypographyProps) {
  // Determine the font weight based on variant if not explicitly provided
  const getDefaultWeight = (): 'regular' | 'medium' | 'semiBold' | 'bold' => {
    switch (variant) {
      case 'h1':
      case 'h2':
        return 'bold';
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
      case 'subtitle1':
      case 'button':
        return 'semiBold';
      case 'subtitle2':
        return 'medium';
      default:
        return 'regular';
    }
  };

  const fontWeight = weight || getDefaultWeight();

  return (
    <Text
      style={[
        styles[variant],
        {
          color,
          textAlign: align,
          fontFamily: typography.fontFamily[fontWeight],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: typography.fontSize['4xl'],
    lineHeight: typography.lineHeight['4xl'],
  },
  h2: {
    fontSize: typography.fontSize['3xl'],
    lineHeight: typography.lineHeight['3xl'],
  },
  h3: {
    fontSize: typography.fontSize['2xl'],
    lineHeight: typography.lineHeight['2xl'],
  },
  h4: {
    fontSize: typography.fontSize.xl,
    lineHeight: typography.lineHeight.xl,
  },
  h5: {
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.lg,
  },
  h6: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
  },
  subtitle1: {
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.lg,
  },
  subtitle2: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
  },
  body1: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
  },
  body2: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
  },
  caption: {
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
  },
  button: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
  },
});
