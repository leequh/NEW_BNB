import { Platform } from 'react-native';

// Colors
export const colors = {
  primary: {
    default: '#FF5A5F',
    light: '#FF8589',
    dark: '#E00007',
  },
  secondary: {
    default: '#00A699',
    light: '#5DDAD1',
    dark: '#007A71',
  },
  accent: {
    default: '#914669',
    light: '#B35C89',
    dark: '#6D3249',
  },
  neutral: {
    50: '#F8F8F8',
    100: '#F0F0F0',
    200: '#E4E4E4',
    300: '#D1D1D1',
    400: '#B0B0B0',
    500: '#888888',
    600: '#636363',
    700: '#484848',
    800: '#303030',
    900: '#1F1F1F',
  },
  success: {
    default: '#008489',
    light: '#4DB1B5',
    dark: '#005A5F',
  },
  warning: {
    default: '#FFB400',
    light: '#FFCB4C',
    dark: '#CC9000',
  },
  error: {
    default: '#FF4D58',
    light: '#FF7B83',
    dark: '#CC0011',
  },
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// Typography
export const typography = {
  fontFamily: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 30,
    '2xl': 32,
    '3xl': 38,
    '4xl': 44,
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,
  '5xl': 80,
  '6xl': 128,
};

// Border Radius
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Shadows
export const shadows = {
  sm: {
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    }),
  },
  md: {
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
    }),
  },
  lg: {
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
    }),
  },
};

// Z-index
export const zIndex = {
  base: 0,
  elevated: 1,
  dropdown: 10,
  sticky: 100,
  fixed: 200,
  modal: 300,
  popover: 400,
  overlay: 500,
  toast: 600,
  tooltip: 700,
};

// Animation durations
export const animation = {
  fast: 200,
  normal: 300,
  slow: 500,
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  zIndex,
  animation,
};
