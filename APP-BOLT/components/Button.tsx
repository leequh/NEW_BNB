import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ActivityIndicator,
  View,
} from 'react-native';
import { colors, typography, borderRadius, spacing } from '@/utils/theme';
import Typography from './Typography';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth = false,
  loading = false,
  disabled = false,
  style,
  children,
  ...props
}: ButtonProps) {
  const buttonStyles = [
    styles.button,
    styles[variant],
    styles[`${size}Height`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    disabled && styles[`${variant}Disabled`],
    style,
  ];

  // Determine text color based on variant
  const getTextColor = () => {
    if (disabled) {
      return variant === 'outline' || variant === 'ghost'
        ? colors.neutral[400]
        : colors.white;
    }

    switch (variant) {
      case 'primary':
        return colors.white;
      case 'secondary':
        return colors.white;
      case 'outline':
        return colors.primary.default;
      case 'ghost':
        return colors.primary.default;
      default:
        return colors.white;
    }
  };

  const textVariant = size === 'sm' ? 'body2' : 'body1';
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 18 : 20;
  const iconColor = getTextColor();

  return (
    <TouchableOpacity
      style={buttonStyles}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
        />
      ) : (
        <View style={styles.contentContainer}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Typography
            variant={textVariant}
            weight="semiBold"
            color={getTextColor()}
            align="center"
          >
            {children}
          </Typography>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary.default,
  },
  secondary: {
    backgroundColor: colors.secondary.default,
  },
  outline: {
    backgroundColor: colors.transparent,
    borderWidth: 1,
    borderColor: colors.primary.default,
  },
  ghost: {
    backgroundColor: colors.transparent,
  },
  disabled: {
    opacity: 0.5,
  },
  primaryDisabled: {
    backgroundColor: colors.neutral[300],
  },
  secondaryDisabled: {
    backgroundColor: colors.neutral[300],
  },
  outlineDisabled: {
    borderColor: colors.neutral[300],
  },
  ghostDisabled: {},
  smHeight: {
    height: 36,
  },
  mdHeight: {
    height: 44,
  },
  lgHeight: {
    height: 52,
  },
  fullWidth: {
    width: '100%',
  },
  leftIcon: {
    marginRight: spacing.xs,
  },
  rightIcon: {
    marginLeft: spacing.xs,
  },
});