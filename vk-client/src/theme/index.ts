import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0077FF', // VK Blue
    secondary: '#818C99',
    background: '#EBEDF0',
    surface: '#FFFFFF',
    error: '#E64646',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#0077FF', // VK Blue (sometimes lighter in dark mode, but let's keep it consistent)
    secondary: '#76787A',
    background: '#19191A',
    surface: '#232324',
    error: '#FF5C5C',
  },
};
