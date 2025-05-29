import { Box, Typography, useTheme } from '@mui/material'

const Footer = () => {
  const theme = useTheme()
  const linkColor = theme.palette.primary.main

  return (
    <Box
      component='footer'
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
      }}
    >
      <Typography variant='body2' align='center' color='softGray.main'>
        © {new Date().getFullYear()}{' '}
        <span style={{ fontWeight: 600 }}>MindEase</span> by{' '}
        <a
          href='https://www.linkedin.com/in/fatemeh-frontend-dev'
          color={linkColor}
          // underline="hover"
          target='_blank'
          rel='noopener noreferrer'
          style={{ color: linkColor, textDecoration: 'none' }}
        >
          Fatemeh Telgerdi
        </a>
        {/* Generative AI Chatbot */}
      </Typography>
    </Box>
  )
}

export default Footer
