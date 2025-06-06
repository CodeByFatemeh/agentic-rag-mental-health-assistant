import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Button, useMediaQuery, useTheme, styled, Box, } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Logo from './shared/Logo';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../context/ThemeContext';
import React from 'react';
const StyledButton = styled(Button)(({ theme }) => ({
    color: theme.palette.text.primary,
    margin: theme.spacing(1),
    '&:hover': {
        backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
    },
}));
/**
 * Navigation header for the app.
 */
const Header = () => {
    const auth = useAuth();
    const { mode, toggleTheme } = useThemeContext();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const handleMenuOpen = useCallback((event) => {
        setAnchorEl(event.currentTarget);
    }, []);
    const handleMenuClose = useCallback(() => {
        setAnchorEl(null);
    }, []);
    const handleLogout = useCallback(async () => {
        handleMenuClose();
        try {
            await auth.logout();
            navigate('/login');
        }
        catch (error) {
            console.error('Logout failed:', error);
        }
    }, [auth, navigate, handleMenuClose]);
    const handleLogin = useCallback(() => {
        handleMenuClose();
        navigate('/login');
    }, [navigate, handleMenuClose]);
    const handleSignup = useCallback(() => {
        handleMenuClose();
        navigate('/signup');
    }, [navigate, handleMenuClose]);
    const handleChat = useCallback(() => {
        handleMenuClose();
        navigate('/chat');
    }, [navigate, handleMenuClose]);
    return (_jsx(AppBar, { sx: { bgcolor: 'inherit', position: 'static' }, children: _jsxs(Toolbar, { sx: { display: 'flex', justifyContent: 'space-between' }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [isMobile && (_jsx(IconButton, { onClick: handleMenuOpen, "aria-label": "Open menu", children: _jsx(MenuIcon, {}) })), _jsx(Logo, { "aria-label": "MindEase Home" })] }), !isMobile && (_jsx(Box, { children: auth.isLoggedIn ? (_jsxs(_Fragment, { children: [_jsx(StyledButton, { onClick: handleChat, "aria-label": "Go to chat", children: "Chat" }), _jsx(StyledButton, { onClick: handleLogout, "aria-label": "Logout", children: "Logout" }), _jsx(IconButton, { onClick: toggleTheme, "aria-label": `Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`, children: mode === 'dark' ? _jsx(Brightness7Icon, {}) : _jsx(Brightness4Icon, {}) })] })) : (_jsxs(_Fragment, { children: [_jsx(StyledButton, { onClick: handleLogin, "aria-label": "Login", children: "Login" }), _jsx(StyledButton, { onClick: handleSignup, "aria-label": "Sign up", children: "Sign Up" }), _jsx(IconButton, { onClick: toggleTheme, "aria-label": `Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`, children: mode === 'dark' ? _jsx(Brightness7Icon, {}) : _jsx(Brightness4Icon, {}) })] })) })), _jsx(Menu, { anchorEl: anchorEl, open: open, onClose: handleMenuClose, children: auth.isLoggedIn ? (_jsxs(_Fragment, { children: [_jsx(MenuItem, { onClick: handleChat, "aria-label": "Go to chat", children: "Chat" }), _jsx(MenuItem, { onClick: handleLogout, "aria-label": "Logout", children: "Logout" })] })) : (_jsxs(_Fragment, { children: [_jsx(MenuItem, { onClick: handleLogin, "aria-label": "Login", children: "Login" }), _jsx(MenuItem, { onClick: handleSignup, "aria-label": "Sign up", children: "Sign Up" })] })) })] }) }));
};
export default React.memo(Header);
