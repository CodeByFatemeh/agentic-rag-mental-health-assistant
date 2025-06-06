import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Button,
  useMediaQuery,
  useTheme,
  styled,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Logo from './shared/Logo';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../context/ThemeContext';
import React from 'react';

interface AuthContext {
  isLoggedIn: boolean;
  logout: () => Promise<void>;
}

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
const Header: React.FC = () => {
  const auth = useAuth() as AuthContext;
  const { mode, toggleTheme } = useThemeContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
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
    } catch (error) {
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

  return (
    <AppBar sx={{ bgcolor: 'inherit', position: 'static' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isMobile && (
            <IconButton onClick={handleMenuOpen} aria-label="Open menu">
              <MenuIcon />
            </IconButton>
          )}
          <Logo aria-label="MindEase Home" />
        </Box>

        {!isMobile && (
          <Box>
            {auth.isLoggedIn ? (
              <>
                <StyledButton onClick={handleChat} aria-label="Go to chat">
                  Chat
                </StyledButton>
                <StyledButton onClick={handleLogout} aria-label="Logout">
                  Logout
                </StyledButton>
                <IconButton onClick={toggleTheme} aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
                  {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </>
            ) : (
              <>
                <StyledButton onClick={handleLogin} aria-label="Login">
                  Login
                </StyledButton>
                <StyledButton onClick={handleSignup} aria-label="Sign up">
                  Sign Up
                </StyledButton>
                <IconButton onClick={toggleTheme} aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
                  {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </>
            )}
          </Box>
        )}

        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          {auth.isLoggedIn ? (
            <>
              <MenuItem onClick={handleChat} aria-label="Go to chat">
                Chat
              </MenuItem>
              <MenuItem onClick={handleLogout} aria-label="Logout">
                Logout
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem onClick={handleLogin} aria-label="Login">
                Login
              </MenuItem>
              <MenuItem onClick={handleSignup} aria-label="Sign up">
                Sign Up
              </MenuItem>
            </>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default React.memo(Header);