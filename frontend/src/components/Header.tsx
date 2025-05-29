import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Button,
  useMediaQuery,
  useTheme,
  styled
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Logo from './shared/Logo'
import { useAuth } from '../context/AuthContext'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { useThemeContext } from '../context/ThemeContext'

const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  margin: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
  }
}))

const Header = () => {
  const auth = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()
  const theme = useTheme()
  const { mode, toggleTheme } = useThemeContext()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    handleMenuClose()
    await auth.logout()
    navigate('/login')
  }

  const handleLogin = () => {
    handleMenuClose()
    navigate('/login')
  }

  const handleSignup = () => {
    handleMenuClose()
    navigate('/signup')
  }

  const handleChat = () => {
    handleMenuClose()
    navigate('/chat')
  }

  return (
    <AppBar
      sx={{ bgcolor: 'inherit', position: 'static' }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {isMobile && (
            <IconButton onClick={handleMenuOpen} aria-label='open menu'>
              <MenuIcon />
            </IconButton>
          )}
          <Logo />
        </div>

        {!isMobile && (
          <div>
            {auth.isLoggedIn ? (
              <div>
                <StyledButton onClick={handleChat}>Chat</StyledButton>
                <StyledButton onClick={handleLogout}>Logout</StyledButton>
                <IconButton onClick={toggleTheme}>
                  {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </div>
            ) : (
              <div>
                <StyledButton onClick={handleLogin}>Login</StyledButton>
                <StyledButton onClick={handleSignup}>Sign Up</StyledButton>
                <IconButton onClick={toggleTheme}>
                  {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </div>
            )}
          </div>
        )}

        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          {auth.isLoggedIn ? (
            <div>
              <MenuItem sx={{ width: '100%' }} onClick={handleChat}>
                Chat
              </MenuItem>
              <MenuItem sx={{ width: '100%' }} onClick={handleLogout}>
                Logout
              </MenuItem>
            </div>
          ) : (
            <div>
              <MenuItem sx={{ width: '100%' }} onClick={handleLogin}>
                Login
              </MenuItem>
              <MenuItem sx={{ width: '100%' }} onClick={handleSignup}>
                Sign Up
              </MenuItem>
            </div>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default Header
