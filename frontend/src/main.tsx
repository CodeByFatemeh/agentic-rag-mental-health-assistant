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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/chatbot">
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

function AppContent() {
  const { theme } = useThemeContext();

  return (
    <MuiThemeProvider theme={theme}>
      <Toaster position='bottom-right' />
      <CssBaseline />
      <App />
    </MuiThemeProvider>
  );
}