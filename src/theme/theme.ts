import { DefaultTheme } from '@react-navigation/native';

// type TypographyStyle = Pick<TextStyle, 'fontSize' | 'fontWeight'>;
type TypographyStyle = {
    fontSize: number;
    fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  };


interface Typography {
  h1: TypographyStyle;
  h2: TypographyStyle;
  h3: TypographyStyle;
  body: TypographyStyle;
  caption: TypographyStyle;
}

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    card: '#F2F2F7',
    text: '#000000',
    border: '#C6C6C8',
    notification: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    surface: '#FFFFFF',
    gray: {
      100: '#F2F2F7',
      200: '#E5E5EA',
      300: '#D1D1D6',
      400: '#C7C7CC',
      500: '#AEAEB2',
      600: '#8E8E93',
      700: '#636366',
      800: '#48484A',
      900: '#3A3A3C',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700',
    } as TypographyStyle,
    h2: {
      fontSize: 24,
      fontWeight: '700',
    } as TypographyStyle,
    h3: {
      fontSize: 20,
      fontWeight: '700',
    } as TypographyStyle,
    body: {
      fontSize: 16,
      fontWeight: '400',
    } as TypographyStyle,
    caption: {
      fontSize: 14,
      fontWeight: '400',
    } as TypographyStyle,
  } as Typography,
};

export const darkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    background: '#000000',
    card: '#1C1C1E',
    text: '#FFFFFF',
    border: '#38383A',
    notification: '#FF453A',
    success: '#32D74B',
    warning: '#FF9F0A',
    error: '#FF453A',
    surface: '#1C1C1E',
    gray: {
      100: '#1C1C1E',
      200: '#2C2C2E',
      300: '#3A3A3C',
      400: '#48484A',
      500: '#636366',
      600: '#8E8E93',
      700: '#AEAEB2',
      800: '#C7C7CC',
      900: '#D1D1D6',
    },
  },
  spacing: lightTheme.spacing,
  borderRadius: lightTheme.borderRadius,
  typography: lightTheme.typography,
};

export type Theme = typeof lightTheme;
