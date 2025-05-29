import { createContext, useState, useContext, useMemo } from 'react';
import { Theme, PaletteMode, createTheme } from '@mui/material/styles';
import { getDesignTokens } from '../styles/theme'; // Adjust the path

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  mode: PaletteMode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<PaletteMode>('light');

  const toggleTheme = () => {
    setMode((prevMode: PaletteMode) =>
      prevMode === 'light' ? 'dark' : 'light'
    );
  };

  const themeMemo = useMemo(() => createTheme(getDesignTokens(mode)), [mode]); // Directly use getDesignTokens

  return (
    <ThemeContext.Provider value={{ theme: themeMemo, toggleTheme, mode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};