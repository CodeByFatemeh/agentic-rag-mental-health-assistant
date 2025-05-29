import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthProvider';
import { ThemeProvider, useThemeContext } from './context/ThemeContext';
import './index.css';
import App from './App';
createRoot(document.getElementById('root')).render(_jsx(StrictMode, { children: _jsx(BrowserRouter, { basename: "/chatbot", children: _jsx(AuthProvider, { children: _jsx(ThemeProvider, { children: _jsx(AppContent, {}) }) }) }) }));
function AppContent() {
    const { theme } = useThemeContext();
    return (_jsxs(MuiThemeProvider, { theme: theme, children: [_jsx(Toaster, { position: 'bottom-right' }), _jsx(CssBaseline, {}), _jsx(App, {})] }));
}
