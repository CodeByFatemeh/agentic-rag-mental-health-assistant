import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useContext, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';
import { getDesignTokens } from '../styles/theme'; // Adjust the path
const ThemeContext = createContext(undefined);
export const ThemeProvider = ({ children }) => {
    const [mode, setMode] = useState('light');
    const toggleTheme = () => {
        setMode((prevMode) => prevMode === 'light' ? 'dark' : 'light');
    };
    const themeMemo = useMemo(() => createTheme(getDesignTokens(mode)), [mode]); // Directly use getDesignTokens
    return (_jsx(ThemeContext.Provider, { value: { theme: themeMemo, toggleTheme, mode }, children: children }));
};
export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
};
