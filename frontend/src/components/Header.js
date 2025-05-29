import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Button, useMediaQuery, useTheme, styled } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from './shared/Logo';
import { useAuth } from '../context/AuthContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeContext } from '../context/ThemeContext';
const StyledButton = styled(Button)(({ theme }) => ({
    color: theme.palette.text.primary,
    margin: theme.spacing(1),
    '&:hover': {
        backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
    }
}));
const Header = () => {
    const auth = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const theme = useTheme();
    const { mode, toggleTheme } = useThemeContext();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = async () => {
        handleMenuClose();
        await auth.logout();
        navigate('/login');
    };
    const handleLogin = () => {
        handleMenuClose();
        navigate('/login');
    };
    const handleSignup = () => {
        handleMenuClose();
        navigate('/signup');
    };
    const handleChat = () => {
        handleMenuClose();
        navigate('/chat');
    };
    return (_jsx(AppBar, { sx: { bgcolor: 'inherit', position: 'static' }, children: _jsxs(Toolbar, { sx: { display: 'flex', justifyContent: 'space-between' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center' }, children: [isMobile && (_jsx(IconButton, { onClick: handleMenuOpen, "aria-label": 'open menu', children: _jsx(MenuIcon, {}) })), _jsx(Logo, {})] }), !isMobile && (_jsx("div", { children: auth.isLoggedIn ? (_jsxs("div", { children: [_jsx(StyledButton, { onClick: handleChat, children: "Chat" }), _jsx(StyledButton, { onClick: handleLogout, children: "Logout" }), _jsx(IconButton, { onClick: toggleTheme, children: mode === 'dark' ? _jsx(Brightness7Icon, {}) : _jsx(Brightness4Icon, {}) })] })) : (_jsxs("div", { children: [_jsx(StyledButton, { onClick: handleLogin, children: "Login" }), _jsx(StyledButton, { onClick: handleSignup, children: "Sign Up" }), _jsx(IconButton, { onClick: toggleTheme, children: mode === 'dark' ? _jsx(Brightness7Icon, {}) : _jsx(Brightness4Icon, {}) })] })) })), _jsx(Menu, { anchorEl: anchorEl, open: open, onClose: handleMenuClose, children: auth.isLoggedIn ? (_jsxs("div", { children: [_jsx(MenuItem, { sx: { width: '100%' }, onClick: handleChat, children: "Chat" }), _jsx(MenuItem, { sx: { width: '100%' }, onClick: handleLogout, children: "Logout" })] })) : (_jsxs("div", { children: [_jsx(MenuItem, { sx: { width: '100%' }, onClick: handleLogin, children: "Login" }), _jsx(MenuItem, { sx: { width: '100%' }, onClick: handleSignup, children: "Sign Up" })] })) })] }) }));
};
export default Header;
