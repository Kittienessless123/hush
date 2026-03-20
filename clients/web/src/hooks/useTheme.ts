import { createContext, useContext } from 'react';
import { themes, type Theme } from '../styles/theme';

export const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}>({
  theme: themes.dark,
  toggleTheme: () => {},
  isDark: true,
});

export const useTheme = () => useContext(ThemeContext);