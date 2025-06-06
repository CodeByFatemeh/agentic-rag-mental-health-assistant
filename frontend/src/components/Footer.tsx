import { Box, Typography, useTheme } from '@mui/material';

/**
 * Footer for the app.
 */
const Footer: React.FC = () => {
    const theme = useTheme()
    const linkColor = theme.palette.primary.main
  
  return (
    <Box sx={{ py: 3, textAlign: 'center', mt: 'auto' }}>
      <Typography variant="body2" color='softGray.main'>
        &copy; {new Date().getFullYear()}
        {' '}
        <span style={{ fontWeight: 600 }}>MindEase</span> by{' '}
        <a
          href='https://www.linkedin.com/in/fatemeh-web-dev'
          color={linkColor}
          // underline="hover"
          target='_blank'
          rel='noopener noreferrer'
          style={{ color: linkColor, textDecoration: 'none' }}
        >
          Fatemeh Telgerdi
        </a>
      </Typography>
    </Box>
  );
};

export default Footer;