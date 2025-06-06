import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo, useState } from 'react';
import { createTheme } from '@mui/material/styles';
import { getDesignTokens } from '../styles/theme';
const ThemeContext = createContext(undefined);
/**
 * Provides MUI theme context + light/dark mode support.
 */
export const ThemeProvider = ({ children }) => {
    const [mode, setMode] = useState('light');
    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };
    const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
    const value = useMemo(() => ({ theme, mode, toggleTheme }), [theme, mode]);
    return _jsx(ThemeContext.Provider, { value: value, children: children });
};
/**
 * Hook to access theme context.
 */
export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
};
